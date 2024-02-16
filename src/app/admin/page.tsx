"use client";
import {ArticlesTable} from "@/src/components/ArticlesTable";
import {useAuth} from "@clerk/nextjs";
import {trpc} from "@/src/app/_trpc/client";
import AdminNavigation from "@/src/components/AdminNavigation";

export default function AdminPage() {
  const { userId } : { userId: string | null | undefined } = useAuth();
  // @ts-ignore
  const userGet = trpc.userGet.useQuery({ clerkUserId: userId }, {enabled: !!userId})

  return (
    <>
      <div className="hidden h-full flex-col md:flex">
        <AdminNavigation
          pageName={"Articles"}
          userId={userGet.data?.id}/>
        <div className="w-full flex py-4">
          <div className="sidebar py-4 px-8 w-2/12">
            <div className="side-nav flex flex-col justify-around">
            </div>
          </div>
          <div className="section w-10/12 px-8 py-4">
            {userGet.data && (
              <ArticlesTable userId={userGet.data.id}/>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
