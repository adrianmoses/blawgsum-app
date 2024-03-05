import {Card, CardContent, CardHeader, CardTitle} from "@/src/components/ui/card";
import {Button} from "@/src/components/ui/button";
import {trpc} from "@/src/app/_trpc/client";
import {timeAgo} from "@/src/app/utils/time-ago";
import {RotateCw} from "lucide-react"

const StatusCard = ({ isPublished, publishedAt, savedAt } : { isPublished: boolean, publishedAt: Date | null, savedAt: Date}) => {
   return (
     <Card>
       <CardHeader>
         <CardTitle>Status</CardTitle>
       </CardHeader>
       <CardContent>
         <div className="flex flex-col">
           <span>
             {isPublished ? "Published" : "Draft"}
           </span>
           <span>
             {isPublished && publishedAt && (
               <span className="text-xs">
               Published: {timeAgo(publishedAt)}
               </span>
             )}
           </span>
           <span className="mt-4 text-xs">
             Last Saved: <span className="text-xs">{timeAgo(savedAt)}</span>
           </span>
         </div>
       </CardContent>
     </Card>
   )
}

const PublishButton = ({ publishPost, isLoading } : { publishPost: () => void, isLoading: boolean }) => {
    return (
        <>
            {
                isLoading ? (
                    <Button className={"w-full"} disabled>
                        <RotateCw className="animate-spin mr-2 w-4 h-4" />
                        Publishing...
                    </Button>
                ) : (
                    <Button className="w-full" onClick={publishPost}>
                        Publish
                    </Button>
                )
            }
        </>
    )

}

interface ArticleSidebarProps {
  isPublished: boolean;
  publishedAt: Date | null;
  savedAt: Date;
  postId: string;
  handleSave: () => void;
}
export default function ArticleSidebar({ isPublished, publishedAt, savedAt, postId, handleSave } : ArticleSidebarProps) {
  console.log('[ArticleSidebar] isPublished', isPublished)
  const mutation = trpc.postPublish.useMutation()

  const publishPost = async () => {
    console.log('[publishPost] clicked')
    mutation.mutate({
      postId,
    })
  }

  return (
   <>
     <div className="mb-8">
       <StatusCard
         isPublished={isPublished}
         publishedAt={publishedAt}
         savedAt={savedAt}/>
     </div>
     <div className="mb-4">
       {!isPublished && (
           <PublishButton
               publishPost={publishPost}
               isLoading={mutation.isLoading}
           />
       )}
     </div>
     <div className="mb-4">
         <Button className="w-full" onClick={handleSave} variant="secondary">Save</Button>
     </div>
   </>
 )
}
