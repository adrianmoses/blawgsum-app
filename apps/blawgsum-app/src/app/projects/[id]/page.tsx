"use client"
import {useAuth} from "@clerk/nextjs";
import {trpc} from "@/src/app/_trpc/client";
import {ArticlesTable} from "@/src/components/ArticlesTable";
import {Button} from "@/src/components/ui/button";
import Navigation from "@/src/components/Navigation";
import {generateSlug} from "random-word-slugs";
import {redirect} from "next/navigation";


export default function ProjectPage({ params } : { params:  { id : string } }) {
    const { id: projectId } = params;
    const { userId } : { userId: string | null | undefined } = useAuth();
    // @ts-ignore
    const userGet = trpc.userGet.useQuery({ clerkUserId: userId }, {enabled: !!userId})
    const projectGet = trpc.projectGet.useQuery({ projectId: params.id }, {enabled: !!params.id})

    const mutation = trpc.postCreate.useMutation()

    const createEmptyArticle = () => {
        console.log('[createEmptyArticle] user', userId)
        if (userId) {
            mutation.mutate({
                projectId,
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
        redirect(`/projects/${projectId}/article/${postId}`)
    }

    return (
        <>
            <div className="hidden h-full flex-col md:flex">
                <Navigation />
                <div className="flex w-full mt-4 justify-end">
                    <Button className="mr-4" onClick={() => {
                        createEmptyArticle()
                    }}>
                        New Article
                    </Button>
                </div>
                <div className="w-full flex py-4">
                    <div className="section w-full px-8 py-4">
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