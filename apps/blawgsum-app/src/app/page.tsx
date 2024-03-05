"use client"
import {RotateCw} from "lucide-react";
import {useAuth} from "@clerk/nextjs";
import {redirect} from "next/navigation";

export default function Home() {
    const { userId } = useAuth();
    if (!userId) {
       redirect("/sign-in")
    } else {
        redirect("/projects")
    }
    return (
        <>
            <main className="flex min-h-screen flex-col items-center justify-center">
                <RotateCw className="animate-spin w-48 h-48"/>
            </main>
        </>
    )
}
