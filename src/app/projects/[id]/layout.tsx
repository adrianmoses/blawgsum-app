import SidebarNavLinks from "@/src/components/SidebarNavLinks";
import React from "react";
import {Oswald} from "next/font/google";


const oswald = Oswald({subsets: ['latin']})
export default function SidebarLayout({
                                          children,
                                          params
} : {
    children: React.ReactNode,
    params: {
        id: string
    }
}) {
    return (
        <>
            <div>
                <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
                    {/* actual start to sidebar */}
                    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-zinc-950 px-6 pb-4">
                        <div className="flex h-16 shrink-0 items-center text-white">
                            <span className={oswald.className}>Blawgsum</span>
                        </div>
                        <SidebarNavLinks projectId={params.id} />
                    </div>
                </div>
                <div className="lg:pl-72">
                    <main className="py-10">
                        <div className="px-4 sm:px-6 lg:px-8">{children}</div>
                    </main>
                </div>
            </div>
        </>
    )
}