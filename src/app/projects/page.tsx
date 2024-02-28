"use client";
import {useAuth} from "@clerk/nextjs";
import {trpc} from "@/src/app/_trpc/client";
import ProjectNavigation from "@/src/components/ProjectNavigation";
import {Button} from "@/src/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/src/components/ui/dialog";
import CreateProjectForm from "@/src/components/CreateProjectForm";
import Link from "next/link";


const CreateProjectDialog = ({ userId } : { userId: string }) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="secondary">Create Project</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Project</DialogTitle>
                    <DialogDescription>
                        Create a new project
                    </DialogDescription>
                    <CreateProjectForm userId={userId} />
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}
export default function AdminPage() {
  const { userId } : { userId: string | null | undefined } = useAuth();
  // @ts-ignore
  const userGet = trpc.userGet.useQuery({ clerkUserId: userId }, {enabled: !!userId});
  // @ts-ignore
  const projectList = trpc.projectList.useQuery({ userId: userGet.data?.id }, {enabled: !!userGet.data?.id});

  //TODO: list projects for the user

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
          <span>
              Welcome to Blawgsum! Projects Go Here.
          </span>
          <div className="flex flex-col rounded-md bg-gray-400 p-8">
              {projectList.data?.map((project) => (
                  <Link href={`/projects/${project.id}`} >
                      <div key={project.id} className="flex flex-col cursor-pointer underline">
                          <span className="text-2xl font-bold">{project.name}</span>
                          <span className="text-sm">{project.description}</span>
                      </div>
                  </Link>
              ))}
          </div>
          {userGet.data?.id && (
              <CreateProjectDialog userId={userGet.data?.id} />
          )}
      </main>
    </>
  )
}
