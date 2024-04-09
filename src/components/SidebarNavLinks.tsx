"use client"
import {cn} from "@/src/lib/utils";
import Link from "next/link";
import {Home, Image, MessagesSquare, Settings} from "lucide-react";
import React from "react";
import {useAuth} from "@clerk/nextjs";


const SidebarNavLinks = ({ projectId } : { projectId : string }) => {
    const { userId } = useAuth()
    //TODO only show links based on the data you have
    // if no projectId but user, show dashboard and projects
    // if projectId, show dashboard, projects, media, social

    const navigation = [
        { name: 'Dashboard', href: `/projects/${projectId}`, icon: Home, current: true },
        { name: 'Media', href: `/projects/${projectId}/media`, icon: Image, current: false },
        { name: 'Social', href: `/projects/${projectId}/social`, icon: MessagesSquare, current: false },
    ]
    return (

        <nav className="flex flex-col flex-1">
            <ul role="list" className="flex flex-col flex-1 gap-y-7">
                <li>
                    <ul role="list" className="-mx-2 space-y-1">
                        {navigation.map((item) => (
                            <li key={item.name}>
                                <a href={item.href}
                                   className={cn(
                                       item.current
                                           ? 'bg-zinc-800 text-white'
                                           : 'text-zinc-400 hover:text-white hover:bg-zinc-800',
                                       'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                                   )}
                                >
                                    <item.icon className="h-6 w-6 shrink-0" aria-hidden="true"/>
                                    {item.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                </li>
                <li className="mt-auto ">
                    <Link href={`/projects/${projectId}/settings`} className="flex gap-x-3 p-2 text-zinc-400 hover:text-white" >
                        <Settings className="h-6 w-6 shrink-0" aria-hidden="true"/>
                        Settings
                    </Link>
                </li>
            </ul>
        </nav>
    )
}

export default SidebarNavLinks