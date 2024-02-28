import { z } from "zod";
import { OpenAI } from "@langchain/openai";
import { RunnableSequence } from "@langchain/core/runnables";
import { StructuredOutputParser } from "langchain/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";


const parser = StructuredOutputParser.fromZodSchema(
    z.object({
        tweets: z.array(z.string()).describe("Generated tweets"),
    })
)

export const twitterSocialGen = async (title: string, body: string) => {
    const chain = RunnableSequence.from([
        PromptTemplate.fromTemplate(
            `Generate 10 marketing tweets based on the contents of this blog post's title and body.\n\n
                {format_instructions}\n\nThe title is {title} and the body is {body}`
        ),
        new OpenAI({ temperature: 0 }),
        parser,
    ])

    const response = await chain.invoke({
        title,
        body,
        format_instructions: parser.getFormatInstructions(),
    });

    return response;
}

export const linkedInSocialGen = async (title: string, body: string) => {
    const chain = RunnableSequence.from([
        PromptTemplate.fromTemplate(
            `Generate 10 LinkedIn Posts based on the contents of this blog post's title and body.\n\n
                {format_instructions}\n\nThe title is {title} and the body is {body}`
        ),
        new OpenAI({ temperature: 0 }),
        parser,
    ])

    const response = await chain.invoke({
        title,
        body,
        format_instructions: parser.getFormatInstructions(),
    });

    return response;
}

