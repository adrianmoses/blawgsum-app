import React from "react";
import {
   Home,
   Users,
   Folder,
   Calendar,
   File,
    PieChart,
} from "lucide-react"
import {cn} from "@/src/lib/utils";
const navigation = [
    { name: 'Dashboard', href: '#', icon: Home, current: true },
    { name: 'Team', href: '#', icon: Users, current: false },
    { name: 'Projects', href: '#', icon: Folder, current: false },
    { name: 'Calendar', href: '#', icon: Calendar, current: false },
    { name: 'Documents', href: '#', icon: File, current: false },
    { name: 'Reports', href: '#', icon: PieChart, current: false },
]
const SidebarNavigation = ({ children } : { children: React.ReactNode }) => {
   return (
       <>
           <div>
               <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
                   {/* actual start to sidebar */}
                   <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-4">
                       <div className="flex h-16 shrink-0 items-center">
                           <span>Logo img tag here</span>
                       </div>
                       <nav className="flex flex-col flex-1">
                           <ul role="list" className="flex flex-col flex-1 gap-y-7">
                               <li>
                                   <ul role="list" className="-mx-2 space-y-1">
                                       {navigation.map((item) => (
                                           <li key={item.name}>
                                               <a href={item.href}
                                               className={cn(
                                                   item.current
                                                   ? 'bg-gray-800 text-white'
                                                   : 'text-gray-400 hover:text-white hover:bg-gray-800',
                                                   'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                                                   )}
                                               >
                                               <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                                               {item.name}
                                               </a>
                                           </li>
                                       ))}
                                   </ul>
                               </li>
                           </ul>
                       </nav>
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

export default SidebarNavigation