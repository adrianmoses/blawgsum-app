import {protectedProcedure, router} from "@/server/trpc";
import * as trpcServer from "@trpc/server";
import prisma from "@/server/db";
import {z} from "zod";

const userGetSchema = z.object({
    clerkUserId: z.string()
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

        })
});
