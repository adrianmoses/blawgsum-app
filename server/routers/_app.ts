import {protectedProcedure, publicProcedure, router} from '../trpc';
import {z} from "zod";
import prisma from '../db';
import * as trpcServer from "@trpc/server"
import crypto from "crypto";
import argon2 from "argon2";
import axios from "axios";
import * as cheerio from "cheerio"

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

const apiKeyGetSchema = z.object({
  userId: z.string(),
  name: z.string(),
  scopes: z.array(z.string())
});

const apiKeyListSchema = z.object({
  userId: z.string()
});

const socialContentListSchema = z.object({
    userId: z.string(),
});

const socialContentGetSchema = z.object({
    socialContentId: z.string()
});

const socialGenerateSchema = z.object({
  userId: z.string()
});

const socialContentPostSchema = z.object({
    userId: z.string(),
    scheduledAt: z.date(),
    message: z.string(),
    mediaId: z.string().optional(),
    channel: z.string(),
    channelUserHandle: z.string()
})

const socialContentPutSchema = z.object({
    socialContentId: z.string(),
    scheduledAt: z.date(),
    message: z.string(),
    mediaId: z.string().optional(),
})

const socialContentDeleteSchema = z.object({
    socialContentId: z.string(),
})

const createPrefix = (userId: string, prefixLength: number) => {
  const userIdArr = userId.split("")
  const prefixArr = []
  for (let i = 0; i <= prefixLength; i++) {
    const char = userIdArr[(Math.floor(Math.random() * userIdArr.length))]
    prefixArr.push(char)
  }
  return prefixArr.join("")
}

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
    }),
  apiKeyCreate: protectedProcedure
    .input(apiKeyGetSchema)
    .mutation(async ({ input }) => {
      const { userId, name,  scopes } = input;
      // generate an API key
      const baseKey = crypto.randomBytes(48).toString('base64')
      const prefix = createPrefix(userId, 6)
      const apiKey = `${prefix}.${baseKey}`
      const hashedApiKey = await argon2.hash(apiKey)

      const apiKeyItem = await prisma.userApiKey.create({
        data: {
          userId,
          name,
          apiKey: hashedApiKey,
          keyPrefix: prefix,
          scopes
        }
      })

      return {
        apiKey
      };
    }),
  apiKeyList: protectedProcedure
    .input(apiKeyListSchema)
    .query(async ({ input }) => {
      const { userId } = input;
      const apiKeys = await prisma.userApiKey.findMany({
        where: {
          userId
        }
      })
      return apiKeys;
    }),
  socialContentGet: protectedProcedure
    .input(socialContentGetSchema)
    .query(async ({ input }) => {
        const { socialContentId } = input;
        const socialContent = await prisma.socialContent.findUnique({
            where: {
                id: socialContentId
            }
        })
        return socialContent;
    }),
  socialContentList: protectedProcedure
      .input(socialContentListSchema)
      .query(async ({ input }) => {
          const { userId } = input;
          // fetch scheduled social content
          const socialContent = await prisma.socialContent.findMany({
              where: {
                  userId,
                  sentAt: null
              },
              orderBy: {
                    scheduledAt: "asc"
              }
          })
          return socialContent;
      }),
  socialGenerate: protectedProcedure
    .input(socialGenerateSchema)
    .query(async ({ input }) => {
        const { userId } = input;
        // fetch post contents
        const post = await prisma.post.findFirst({
            where: {
                authorId: userId,
                // isPublished: true
            },
            orderBy: {
                publishedAt: "desc"
            }
        })

        if (!post) {
            throw new trpcServer.TRPCError({
                code: "NOT_FOUND",
                message: "No Published Posts Found"
            })
        }

        try {
            // use AI api to fetch generated content
            const resp = await axios.post("http://127.0.0.1:8000/api/generate-social", {
                title: post?.title,
                body: cheerio.load(post?.body).text(),
            }, {
                headers: {
                    "Allow-Control-Allow-Origin": "*",
                    "Content-Type": "application/json",
                }
            })

            if (resp.data) {
                return {
                    twitter: resp.data.twitter,
                    linkedin: resp.data.linkedin
                }
            } else {
                return {
                    twitter: [],
                    linkedin: []
                }
            }
        } catch (e) {
            console.error("Error: ", e)
            throw new trpcServer.TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Failed to generate social content"
            })
        }
    }),
    socialContentPost: protectedProcedure
        .input(socialContentPostSchema)
        .mutation(async ({ input }) => {
            const { userId, scheduledAt, message, mediaId, channel, channelUserHandle } = input;
            const socialContent = await prisma.socialContent.create({
                data: {
                    userId,
                    scheduledAt,
                    message,
                    media: mediaId,
                    channel,
                    channelUserHandle,
                    isSent: false
                }
            })
            return socialContent;

        }),
    socialContentPut: protectedProcedure
        .input(socialContentPutSchema)
        .mutation(async ({ input }) => {
            const { socialContentId, scheduledAt, message, mediaId} = input;
            const socialContent = await prisma.socialContent.update({
                where: {
                    id: socialContentId
                },
                data: {
                    scheduledAt,
                    message,
                    media: mediaId,
                    isSent: false
                }
            })
            return socialContent;

        }),
    socialContentDelete: protectedProcedure
        .input(socialContentDeleteSchema)
        .mutation(async ({ input }) => {
            const { socialContentId} = input;
            const socialContent = await prisma.socialContent.delete({
                where: {
                    id: socialContentId
                },
            })
            return socialContent;

        }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
