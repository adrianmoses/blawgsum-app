import {protectedProcedure, router} from "@/server/trpc";
import prisma from "@/server/db";
import {z} from "zod";


const mediaCreateSchema = z.object({
    url: z.string(),
    mediaType: z.string().default("image"),
    filename: z.string(),
    projectId: z.string()
});

const mediaListSchema = z.object({
    projectId: z.string()
});

const mediaUpdateSchema = z.object({
    mediaId: z.string(),
    name: z.string()
})

const mediaDeleteSchema = z.object({
    mediaId: z.string(),
})

export const mediaRouter = router({

    mediaCreate: protectedProcedure
        .input(mediaCreateSchema)
        .mutation(async ({ input }) => {
            const { mediaType, filename, url, projectId } = input;

            const mediaItem = await prisma.media.create({
                data: {
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
            const { projectId } = input;
            const media = await prisma.media.findMany({
                where: {
                    projectId,
                }
            })
            return media;
        }),
    mediaUpdate: protectedProcedure
        .input(mediaUpdateSchema)
        .mutation(async ({ input }) => {
            const { mediaId, name } = input;
            const media = await prisma.media.update({
                where: {
                    id: mediaId
                },
                data: {
                    name
                }
            })

        }),
    mediaDelete: protectedProcedure
        .input(mediaDeleteSchema)
        .mutation(async ({ input }) => {
            const { mediaId } = input;
            await prisma.media.delete({
                where: {
                    id: mediaId
                }
            })
        }),
})