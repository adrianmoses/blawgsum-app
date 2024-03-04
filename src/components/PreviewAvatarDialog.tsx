import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {Avatar, AvatarFallback, AvatarImage} from "@/src/components/ui/avatar";
import {useState} from "react";
import {generateSlug} from "random-word-slugs";
import {trpc} from "@/src/app/_trpc/client";
import {useUser} from "@clerk/nextjs";
import {toast} from "@/src/components/ui/use-toast";

const AvatarDisplay = ({ previewImage } : { previewImage : File | null }) => {


    return (
        <div className="mx-auto">
            {previewImage ?
                <img src={URL.createObjectURL(previewImage)} className="w-24 h-24 rounded-full" alt="Avatar" />
                :
                <img src={"https://via.placeholder.com/500"} className="w-24 h-24 rounded-full"  alt="Avatar" />
            }
        </div>
    )
}

interface UserProps {
    id: string
    name: string | null
    email: string

}
interface UserProfileProps {
    user: UserProps
}
const PreviewAvatarDialog = ({ user } : UserProfileProps) => {
    const { user: clerkUser } = useUser()
    const [ previewImage, setPreviewImage ] = useState<File | null>(null)
    const [ uploading, setUploading ] = useState(false)
    const mediaCreate = trpc.userMediaCreate.useMutation()

    const saveImageAsMedia = (uploadUrl: string, filename : string) => {
        if (uploadUrl && filename) {
            mediaCreate.mutate({
                url: uploadUrl,
                mediaType: "image",
                filename: filename,
                userId: user.id
            })
        }
    }

    const  handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!previewImage) {
            return;
        }

        const filename = `${user.id}-avatar-${generateSlug()}.jpeg`
        const file = previewImage

        setUploading(true)

        const res = await fetch('/api/upload', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ filename: filename, contentType: file.type, userId: user.id })
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
                console.log('upload success', uploadUrl)
                await clerkUser?.setProfileImage({
                    file,
                })
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

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setPreviewImage(e.target.files[0])
        }
    }

    if (mediaCreate.isSuccess) {
        toast({
            title: "Profile Image Updated",
            description: `Your profile image has been successfully updated`,
        })
    }

    return (
        <Dialog>
            <DialogTrigger className="w-full">
                <Button>Update Profile Image</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Profile Image Preview</DialogTitle>
                    <DialogDescription>
                        Upload a new profile image
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="w-3/4 mx-auto mt-4 flex flex-col">
                        <AvatarDisplay previewImage={previewImage}/>
                        <Input
                            className="mt-4"
                            type="file"
                            onChange={onFileChange}
                        />
                        <Button type="submit" className="w-full mt-4">Update Profile Image</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default PreviewAvatarDialog