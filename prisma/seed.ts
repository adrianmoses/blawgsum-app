import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
    const providers = ["twitter", "linkedin"];

    for (const provider of providers) {
        const existingProvider = await prisma.socialProvider.findUnique({
           where: {
               provider
           }
        });

        if (existingProvider) {
            console.log(`Provider ${provider} already exists`)
            continue;
        }
        await prisma.socialProvider.create({
            data: {
                provider
            }
        })
    }
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })