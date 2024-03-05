import {protectedProcedure, router} from "@/server/trpc";
import prisma from "@/server/db";
import {z} from "zod";


const projectGetSchema = z.object({
    projectId: z.string()
})

const projectListSchema = z.object({
    userId: z.string()
})

const projectCreateSchema = z.object({
    userId: z.string(),
    name: z.string(),
    description: z.string().optional(),
})
export const projectRouter = router({
    projectList: protectedProcedure
        .input(projectListSchema)
        .query(async ({ input }) => {
            const { userId } = input;
            const projects = await prisma.project.findMany({
                where: {
                    userId
                }
            })
            return projects
        }),
    projectGet: protectedProcedure
        .input(projectGetSchema)
        .query(async ({ input }) => {
            const { projectId } = input;
            const project = await prisma.project.findUnique({
                where: {
                    id: projectId
                }
            })
            return project
        }),
    projectCreate: protectedProcedure
        .input(projectCreateSchema)
        .mutation(async ({ input }) => {
            const { userId, name, description } = input;
            const project = await prisma.project.create({
                data: {
                    userId,
                    name,
                    description
                }
            })
            return project
        }),
});