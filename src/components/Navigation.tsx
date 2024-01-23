import {Button} from "@/src/components/ui/button";
import Link from "next/link";
import {UserButton} from "@clerk/nextjs";


const Navigation = () => {
  return (
    <nav className="w-full p-8">
      <div className="flex flex-col justify-between items-center">
        <div className="self-end mr-12 flex items-center">
          <Link href={"/admin"}>
            <Button className="mr-4">
              Admin Dashboard
            </Button>
          </Link>
          <UserButton afterSignOutUrl={"/"} />
        </div>
      </div>
    </nav>
  )
}

export default Navigation
