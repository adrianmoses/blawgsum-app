import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { Separator } from "@/src/components/ui/separator";
import {UserButton} from "@clerk/nextjs";
import {generateSlug} from "random-word-slugs";
import {trpc} from "@/src/app/_trpc/client";
import {redirect} from "next/navigation";

interface AdminNavigationProps {
  pageName: string | undefined
  userId: string | undefined;
}

const AdminNavigation = ({ pageName, userId } : AdminNavigationProps) => {
  const mutation = trpc.postCreate.useMutation()

  const createEmptyArticle = () => {
    console.log('[createEmptyArticle] user', userId)
    if (userId) {
      mutation.mutate({
        title: "Untitled",
        body: "",
        slug: generateSlug(),
        authorId: userId,
        isPublished: false,
        savedAt: new Date()
      })
    } else {
      console.error('No userId')
    }
  }

  if (mutation.isSuccess && mutation.data) {
    const postId = mutation.data.id
    redirect(`/admin/article/${postId}`)
  }

  return (
    <>
      <div
        className="container flex flex-col items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-16">
        <h2 className="text-lg font-semibold">{pageName}</h2>
        <div className="ml-auto flex space-x-2 sm:justify-end">
          <div className="flex items-center">
            <div className="mr-4">
              <Link href={"/admin/"}>
                Articles
              </Link>
            </div>
            <div className="mr-4">
              <Link href={"/admin/social"}>
                Social
              </Link>
            </div>
            <div className="mr-4">
              <Link href={"/admin/media"}>
                Media
              </Link>
            </div>
            <div className="mr-4">
              <Link href={"/admin/settings/api-keys"}>
                API Keys
              </Link>
            </div>
            <Button className="mr-4" onClick={() => {
              createEmptyArticle()
            }}>
              New Article
            </Button>
            <UserButton afterSignOutUrl={"/"}/>
          </div>
        </div>
      </div>
      <Separator/>
    </>
  )
}

export default AdminNavigation
