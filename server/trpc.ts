import {initTRPC, TRPCError} from "@trpc/server"
import superjson from 'superjson'

const t = initTRPC.context().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape
  }
})

const isAuthed = t.middleware(({ next, ctx }) => {
  return next({
    ctx: {},
  })
})


export const router = t.router;
export const publicProcedure = t.procedure
