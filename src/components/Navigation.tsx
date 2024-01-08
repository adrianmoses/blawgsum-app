import {Button} from "@/src/components/ui/button";
import Link from "next/link";


const Navigation = () => {
  return (
    <nav className="w-full p-8">
      <div className="flex flex-col justify-between items-center">
        <div className="self-end mr-12">
          <Link href={"/admin"}>
            <Button>
              Admin Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
