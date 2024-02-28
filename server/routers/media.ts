import {protectedProcedure, router} from "@/server/trpc";
import prisma from "@/server/db";
import * as trpcServer from "@trpc/server";
import {z} from "zod";


const mediaCreateSchema = z.object({
    userId: z.string(),
    url: z.string(),
    mediaType: z.string().default("image"),
    filename: z.string(),
    projectId: z.string()
});

const mediaListSchema = z.object({
    userId: z.string(),
    projectId: z.string()
});

export const mediaRouter = router({

    mediaCreate: protectedProcedure
        .input(mediaCreateSchema)
        .mutation(async ({ input }) => {
            const { userId, mediaType, filename, url, projectId } = input;
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

            const mediaItem = await prisma.media.create({
                data: {
                    userId,
                    mediaType,
                    filename,
                    url,
                    projectId
                }
            })

            return mediaItem;
        }),
    mediaList: protectedProcedure
        .input(mediaListSchema)
        .query(async ({ input }) => {
            const { userId, projectId } = input;
            const media = await prisma.media.findMany({
                where: {
                    userId,
                    projectId,
                }
            })
            return media;
        }),
})