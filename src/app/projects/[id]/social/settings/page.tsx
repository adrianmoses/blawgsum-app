"use client";
import {useAuth} from "@clerk/nextjs";
import {trpc} from "@/src/app/_trpc/client";
import SocialSettings from "@/src/components/SocialSettings";
import ProjectNavigation from "@/src/components/ProjectNavigation";


export default function SocialSettingsPage({ params }: { params: { id: string }}) {
    const { id: projectId } = params;
    const { userId } : { userId: string | null | undefined } = useAuth();
    // @ts-ignore
    const userGet = trpc.userGet.useQuery({ clerkUserId: userId }, {enabled: !!userId})

    return (
        <div>
            <ProjectNavigation
                projectId={projectId}
                pageName={"Social"}
                userId={userGet.data?.id} />
            <div className="container h-full px-4 py-6">
            {userGet.data?.id && (
                <SocialSettings userId={userGet.data?.id} />
            )}
            </div>
        </div>
    )
}