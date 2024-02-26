"use client"
import {useAuth} from "@clerk/nextjs";
import {trpc} from "@/src/app/_trpc/client";
import AdminNavigation from "@/src/components/AdminNavigation";
import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent
} from "@/src/components/ui/tabs";
import { Button } from "@/src/components/ui/button";
import { Separator } from "@/src/components/ui/separator";
import { ScrollArea, ScrollBar } from "@/src/components/ui/scroll-area";
import {Settings, Twitter} from "lucide-react";
import GeneratedTweet from "@/src/components/GeneratedTweet";
import AddNewSocialPostDialog from "@/src/components/AddNewSocialPostDialog";
import ScheduledPostsTable from "@/src/components/ScheduledPostsTable";
import Link from "next/link";

export default function SocialPage() {

    const { userId } : { userId: string | null | undefined } = useAuth();
    // @ts-ignore
    const userGet = trpc.userGet.useQuery({ clerkUserId: userId }, {enabled: !!userId})
    // @ts-ignore
    const socialContentGet = trpc.socialGenerate.useQuery({ userId: userGet.data?.id }, {enabled: !!userGet.data?.id})
    // add query to fetch generated tweets

    return (
        <div>
            <AdminNavigation
                pageName={"Social"}
                userId={userGet.data?.id} />
            <div className="container h-full px-4 py-6">
                <Tabs defaultValue="content" className="h-full space-y-6">
                    <div className="flex items-center justify-between">
                        <TabsList>
                            <TabsTrigger value="content" className="relative">Content</TabsTrigger>
                            <TabsTrigger value="schedule">Schedule</TabsTrigger>
                        </TabsList>
                        <div>
                            <div className="flex items-center">

                            {userGet.data?.id && (
                                <AddNewSocialPostDialog userId={userGet.data?.id} />
                            )}
                            <Link href={"/admin/social/settings"}>
                                <Settings className="w-6 h-6 ml-4 cursor-pointer" />
                            </Link>
                            </div>
                        </div>
                    </div>
                    <TabsContent value="content">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <h2 className="text-2xl font-semibold tracking-tight">
                                    Social content based on recent posts
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    Generated tweets and social content based on recent posts
                                </p>
                            </div>
                        </div>
                        <Separator/>
                        <div className="relative">
                            <ScrollArea>
                                <div className="flex space-x-4 p-4">
                                    {socialContentGet.data &&
                                        socialContentGet.data.twitter &&
                                        socialContentGet.data.twitter?.tweets.map((tweet: string, index: number) => {
                                        return (
                                            <GeneratedTweet tweet={tweet} key={index}/>
                                        )
                                    })}
                                </div>
                                <ScrollBar orientation="horizontal"/>
                            </ScrollArea>
                        </div>
                        <div className="mt-6 space-y-1">
                            <h2 className="text-2xl font-semibold tracking-tight">
                                Social content based on categories
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Generated tweets and social content based on post categories
                            </p>
                        </div>
                        <Separator />
                    </TabsContent>
                    <TabsContent value={"schedule"}>
                        {userGet.data?.id && (
                            <ScheduledPostsTable userId={userGet.data?.id} />
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}