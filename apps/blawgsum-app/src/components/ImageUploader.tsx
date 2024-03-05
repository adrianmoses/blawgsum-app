"use client"
import { Input } from "@/src/components/ui/input"
import {useState} from "react";
import {Button} from "@/src/components/ui/button"
import {trpc} from "@/src/app/_trpc/client";

const ImageUploader = ({ userId, refetchImage, projectId } : { userId: string, refetchImage: () => void, projectId: string }) => {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  const mutation = trpc.mediaCreate.useMutation()

  const saveImageAsMedia = async (fileUrl: string, filename: string) => {
    if (userId && fileUrl) {
      mutation.mutate({
        url: fileUrl,
        mediaType: "image",
        filename,
        projectId
      }, {
        onSuccess: async () => {
          console.log('media created, refetching image list')
          await refetchImage()
        }
      })
    }
  }


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!file) return

    setUploading(true)

    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ filename: file.name, contentType: file.type, userId })
    })

    if (res.ok) {
      const { url } = await res.json()
      console.log('url', url)

      // const formData = new FormData()
      // // Object.entries(fields).forEach(([key, value]) => {
      // //   formData.append(key, value as string)
      // // })
      // formData.append('file', file)

      const uploadRes = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type,
          'x-amz-acl': 'public-read',
          'Access-Control-Allow-Origin': '*'
        },
        body: file
      })

      if (uploadRes.ok) {
        // url without query string
        const uploadUrl = uploadRes.url.split('?')[0]
        const filename = file.name
        console.log('upload success', uploadUrl)
        saveImageAsMedia(uploadUrl, filename);
      } else {
        console.error('upload failed', uploadRes)
      }
    } else {
      console.error('failed to get upload url', res)
    }

    setUploading(false)
    console.log('res', res)
  }

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFile(file)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col">
          <Input id="image" type="file" onChange={handleOnChange} accept="image/png, image/jpeg" />
          <Button className="mt-4" type="submit" disabled={uploading}>Upload</Button>
        </div>
      </form>
    </div>
  )

}

export default ImageUploader
