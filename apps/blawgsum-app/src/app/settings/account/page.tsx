"use client"
import Navigation from "@/src/components/Navigation";
import {Separator} from "@/src/components/ui/separator";
import UserProfileForm from "@/src/components/UserProfileForm";
import {useAuth} from "@clerk/nextjs";
import {trpc} from "@/src/app/_trpc/client";

export default function AccountPage() {
    const { userId } = useAuth()
    //@ts-ignore
    const userGet = trpc.userGet.useQuery({ clerkUserId: userId }, { enabled: !!userId })
    return (
        <div>
            <Navigation />
            <div className="hidden space-y-6 p-10 pb-16 md:block">
                <div className="space-y-0.5">
                    <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
                    <p className="text-muted-foreground">
                        Manage your account settings and set e-mail preferences.
                    </p>
                </div>
                <Separator className="my-6" />
                <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                    <aside className="-mx-4 lg:w-1/5">
                        {/*<SidebarNav items={sidebarNavItems} />*/}
                    </aside>
                    <div className="flex-1 lg:max-w-2xl">
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-medium">Profile</h3>
                                <p className="text-sm text-muted-foreground">
                                    Edit your profile information.
                                </p>
                            </div>
                            <Separator/>
                            {userGet.data && (
                                <UserProfileForm user={userGet.data}/>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}