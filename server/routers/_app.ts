import {protectedProcedure, publicProcedure, router} from '../trpc';
import {z} from "zod";
import prisma from '../db';
import * as trpcServer from "@trpc/server"
import crypto from "crypto";
import argon2 from "argon2";
import * as cheerio from "cheerio"
import { TwitterApi } from 'twitter-api-v2';
import { POST as twitterQueue } from "@/src/app/api/queues/twitter/route";
import {twitterSocialGen} from "@/src/app/content-generation/social-gen";

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

const twitterAuthLinkSchema = z.object({
    userId: z.string()
});

const twitterAuthLoginSchema = z.object({
    userId: z.string(),
    code: z.string(),
    state: z.string(),
    codeVerifier: z.string(),
    sessionState: z.string()
});

const twitterAuthGetSchema = z.object({
    userId: z.string()
});

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
            console.log("no posts for user yet")
            return {
                twitter: {
                    tweets: []
                },
                linkedin: []
            }
        }

        try {
            // use AI api to fetch generated content
            const resp = await twitterSocialGen(post?.title, cheerio.load(post?.body).text())

            if (resp) {
                return {
                    twitter: resp,
                    linkedin: []
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
            const { userId, scheduledAt, message, mediaId, channel } = input;
            const providerId = await prisma.socialProvider.findUnique({
                where: {
                    provider: channel
                }
            })

            if (!providerId) {
                throw new trpcServer.TRPCError({
                    code: "NOT_FOUND",
                    message: `Social Provider Not Found For Channel ${channel}`
                })
            }


            const socialContent = await prisma.socialContent.create({
                data: {
                    userId,
                    scheduledAt,
                    message,
                    media: mediaId,
                    isSent: false,
                    providerId: providerId.id,
                }
            })

            await twitterQueue.enqueue({ socialContentId: socialContent.id },
                {
                    runAt: scheduledAt
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
    twitterAuthLink: protectedProcedure
        .input(twitterAuthLinkSchema)
        .query(async ({ ctx }) => {
            const client = new TwitterApi({
                clientId: process.env.TWITTER_CLIENT_ID!,
                clientSecret: process.env.TWITTER_CLIENT_SECRET!
            })

            const { url, codeVerifier, state } = client.generateOAuth2AuthLink(
                process.env.TWITTER_CALLBACK_URI!, {
                    scope: ["tweet.read", "users.read", "tweet.write", "offline.access"]
                })


            return {
                url,
                codeVerifier,
                state
            }
        }),
    twitterAuthLogin: protectedProcedure
        .input(twitterAuthLoginSchema)
        .mutation(async ({ input }) => {
            const { code, state, codeVerifier, sessionState, userId } = input;
            const client = new TwitterApi({
                clientId: process.env.TWITTER_CLIENT_ID!,
                clientSecret: process.env.TWITTER_CLIENT_SECRET!
            })

            if (!code || !state || !codeVerifier || !sessionState) {
                throw new trpcServer.TRPCError({
                    code: "BAD_REQUEST",
                    message: "Twitter App was Denied or Session expired"
                })
            }

            if (!state || !sessionState) {
                throw new trpcServer.TRPCError({
                    code: "BAD_REQUEST",
                    message: "Session tokens dont match"
                })
            }

            const providerId = await prisma.socialProvider.findUnique({
                where: {
                    provider: "twitter"
                }
            })

            if (!providerId) {
                throw new trpcServer.TRPCError({
                    code: "NOT_FOUND",
                    message: "Twitter Provider Not Found"
                })
            }


            try {
                const {
                    client: loggedClient,
                    accessToken,
                    refreshToken,
                    expiresIn
                } = await client.loginWithOAuth2({ code, codeVerifier,
                    redirectUri: process.env.TWITTER_CALLBACK_URI! })

                const { data: userObject } = await loggedClient.v2.me();
                console.info("Twitter User Object: ", userObject)

                if (!refreshToken ) {
                    throw new trpcServer.TRPCError({
                        code: "BAD_REQUEST",
                        message: "No Refresh Token Found"
                    })
                }

                const socialAuth = await prisma.socialAuth.create({
                    data: {
                        userId,
                        accessToken,
                        refreshToken,
                        expiresIn,
                        providerId: providerId?.id
                    }
                })

                return socialAuth.id

            } catch (e) {
                console.error(e)

                throw new trpcServer.TRPCError({
                    code: "BAD_REQUEST",
                    message: "Invalid verifier or access tokens!"
                })
            }

        }),
        twitterAuthGet: protectedProcedure
            .input(twitterAuthGetSchema)
            .query(async ({ input }) => {

                const { userId } = input

                const providerId = await prisma.socialProvider.findUnique({
                    where: {
                        provider: "twitter"
                    }
                })

                if (!providerId) {
                    throw new trpcServer.TRPCError({
                        code: "NOT_FOUND",
                        message: "Twitter Provider Not Found"
                    })
                }

                const socialAuth = await prisma.socialAuth.findFirst({
                    where: {
                        userId,
                        providerId: providerId.id
                    }
                })

                return socialAuth
            })

});

// export type definition of API
export type AppRouter = typeof appRouter;
