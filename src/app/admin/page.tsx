import { Separator } from "@/src/components/ui/separator";
import {ArticlesTable} from "@/src/components/ArticlesTable";
import {Button} from "@/src/components/ui/button";
import Link from "next/link";


export default function AdminPage() {
  return (
    <>
      <div className="hidden h-full flex-col md:flex">
        <div
          className="container flex flex-col items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-16">
          <h2 className="text-lg font-semibold">Dashboard</h2>
          <div className="ml-auto flex w-full space-x-2 sm:justify-end">
            <Link href={"/admin/article/new"}>
              <Button>
                New Article
              </Button>
            </Link>
          </div>
        </div>
        <Separator />
        <div className="w-full flex py-4">
          <div className="sidebar py-4 px-8 w-2/12">
            <div className="side-nav flex flex-col justify-around">
              {/*<span>Dashboard</span>*/}
              {/*<span>Articles</span>*/}
            </div>
          </div>
          <div className="section w-10/12 px-8 py-4">
            <ArticlesTable />
          </div>
        </div>
      </div>
    </>
  )
}
