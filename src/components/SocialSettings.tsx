"use client"
import {Separator} from "@/src/components/ui/separator";
import {Button} from "@/src/components/ui/button";
import {Twitter} from "lucide-react";
import {trpc} from "@/src/app/_trpc/client";
import {useState} from "react";
import useStorage from "@/src/app/utils/useStorage";


const SocialSettings = ({ userId } : { userId: string }) => {
    const [authLinkOpened, setAuthLinkOpened] = useState(false)
    const { data, refetch, isSuccess } = trpc.twitterAuthLink
        .useQuery({ userId }, { enabled: false })
    const twitterAuth = trpc.twitterAuthGet.useQuery({ userId }, { enabled: !!userId })

    const { setItem } = useStorage()

    const getAuthLink = async () => {
        refetch()
    }

    if (isSuccess && data && !authLinkOpened) {
        const {  url, codeVerifier, state } = data
        // use the data to go to the auth endpoint
        setItem("state", state)
        setItem("codeVerifier", codeVerifier)
        console.log(url)
        window.location.href = url
    }

    return (
        <>
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h2 className="text-2xl font-semibold tracking-tight">
                        Social settings
                    </h2>
                </div>
            </div>
            <Separator/>
            <div className="mt-8 flex flex-col items-center justify-center">
                <div className="space-y-2 flex flex-col items-center mt-8">
                    <h3 className="text-lg font-semibold tracking-tight mt-4">
                        Twitter
                    </h3>
                    {twitterAuth.data?.id ? "Already Connected!" : (
                        <Button onClick={() => getAuthLink()}>
                            <Twitter className="w-6 h-6 mr-2"/>
                            Connect Twitter
                        </Button>
                    )}
                </div>
                <div className="space-y-2 flex flex-col items-center mt-8">
                    <h3 className="text-lg font-semibold tracking-tight mt-4">
                        LinkedIn
                    </h3>
                    <span>Not Yet Supported</span>
                </div>
            </div>
        </>
    )
}

export default SocialSettings