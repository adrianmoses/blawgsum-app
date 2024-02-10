import {Table, TableBody, TableCaption, TableHead, TableHeader, TableRow} from "@/src/components/ui/table";
import {trpc} from "@/src/app/_trpc/client";
import {useRouter} from "next/navigation";


export function ArticlesTable({ userId } : { userId: string }) {
  const postList = trpc.postsListByAuthor.useQuery({ authorId: userId }, {enabled: !!userId})
  const router = useRouter()

  const goToPost = (postId: string) => {
    console.log('[goToPost] clicked with postId', postId)
    router.push(`/admin/article/${postId}`)
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
            <td>{post.isPublished ? "Published" : "Draft"}</td>
            <td>{post.title}</td>
            <td>{post.categories.join(", ")}</td>
            <td>{post.savedAt.toDateString()}</td>
            <td>{post.createdAt.toDateString()}</td>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
