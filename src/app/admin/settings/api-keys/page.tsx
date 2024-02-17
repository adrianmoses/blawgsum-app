"use client";
import AdminNavigation from "@/src/components/AdminNavigation";
import ApiKeysTable from "@/src/components/ApiKeysTable";
import {useAuth} from "@clerk/nextjs";
import {trpc} from "@/src/app/_trpc/client";
import ApiKeyDialog from "@/src/components/ApiKeyDialog";


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
      <div className="flex flex-col w-full h-screen justify-start items-center mt-8">
        <h1 className="text-xl">Manage API Keys</h1>
        <p className="mt-4">API Keys are used to authenticate with the Blawgsum API</p>
        <div className="flex flex-col mt-16">
          <div>
            {userGet.data?.id && (
              <ApiKeysTable userId={userGet.data?.id}/>
            )}
          </div>
          <div>
            {userGet.data?.id && (
              <ApiKeyDialog userId={userGet.data?.id}/>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}
