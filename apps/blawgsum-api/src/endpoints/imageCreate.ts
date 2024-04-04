import {
    OpenAPIRoute,
    OpenAPIRouteSchema,
} from "@cloudflare/itty-router-openapi";
import { Ai } from '@cloudflare/ai'
import { ImagePrompt} from "../types";
import type { AiEnv } from "../types";

export class ImageCreate extends OpenAPIRoute {
    static schema: OpenAPIRouteSchema = {
        tags: ["Images"],
        summary: "Create a new Image",
        requestBody: ImagePrompt,
        responses: {
            "200": {
                description: "Returns the created image",
                schema: {},
            },
        },
    };

    async handle(
        request: Request,
        env: AiEnv,
        context: any,
        data: Record<string, any>
    ) {
        // Retrieve the validated request body
        const ai = new Ai(env.AI);

        const inputs = {
            prompt: data.body.prompt,
        }

        const response  = await ai.run(
            "@cf/bytedance/stable-diffusion-xl-lightning",
            inputs
        )

        const contentType = "image/png"
        return new Response(response, {
            headers:
                {
                    "Content-Type": contentType
                }
        });
    }
}
