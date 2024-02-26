"use client"
import useStorage from "@/src/app/utils/useStorage";
import {useRouter, useSearchParams} from "next/navigation";
import {trpc} from "@/src/app/_trpc/client";
import {useAuth} from "@clerk/nextjs";

export default function TwitterPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { userId } : { userId: string | null | undefined } = useAuth();
    // @ts-ignore
    const userGet = trpc.userGet.useQuery({ clerkUserId: userId }, {enabled: !!userId})

    const code = searchParams.get("code") as string
    const state = searchParams.get("state") as string

    const { getItem } = useStorage()
    // read url params to get code and state
    // if they exist, generate session and use toast to show the user that the auth was successful
    const sessionState = getItem("state")
    const codeVerifier = getItem("codeVerifier")

    if (!code || code === "null" || !state || state === "null") {
        console.log("redirecting to /admin/social/settings")
        router.push("/admin/social/settings")
    }

    const mutation = trpc.twitterAuthLogin.useMutation()

    if (code && state && sessionState && codeVerifier && userGet.data?.id && mutation.status === "idle") {
        console.log(`called ${mutation.status}`)
        mutation.mutate({
            userId: userGet.data.id,
            code,
            state,
            sessionState,
            codeVerifier
        })
    }

    if (mutation.isSuccess) {
        router.push("/admin/social/settings")
    }

    if (mutation.isError) {
        console.error(mutation.error)
        router.push("/admin/social/settings")
    }


    return (
        <div>
            <div className="container h-screen flex justify-center items-center">
                Authenticating Twitter Credentials...
            </div>
        </div>
  )
}

