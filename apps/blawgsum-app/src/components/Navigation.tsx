import {Button} from "@/src/components/ui/button";
import {Separator} from "@/src/components/ui/separator";
import Link from "next/link";
import {useUser} from "@clerk/nextjs";
import {UserResource} from "@clerk/types";
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/src/components/ui/avatar";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu"
import {ArrowRightFromLine, Settings} from "lucide-react";

const UserAvatar = ({ user } : { user: UserResource }) => {
  return (
      <Avatar className="cursor-pointer">
        <AvatarImage src={user.imageUrl} alt="user image from clerk"/>
        <AvatarFallback>CI</AvatarFallback>
      </Avatar>
  )
}

const UserAvatarDropdown = ({ user } : { user: UserResource }) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none">
               <UserAvatar user={user}  />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>
                    <Link href={"/settings/account"}>
                        <div className="flex items-center">
                            <Settings className="h-4 w-4 mr-2" />
                            Account Settings
                        </div>
                    </Link>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-center">
                    <ArrowRightFromLine className={"h-4 w-4 mr-2"} />
                    Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

const Navigation = () => {
  const { user } = useUser()
  console.log(user)
  return (
      <>
          <nav className="w-full pb-8">
              <div className="flex flex-col justify-between items-center">
                  <div className="self-end mr-12 flex items-center">
                      {user ? (
                          <UserAvatarDropdown user={user}/>
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
          <Separator />
      </>
  )
}

export default Navigation
