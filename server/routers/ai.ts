import {z} from "zod";
import {protectedProcedure, router} from "@/server/trpc";
import {generateImage} from "@/src/app/content-generation/image-gen";

const imageGenerateSchema = z.object({
    prompt: z.string(),
    userId: z.string(),
    projectId: z.string()
});

export const aiRouter = router({
    imageGenerate: protectedProcedure
        .input(imageGenerateSchema)
        .mutation(async ({ input }) => {
            const { prompt } = input;
            const imageUrl = await generateImage(prompt)
            return { imageUrl };
        })
})
