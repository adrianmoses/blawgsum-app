import { Queue } from 'quirrel/next-app';

export const twitterQueue = Queue(
    'api/queues/twitter',
    async (tweet) => {
        console.log(tweet)
    }
)

export const POST = twitterQueue;