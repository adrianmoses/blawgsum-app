import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '@/server/routers/_app';
import {createContext} from "@/server/context";

// export API handler
// @see https://trpc.io/docs/server/adapters
const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    // @ts-expect-error context already passed
    createContext: createContext,
    onError({ error, path }) {
      console.error(`tRPC Error on '${path}'`, error)
    }
  })

export { handler as GET, handler as POST }
