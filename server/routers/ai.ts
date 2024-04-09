import {z} from "zod";
import {protectedProcedure, router} from "@/server/trpc";
import axios from "axios";

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
            const response = await axios.post(
                "https://blawgsum-api.adrian-5c0.workers.dev/api/image", { prompt }, { responseType: 'arraybuffer' });
            const pngBuffer = response.data;
            const imageB64 = Buffer.from(pngBuffer, 'binary').toString('base64');
            // return `data:image/png;base64,${base64String}`;
            return { dataURL: `data:image/png;base64,${imageB64}` };
        })
})
