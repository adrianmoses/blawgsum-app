import {protectedProcedure, publicProcedure, router} from '../trpc';
import {z} from "zod";
import prisma from '../db';
import * as trpcServer from "@trpc/server"

const postCreateSchema = z.object({
  title: z.string(),
  body: z.string(),
  authorId: z.string(),
  isPublished: z.boolean(),
  savedAt: z.date()
});

const postUpdateSchema = z.object({
  postId: z.string(),
  title: z.string(),
  body: z.string(),
  authorId: z.string(),
  isPublished: z.boolean(),
  savedAt: z.date()
});

export const appRouter = router({
  hello: publicProcedure.query(async () => "hello"),
  postCreate: protectedProcedure
    .input(postCreateSchema)
    .mutation(async (opts) => {
      const { input, ctx }  = opts;
      if (!ctx.auth?.userId) {
        throw new trpcServer.TRPCError({
          code: "CONFLICT",
          message: "No User Found for Protected Request"
        })
      }
      const post = await prisma.post.create({ data: input })
      return post
    }),
  postUpdate: protectedProcedure
    .input(postUpdateSchema)
    .mutation(async (opts) => {
      const { input, ctx }  = opts;

      if (!ctx.auth?.userId) {
        throw new trpcServer.TRPCError({
          code: "CONFLICT",
          message: "No User Found for Protected Request"
        })
      }
      const post = await prisma.post.update({
        where: {
          id: input.postId
        },
        data: input
      })
      return post;
    }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
