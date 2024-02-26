import { Queue } from 'quirrel/next-app';
import prisma from '@/server/db'
import { TwitterApi } from 'twitter-api-v2';

const twitterQueue = Queue(
    `${process.env.QUIRREL_API_URL}/api/queues/twitter`,
    async (payload: { socialContentId: string }) => {
        const { socialContentId } = payload;
        console.log(socialContentId)

        const provider = await prisma.socialProvider.findUnique({
            where: {
                provider: 'twitter'
            }
        })

        const socialContent = await prisma.socialContent.findUnique({
            where: {
                id: socialContentId
            }
        })

        if (!socialContent) {
            return
        }

        const socialAuth = await prisma.socialAuth.findFirst({
            where: {
                userId: socialContent?.userId,
                providerId: provider?.id
            }
        })

        if (!socialAuth) {
            return
        }

        const { accessToken, refreshToken, expiresIn, updatedAt } = socialAuth;
        // @ts-ignore
        if (Math.round(updatedAt / 1000) + expiresIn < Date.now() / 1000) {
            // refresh token
            const client = new TwitterApi({
                clientId: process.env.TWITTER_CLIENT_ID!,
                clientSecret: process.env.TWITTER_CLIENT_SECRET!
            })
            const {
                client: refreshedClient,
                accessToken,
                refreshToken: newRefreshToken } = await client.refreshOAuth2Token(refreshToken);

            const {data: createdTweet } = await refreshedClient.v2.tweet(socialContent?.message)
            console.log(createdTweet)

            //save new accessToken and refreshToken
            await prisma.socialAuth.update({
                where: {
                    id: socialAuth.id
                },
                data: {
                    accessToken,
                    refreshToken: newRefreshToken
                }
            })
            return
        }

        const client = new TwitterApi(accessToken)
        const {data: createdTweet } = await client.v2.tweet(socialContent?.message)
        console.log(createdTweet)
        return

    }
)

export { twitterQueue as POST };