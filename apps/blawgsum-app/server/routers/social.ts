import {protectedProcedure, router} from "@/server/trpc";
import prisma from "@/server/db";
import {twitterSocialGen} from "@/src/app/content-generation/social-gen";
import * as cheerio from "cheerio";
import * as trpcServer from "@trpc/server";
import {POST as twitterQueue} from "@/src/app/api/queues/twitter/route";
import {TwitterApi} from "twitter-api-v2";
import {z} from "zod";


const socialContentListSchema = z.object({
    userId: z.string(),
    projectId: z.string(),
});

const socialContentGetSchema = z.object({
    socialContentId: z.string()
});

const socialGenerateSchema = z.object({
    userId: z.string(),
    projectId: z.string(),
});

const socialContentPostSchema = z.object({
    userId: z.string(),
    scheduledAt: z.date(),
    message: z.string(),
    mediaId: z.string().optional(),
    channel: z.string(),
    projectId: z.string(),
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
export const socialRouter = router({

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
                        twitter: { tweets: []},
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
})