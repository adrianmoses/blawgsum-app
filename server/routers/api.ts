import {protectedProcedure, router} from "@/server/trpc";
import crypto from "crypto";
import argon2 from "argon2";
import prisma from "@/server/db";
import {z} from "zod";

const apiKeyGetSchema = z.object({
    userId: z.string(),
    name: z.string(),
    scopes: z.array(z.string()),
    projectId: z.string()
});

const apiKeyListSchema = z.object({
    userId: z.string(),
    projectId: z.string()
});

const apiKeyDeleteSchema = z.object({
    apiKeyId: z.string()
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

export const apiRouter = router({
    apiKeyCreate: protectedProcedure
        .input(apiKeyGetSchema)
        .mutation(async ({ input }) => {
            const { userId, name,  scopes, projectId } = input;
            // generate an API key
            const baseKey = crypto.randomBytes(48).toString('base64')
            const prefix = createPrefix(projectId, 6)
            const apiKey = `${prefix}.${baseKey}`
            const hashedApiKey = await argon2.hash(apiKey)

            const apiKeyItem = await prisma.apiKey.create({
                data: {
                    userId,
                    name,
                    apiKey: hashedApiKey,
                    keyPrefix: prefix,
                    scopes,
                    projectId,
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
            const apiKeys = await prisma.apiKey.findMany({
                where: {
                    userId
                }
            })
            return apiKeys;
        }),
    apiKeyDelete: protectedProcedure
        .input(apiKeyDeleteSchema)
        .mutation(async ({ input }) => {
            const { apiKeyId } = input;
            await prisma.apiKey.delete({
                where: {
                    id: apiKeyId
                }
            })
            return true;
        })
})