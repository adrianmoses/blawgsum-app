"use client";
import {useAuth} from "@clerk/nextjs";
import {trpc} from "@/src/app/_trpc/client";
import SocialSettings from "@/src/components/SocialSettings";
import AdminNavigation from "@/src/components/AdminNavigation";


export default function SocialSettingsPage() {
    const { userId } : { userId: string | null | undefined } = useAuth();
    // @ts-ignore
    const userGet = trpc.userGet.useQuery({ clerkUserId: userId }, {enabled: !!userId})

    return (
        <div>
            <AdminNavigation
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