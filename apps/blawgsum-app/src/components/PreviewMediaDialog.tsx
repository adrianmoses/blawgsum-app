import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription, DialogFooter
} from "@/src/components/ui/dialog";
import {Button} from "@/src/components/ui/button";
import {trpc} from "@/src/app/_trpc/client";
import {DialogClose} from "@radix-ui/react-dialog";
import {useState} from "react";
import {generateSlug} from "random-word-slugs";



const dataUrlToFile = async (dataUrl: string, filename: string) => {
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    return new File([blob], filename, {type: "image/jpeg"});
}

const PreviewMediaDialog = ({ userId, projectId, generatedImageBase64 } : { userId: string, projectId: string, generatedImageBase64: string }) => {
    const [uploading, setUploading] = useState(false)

    const mediaCreate = trpc.mediaCreate.useMutation()
    const saveImageAsMedia = (uploadUrl: string, filename : string) => {
        //TODO: upload base64 image to s3
        if (projectId && uploadUrl && filename) {
            mediaCreate.mutate({
                url: uploadUrl,
                mediaType: "image",
                filename: filename,
                projectId
            })
        }

    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const filename = `${userId}-${projectId}-${generateSlug()}.jpeg`
        const file = await dataUrlToFile(`data:image/jpeg;base64,${generatedImageBase64}`, filename)

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

    return (
        <Dialog>
            <DialogTrigger>
                <Button variant={"link"}>Preview Image</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Image Preview</DialogTitle>
                    <DialogDescription>
                        Take a look at the recently uploaded image
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="flex justify-center">
                        <img src={`data:image/jpeg;base64,${generatedImageBase64}`} alt={"no image"} width={300} height={300}/>
                    </div>
                    <DialogFooter className="w-full flex justify-between">
                        <DialogClose asChild>
                            <Button variant={"secondary"}>Cancel</Button>
                        </DialogClose>
                        <Button type="submit">Save</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )

}

export default PreviewMediaDialog;