"use client";
import ProjectNavigation from "@/src/components/ProjectNavigation";
import ApiKeysTable from "@/src/components/ApiKeysTable";
import {useAuth} from "@clerk/nextjs";
import {trpc} from "@/src/app/_trpc/client";
import ApiKeyDialog from "@/src/components/ApiKeyDialog";
import {Input} from "@/src/components/ui/input";
import {Label} from "@/src/components/ui/label";
import {Button} from "@/src/components/ui/button";
import {Copy} from "lucide-react";


export default function ApiKeysPage({ params }: { params: { id: string }}) {
  const { id: projectId } = params;

  const { userId } : { userId: string | null | undefined } = useAuth();
  // @ts-ignore
  const userGet = trpc.userGet.useQuery({ clerkUserId: userId }, {enabled: !!userId})
  //add query to get api key and generate if not exists
  return (
    <div>
      <ProjectNavigation
        projectId={projectId}
        pageName="API Keys"
        userId={userGet.data?.id} />
      <div className="flex flex-col w-full h-screen justify-start items-center mt-8">
        <h1 className="text-xl">Manage API Keys</h1>
        <p className="mt-4">API Keys are used to authenticate with the Blawgsum API</p>
        <div className="flex flex-col mt-16">
          <div className="mb-8">
            <Label>Project Id</Label>
            <div className="flex items-center">
              <Input className="w-full" disabled={true} value={projectId} />
              <Button>
                <Copy className="mr-2 h-4 w-4"/> Copy
              </Button>
            </div>
          </div>
          <div>
            {userGet.data?.id && (
              <ApiKeysTable
                  projectId={projectId}
                  userId={userGet.data?.id}/>
            )}
          </div>
          <div>
            {userGet.data?.id && (
              <ApiKeyDialog
                  projectId={projectId}
                  userId={userGet.data?.id}/>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}
