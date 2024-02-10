import {NextRequest, NextResponse} from "next/server";
import prisma from "@/server/db"
import {z} from "zod";

const userSyncSchema = z.object({
  data: z.object({
    id: z.string(),
    email_addresses: z.array(z.object({
      email_address: z.string()
    }))
  })
})

export async function POST(req: NextRequest) {

  const data = await req.json()
  const response = userSyncSchema.parse(data);

  console.log(response)

  const { data: { id, email_addresses } } = response;

  if (!email_addresses || email_addresses.length <= 0) {
    return NextResponse.json({
        code: "BAD_REQUEST",
        message: "No Email Address Found"
      },
      {
        status: 400
      });
  }

  const email = email_addresses[0].email_address

  let existingUser = await prisma.user.findUnique({
    where: {
      email
    }
  })

  if (!existingUser) {
    const newUser = await prisma.user.create({
      data: {
        email,
        clerkUserId: id
      }
    })
    existingUser = newUser;
  } else {
    existingUser = await prisma.user.update({
      where: {
        email
      },
      data: {
        clerkUserId: id
      }
    })
  }

  return NextResponse.json({ user: existingUser }, { status: 200 })
}
