import {Table, TableBody, TableCaption, TableHead, TableHeader, TableRow} from "@/src/components/ui/table";
import {trpc} from "@/src/app/_trpc/client";
import {useRouter} from "next/navigation";
import { Badge } from "@/src/components/ui/badge"



export function ArticlesTable({ projectId } : { projectId: string }) {
  const postList = trpc.postsListByProject.useQuery({ projectId }, {enabled: !!projectId})
  const router = useRouter()

  const goToPost = (postId: string) => {
    console.log('[goToPost] clicked with postId', postId)
    router.push(`/projects/${projectId}/article/${postId}`)
  }

  return (
    <Table>
      <TableCaption>A list of articles</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Status</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Tags</TableHead>
          <TableHead>Last Saved At</TableHead>
          <TableHead>Created At</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {postList.isSuccess && postList.data && postList.data.map((post) => (
          <TableRow key={post.id} className={"cursor-pointer"} onClick={() => goToPost(post.id)}>
            <td className="py-4">{post.isPublished ? (
                <Badge variant={"secondary"}>Published</Badge>
            ) : (
                <Badge>Draft</Badge>
            )}</td>
            <td className="py-4">{post.title}</td>
            <td className="py-4">{post.categories.join(", ")}</td>
            <td className="py-4">{post.savedAt.toDateString()}</td>
            <td className="py-4">{post.createdAt.toDateString()}</td>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
