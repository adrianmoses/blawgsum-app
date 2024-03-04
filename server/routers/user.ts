import {protectedProcedure, router} from "@/server/trpc";
import * as trpcServer from "@trpc/server";
import prisma from "@/server/db";
import {z} from "zod";

const userGetSchema = z.object({
    clerkUserId: z.string()
})

const userUpdateSchema = z.object({
    userId: z.string(),
    name: z.string(),
    avatarImageId: z.string().optional()
})
export const userRouter = router({
    userGet: protectedProcedure
        .input(userGetSchema)
        .query(async ({input, ctx}) => {
            if (!ctx.auth.userId) {
                throw new trpcServer.TRPCError({
                    code: "UNAUTHORIZED",
                    message: "No User Found for Protected Request"
                })
            }

            const {clerkUserId} = input;
            const user = await prisma.user.findUnique({
                where: {
                    clerkUserId
                }
            })

            return user;

        }),
    userUpdate: protectedProcedure
        .input(userUpdateSchema)
        .mutation(async ({input}) => {
            const {userId, name, avatarImageId} = input;
            const user = await prisma.user.update({
                where: {
                    id: userId
                },
                data: {
                    name,
                    avatarImageId
                }
            })

            return user;
        }),
});
