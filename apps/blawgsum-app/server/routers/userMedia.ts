import {z} from "zod";
import prisma from "@/server/db";
import {protectedProcedure, router} from "@/server/trpc";

const userMediaCreateSchema = z.object({
    url: z.string(),
    mediaType: z.string().default("image"),
    filename: z.string(),
    userId: z.string()
});

export const userMediaRouter = router({
    userMediaCreate: protectedProcedure
        .input(userMediaCreateSchema)
        .mutation(async ({input}) => {
            const {mediaType, filename, url, userId} = input;

            await prisma.userMedia.create({
                data: {
                    mediaType,
                    filename,
                    url,
                    userId
                }
            })

            const user = await prisma.user.findUnique({
                where: {
                    id: userId
                },
                include: {
                    avatarImage: true
                }
            })

            return user;
        }),
});
