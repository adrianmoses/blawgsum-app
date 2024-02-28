import {Button} from "@/src/components/ui/button";
import Link from "next/link";
import {useAuth, UserButton} from "@clerk/nextjs";


const Navigation = () => {
  const { userId } = useAuth()
  return (
    <nav className="w-full p-8">
      <div className="flex flex-col justify-between items-center">
        <div className="self-end mr-12 flex items-center">
          <Link href={"/projects"}>
            <Button className="mr-4">
              Projects Dashboard
            </Button>
          </Link>
          {userId ? (
            <UserButton afterSignOutUrl={"/"} />
          ) : (
            <Link href={"/sign-in"}>
              <Button className="mr-4" variant={"secondary"}>
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navigation
