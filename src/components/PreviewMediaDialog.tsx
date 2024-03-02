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


const PreviewMediaDialog = ({ userId, projectId, imageUrl } : { userId: string, projectId: string, imageUrl: string }) => {

    const mediaCreate = trpc.mediaCreate.useMutation()
    const saveImage = () => {
        const filename = imageUrl.split("/").pop()

        mediaCreate.mutate({
            userId,
            url: imageUrl,
            mediaType: "image",
            filename: filename || "",
            projectId
        })
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
                <div className="flex justify-center">
                    <img src={imageUrl} alt={"no image"} width={300} height={300} />
                </div>
                <DialogFooter className="w-full flex justify-between">
                    <DialogClose asChild>
                        <Button variant={"secondary"}>Cancel</Button>
                    </DialogClose>
                    <Button onClick={() => saveImage()}>Save</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )

}

export default PreviewMediaDialog;