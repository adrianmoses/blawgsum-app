
import { Separator } from "@/src/components/ui/separator"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/src/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/src/components/ui/dialog"
import {trpc} from "@/src/app/_trpc/client";
import {timeAgo} from "@/src/app/utils/time-ago";
import { format } from "date-fns";
import EditSocialPostForm from "@/src/components/EditSocialPostForm";
import {Button} from "@/src/components/ui/button";

interface ScheduledPostDialogProps {
    userId: string;
    contentPost: {
        id: string;
        message: string;
        createdAt: Date;
        scheduledAt: Date;
    }
    refetch: () => void;
}

const ScheduledPostDialog = ({ userId, contentPost, refetch } : ScheduledPostDialogProps) => {
    const mutation = trpc.socialContentDelete.useMutation()

    const deletePost = () => {
        mutation.mutate({ socialContentId: contentPost.id })
    }

    if (mutation.isSuccess) {
        // refetch scheduled posts
        refetch()
    }

    return (
        <TableRow className="cursor-pointer">
            <TableCell>{"twitter"}</TableCell>
            <TableCell>{contentPost.message}</TableCell>
            <TableCell>{timeAgo(contentPost.createdAt)}</TableCell>
            <TableCell>{format(contentPost.scheduledAt, "MM/dd/yyyy")}</TableCell>
            <TableCell>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="secondary">Edit</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Social Post</DialogTitle>
                            <DialogDescription>
                                Edit the social post or reschedule
                            </DialogDescription>
                        </DialogHeader>
                        <EditSocialPostForm
                            socialContentId={contentPost.id}
                            userId={userId}
                            refetch={refetch}
                        />
                    </DialogContent>
                </Dialog>
            </TableCell>
            <TableCell>
                <Button variant="destructive" onClick={() => deletePost()}>Delete</Button>
            </TableCell>
        </TableRow>
    )
}

const ScheduledPostsTable = ({ userId } : { userId: string }) => {
    const { data, refetch } = trpc.socialContentList.useQuery({ userId: userId }, {enabled: !!userId})
    return (
        <div>
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h2 className="text-2xl font-semibold tracking-tight">
                        Scheduled Posts
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        View and manage your scheduled posts
                    </p>
                </div>
            </div>
            <Separator/>
            <div>
               <Table>
                   <TableHeader>
                       <TableHead>Channel</TableHead>
                       <TableHead>Message</TableHead>
                       <TableHead>Created</TableHead>
                       <TableHead>Scheduled</TableHead>
                       <TableHead>Edit</TableHead>
                       <TableHead>Delete</TableHead>
                   </TableHeader>
                   <TableBody>
                       {data &&
                           data.map((contentPost, index) => (
                           <ScheduledPostDialog
                               key={index}
                               userId={userId}
                               contentPost={contentPost}
                               refetch={refetch}
                           />
                       ))}
                   </TableBody>
               </Table>
            </div>
        </div>
    )
}

export default ScheduledPostsTable;