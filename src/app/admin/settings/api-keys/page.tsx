"use client";
import AdminNavigation from "@/src/components/AdminNavigation";
import {useAuth} from "@clerk/nextjs";
import {trpc} from "@/src/app/_trpc/client";


export default function ApiKeysPage() {

  const { userId } : { userId: string | null | undefined } = useAuth();
  // @ts-ignore
  const userGet = trpc.userGet.useQuery({ clerkUserId: userId }, {enabled: !!userId})
  //add query to get api key and generate if not exists
  return (
    <div>
      <AdminNavigation
        pageName="API Keys"
        userId={userGet.data?.id} />
    </div>
  )
}
