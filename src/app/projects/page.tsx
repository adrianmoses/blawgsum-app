"use client";
import {useAuth} from "@clerk/nextjs";
import {trpc} from "@/src/app/_trpc/client";
import {Button} from "@/src/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/src/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/src/components/ui/card";
import CreateProjectForm from "@/src/components/CreateProjectForm";
import Link from "next/link";
import Navigation from "@/src/components/Navigation";
import {Plus} from "lucide-react";


const ProjectCard = ({ project } : { project: { id: string, name: string, description: string | null } }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{project.name}</CardTitle>
                <CardDescription>{project.description || "No description"}</CardDescription>
            </CardHeader>
            {/*<CardContent>*/}
            {/*    <p>Some Stats About The Project</p>*/}
            {/*</CardContent>*/}
        </Card>
    )
}

const CreateProjectDialog = ({ userId } : { userId: string }) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="secondary"><Plus className="h-4 w-4 mr-2"/> Create Project</Button>
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
      <Navigation />
      <main className="flex flex-col min-h-screen">
          <div className="w-3/4 mx-auto flex justify-between mt-8">
                <h1 className="text-4xl font-bold">Projects</h1>
                {userGet.data?.id && (
                    <CreateProjectDialog userId={userGet.data?.id} />
                )}
          </div>
          <div className="w-3/4 mx-auto grid grid-cols-3 gap-4 mt-16">
              {projectList.data?.map((project) => (
                  <div key={project.id}>
                      <Link  href={`/projects/${project.id}`} >
                          <ProjectCard project={project} />
                      </Link>
                  </div>
              ))}
          </div>
      </main>
    </>
  )
}
