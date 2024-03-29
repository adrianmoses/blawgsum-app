import OpenAI from "openai"


const openai = new OpenAI()

export const generateImage = async (text: string) => {
    const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: text,
        n: 1,
        size: "1024x1024",
        response_format: "b64_json"
    })

    console.log(response.data)
    return response.data[0].b64_json
}