import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/src/components/ui/dialog"
import { Button } from "@/src/components/ui/button"
import { PlusCircle } from "lucide-react";
import NewSocialPostForm from "@/src/components/NewSocialPostForm";

const AddNewSocialPostDialog = ({ userId } : { userId: string }) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add New Social Post
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Social Post</DialogTitle>
                    <DialogDescription>
                        Create a new social post to be scheduled
                    </DialogDescription>
                </DialogHeader>
                <NewSocialPostForm userId={userId} />
            </DialogContent>
        </Dialog>
    )
}

export default AddNewSocialPostDialog