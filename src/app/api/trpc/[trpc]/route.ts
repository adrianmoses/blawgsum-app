import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '@/server/routers/_app';

// export API handler
// @see https://trpc.io/docs/server/adapters
const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    // @ts-ignore
    createContext: () => ({}),
  })

export { handler as GET, handler as POST }
