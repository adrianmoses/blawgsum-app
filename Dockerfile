# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=18.17.0
FROM node:${NODE_VERSION}-slim as base

LABEL fly_launch_runtime="Next.js/Prisma"

# Next.js/Prisma app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"


# Throw-away build stage to reduce size of final image
FROM base as build

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp openssl pkg-config python-is-python3

# Install node modules
COPY --link package-lock.json package.json ./
RUN npm ci --include=dev

# Generate Prisma Client
COPY --link prisma .
RUN npx prisma generate

# Copy application code
COPY --link . .

# Build application
RUN --mount=type=secret,id=DATABASE_URL \
    --mount=type=secret,id=DIRECT_URL \
    --mount=type=secret,id=NEXT_PUBLIC_PERISHABLE_KEY \
    --mount=type=secret,id=OPENAI_API_KEY \
    --mount=type=secret,id=CLERK_SECRET_KEY \
    DATABASE_URL="$(cat /run/secrets/DATABASE_URL)" \
    DIRECT_URL="$(cat /run/secrets/DIRECT_URL)" \
    NEXT_PUBLIC_PERISHABLE_KEY="$(cat /run/secrets/NEXT_PUBLIC_PERISHABLE_KEY)" \
    OPENAI_API_KEY="$(cat /run/secrets/OPENAI_API_KEY)" \
    CLERK_SECRET_KEY="$(cat /run/secrets/CLERK_SECRET_KEY)" \
    npm run build

# Remove development dependencies
RUN npm prune --omit=dev


# Final stage for app image
FROM base

# Install packages needed for deployment
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y openssl && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives

# Copy built application
COPY --from=build /app /app

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000
CMD [ "npm", "run", "start" ]
