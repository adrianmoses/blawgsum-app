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
  slug: z.string(),
  authorId: z.string(),
  isPublished: z.boolean(),
  savedAt: z.date()
});

const postUpdateSchema = z.object({
  postId: z.string(),
  title: z.string(),
  slug: z.string(),
  body: z.string(),
  authorId: z.string(),
  savedAt: z.date(),
  coverImage: z.string().optional(),
  publishedAt: z.date().optional()
});

const postListByAuthorSchema = z.object({
  authorId: z.string()
});

const userGetSchema = z.object({
  clerkUserId: z.string()
})

const postPublishSchema = z.object({
  postId: z.string(),
  publishedAt: z.date().default(new Date())
});

const mediaCreateSchema = z.object({
  userId: z.string(),
  url: z.string(),
  mediaType: z.string().default("image"),
  filename: z.string()
});

const mediaListSchema = z.object({
  userId: z.string(),
});

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
        data: {
          title: input.title,
          slug: input.slug,
          body: input.body,
          authorId: input.authorId,
          savedAt: input.savedAt,
          publishedAt: input.publishedAt,
          coverImage: input.coverImage
        }
      })
      return post;
    }),
  postsListByAuthor: protectedProcedure
    .input(postListByAuthorSchema)
    .query(async ({ input }) => {
      const { authorId } = input;
      const posts = await prisma.post.findMany({
        where: {
          authorId,
        },
        include: {
          categories: true
        },
        orderBy: {
          savedAt: "desc"
        }
      })
      return posts;
    }),
  postPublish: protectedProcedure
    .input(postPublishSchema)
    .mutation(async ({ input }) => {
      const { postId, publishedAt } = input;
      const post = await prisma.post.update({
        where: {
          id: postId
        },
        data: {
          isPublished: true,
          publishedAt
        }
      })
      return post;
    }),
  mediaCreate: protectedProcedure
    .input(mediaCreateSchema)
    .mutation(async ({ input }) => {
      const { userId, mediaType, filename, url } = input;
      const user = await prisma.user.findUnique({
        where: {
          id: userId
        }
      })

      if (!user) {
        throw new trpcServer.TRPCError({
          code: "NOT_FOUND",
          message: "User Not Found"
        })
      }

      const mediaItem = await prisma.userMedia.create({
        data: {
          userId,
          mediaType,
          filename,
          url
        }
      })

      return mediaItem;
    }),
  mediaList: protectedProcedure
    .input(mediaListSchema)
    .query(async ({ input }) => {
      const { userId } = input;
      const media = await prisma.userMedia.findMany({
        where: {
          userId
        }
      })
      return media;
    })
});

// export type definition of API
export type AppRouter = typeof appRouter;
