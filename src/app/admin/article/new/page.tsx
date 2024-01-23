"use client"
import {Separator} from "@/src/components/ui/separator";
import {Button} from "@/src/components/ui/button";
import Tiptap from "@/src/components/Tiptap";
import {useState} from "react";
import {trpc} from "@/src/app/_trpc/client";
import ArticleSidebar from "@/src/components/ArticleSidebar";

export default function NewArticlePage() {
  const content = `
  <h1>Untitled</h1>
  <p></p>
  `
  const [html, setHtml] = useState(content);
  const [title, setTitle] = useState("")
  const mutation = trpc.postCreate.useMutation()
  const saveArticle = () => {
    if (title) {
      mutation.mutate({
        title,
        body: html,
        authorId: "",
        isPublished: false,
        savedAt: new Date()})
    }
  }

  return (
    <>
      <div className="hidden h-full flex-col md:flex">
        <div
          className="container flex flex-col items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-16">
          <h2 className="text-lg font-semibold">New Article</h2>
          <div className="ml-auto flex space-x-2 sm:justify-end">
            <Button>
              Save
            </Button>
          </div>
        </div>
        <Separator/>
        <div className="flex w-4/5 mx-auto min-h-screen px-8">
          <div className="flex grow border border-black py-4 rounded-md">
            <div className="w-full">
              <div className="w-3/4 mx-auto">
                <Tiptap
                  html={html}
                  setHtml={setHtml}
                  title={title}
                  setTitle={setTitle}
                  saveArticle={saveArticle}/>
              </div>
            </div>
          </div>
          <div className="w-1/5 border border-black p-4 ml-8 rounded-md">
            <ArticleSidebar />
          </div>
        </div>
      </div>
    </>
  )
}
