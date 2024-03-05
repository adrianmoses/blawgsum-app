import { createPresignedPost } from '@aws-sdk/s3-presigned-post'
import {PutObjectCommand, S3} from '@aws-sdk/client-s3'
import { v4 as uuidv4 } from 'uuid'
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";

export async function POST(request: Request) {
  const { filename, contentType, userId } = await request.json()

  try {
    const client = new S3({
      forcePathStyle: false,
      endpoint: process.env.AWS_ENDPOINT,
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.SPACES_KEY!,
        secretAccessKey: process.env.SPACES_SECRET!,
      }
    })

    const fileKey = `user/${userId}/image/${uuidv4()}/${filename}`;
    // const { url, fields } = await createPresignedPost(client, {
    //   Bucket: process.env.SPACES_BUCKET as string,
    //   Key: fileKey,
    //   Conditions: [
    //     ['content-length-range', 0, 10485760], // up to 10 MB
    //     ['starts-with', '$Content-Type', contentType],
    //     ['starts-with', '$key', 'user/'],
    //   ],
    //   Fields: {
    //     acl: 'public-read',
    //     'Content-Type': contentType,
    //     key: fileKey,
    //   },
    //   Expires: 600, // Seconds before the presigned post expires. 3600 by default.
    // })

    const command = new PutObjectCommand({
      Bucket: process.env.SPACES_BUCKET as string,
      Key: fileKey,
      ContentType: contentType,
      ACL: 'public-read',
    })

    const url = await getSignedUrl(client, command, { expiresIn: 600 })

    return Response.json({ url })
  } catch (error) {
    // @ts-ignore
    return Response.json({ error: error.message })
  }
}
