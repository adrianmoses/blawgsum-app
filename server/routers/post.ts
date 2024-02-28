import {protectedProcedure, router} from "@/server/trpc";
import prisma from "@/server/db";
import * as trpcServer from "@trpc/server";
import {z} from "zod";

const postGetSchema = z.object({
    postId: z.string()
});

const postCreateSchema = z.object({
    title: z.string(),
    body: z.string(),
    slug: z.string(),
    authorId: z.string(),
    isPublished: z.boolean(),
    projectId: z.string(),
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

const postListByProjectSchema = z.object({
    projectId: z.string()
});

const postListByAuthorSchema = z.object({
    authorId: z.string()
});

const postPublishSchema = z.object({
    postId: z.string(),
    publishedAt: z.date().default(new Date())
});
export const postRouter = router({
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
    postsListByProject: protectedProcedure
        .input(postListByProjectSchema)
        .query(async ({ input }) => {
            const { projectId } = input;
            const posts = await prisma.post.findMany({
                where: {
                    projectId,
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
});
