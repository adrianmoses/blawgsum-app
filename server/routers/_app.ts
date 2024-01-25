import {protectedProcedure, publicProcedure, router} from '../trpc';
import {z} from "zod";
import prisma from '../db';
import * as trpcServer from "@trpc/server"

const postGetSchema = z.object({
  postId: z.string()
});

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

const userGetSchema = z.object({
  clerkUserId: z.string()
})

export const appRouter = router({
  hello: publicProcedure.query(async () => "hello"),
  userGet: protectedProcedure
    .input(userGetSchema)
    .query(async ({ input, ctx }) => {
      if (!ctx.auth.userId){
        throw new trpcServer.TRPCError({
          code: "UNAUTHORIZED",
          message: "No User Found for Protected Request"
        })
      }

      const { clerkUserId } = input;
      const user = await prisma.user.findUnique({
        where: {
          clerkUserId
        }
      })

      return user;

    }),
  postGet: protectedProcedure
    .input(postGetSchema)
    .query(async (opts) => {
      const { input: { postId } } = opts;

      const post = await prisma.post.findUnique({
        where: {
          id: postId
        }
      })

      if (!post) {
        throw new trpcServer.TRPCError({
          code: "NOT_FOUND",
          message: "Post Not Found"
        })
      }
      return post
    }),
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
