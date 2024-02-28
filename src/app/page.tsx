"use client"

import Navigation from "@/src/components/Navigation";

export default function Home() {
  return (
    <>
      <Navigation/>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
          <span>
              Welcome to Blawgsum! Stats and stuff will go here.
          </span>
      </main>
    </>
  )
}
