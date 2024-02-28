"use client"
import {useAuth} from "@clerk/nextjs";
import {trpc} from "@/src/app/_trpc/client";
import ProjectNavigation from "@/src/components/ProjectNavigation";
import {ArticlesTable} from "@/src/components/ArticlesTable";


export default function ProjectPage({ params } : { params:  { id : string } }) {
    const { id: projectId } = params;
    const { userId } : { userId: string | null | undefined } = useAuth();
    // @ts-ignore
    const userGet = trpc.userGet.useQuery({ clerkUserId: userId }, {enabled: !!userId})
    const projectGet = trpc.projectGet.useQuery({ projectId: params.id }, {enabled: !!params.id})

    return (
        <>
            <div className="hidden h-full flex-col md:flex">
                <ProjectNavigation
                    projectId={projectId}
                    pageName={"Articles"}
                    userId={userGet.data?.id}/>
                <div className="w-full flex py-4">
                    <div className="sidebar py-4 px-8 w-2/12">
                        <div className="side-nav flex flex-col justify-around">
                        </div>
                    </div>
                    <div className="section w-10/12 px-8 py-4">
                        {projectGet.data && (
                            <ArticlesTable
                                projectId={projectGet.data.id}/>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}