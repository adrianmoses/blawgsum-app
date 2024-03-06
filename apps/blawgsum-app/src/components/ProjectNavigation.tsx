import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { Separator } from "@/src/components/ui/separator";
import {UserButton} from "@clerk/nextjs";
import {generateSlug} from "random-word-slugs";
import {trpc} from "@/src/app/_trpc/client";
import {redirect} from "next/navigation";

interface ProjectNavigationProps {
  pageName: string | undefined
  userId: string | undefined;
  projectId: string;
}

const ProjectNavigation = ({ pageName, userId, projectId } : ProjectNavigationProps) => {

  return (
    <>
      <div
        className="container flex flex-col items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-16">
        <h2 className="text-lg font-semibold">{pageName}</h2>
        <div className="ml-auto flex space-x-2 sm:justify-end">
            <UserButton afterSignOutUrl={"/"}/>
        </div>
      </div>
      <Separator/>
    </>
  )
}

export default ProjectNavigation
