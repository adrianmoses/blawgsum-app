"use client"
import {Button} from "@/src/components/ui/button";
import {Separator} from "@/src/components/ui/separator";
import Tiptap from "@/src/components/Tiptap";
import ArticleSidebar from "@/src/components/ArticleSidebar";
import {trpc} from "@/src/app/_trpc/client";
import {useAuth} from "@clerk/nextjs";
import { Input } from "@/src/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel, FormMessage
} from "@/src/components/ui/form"
import { z } from "zod"
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import { Calendar } from "@/src/components/ui/calendar"
import {CalendarIcon, Check, ChevronsUpDown} from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover"
import {format} from "date-fns";
import {cn} from "@/src/lib/utils";
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem
} from "@/src/components/ui/command";
import Link from "next/link";

const FormSchema = z.object({
  title: z.string(),
  slug: z.string(),
  body: z.string(),
  coverImage: z.string().nullable().optional(),
  publishedAt: z.date().nullable().optional(),
})


export default function ArticlePage({ params }: { params: { postId: string } }) {
  const { userId } : { userId: string | null | undefined } = useAuth();
  const { postId }  = params;
  // @ts-ignore
  const post = trpc.postGet.useQuery({ postId }, {enabled: !!postId})
  // @ts-ignore
  const user = trpc.userGet.useQuery({ clerkUserId: userId }, {enabled: !!userId})
  // @ts-ignore
  const mediaItems = trpc.mediaList.useQuery({ userId: user.data?.id }, {enabled: !!user.data?.id}).data || []

  const mutation = trpc.postUpdate.useMutation()
  const publishPostMutation = trpc.postPublish.useMutation()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "Untitled",
      publishedAt: new Date(),
    },
    values: {
      title: post.data?.title as string,
      slug: post.data?.slug as string,
      body: post.data?.body as string,
      coverImage: post.data?.coverImage as string,
      publishedAt: post.data?.publishedAt as Date,
    }
  })

  const publishPost = async () => {
    console.log('[publishPost] clicked')
    publishPostMutation.mutate({
      postId,
    })
  }

  const savePost = async (data: z.infer<typeof FormSchema>) => {
    console.log('[savePost] data', data)
    const { title, slug, body } = data
    if (title && body && postId && user && user.data) {
      mutation.mutate({
        postId,
        title,
        slug,
        body,
        authorId: user.data.id,
        savedAt: new Date(),
        coverImage: data.coverImage ? data.coverImage : undefined,
        publishedAt: data.publishedAt ? data.publishedAt : undefined
      })
    }
  }

  const { errors } = form.formState

  return (
    <>
      <div className="hidden h-full flex-col md:flex">
        <div
          className="container w-full flex justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-16">
          <h2 className="text-lg font-semibold">{post.data?.title || ""}</h2>
          <div className="ml-auto flex space-x-2 sm:justify-end">
            <div className="flex items-center">
              <div className="mr-4">
                <Link href={"/admin/"}>
                  Articles
                </Link>
              </div>
              <div className="mr-4">
                <Link href={"/admin/social"}>
                  Social
                </Link>
              </div>
              <div className="mr-4">
                <Link href={"/admin/media"}>
                  Media
                </Link>
              </div>
              <div className="mr-4">
                <Link href={"/admin/settings/api-keys"}>
                  API Keys
                </Link>
              </div>
              <Button onClick={form.handleSubmit(savePost)}>
                Save
              </Button>
              <Button variant="secondary" onClick={publishPost}>
                Publish
              </Button>
            </div>
          </div>
        </div>
        <Separator/>
        <div className="flex w-4/5 mx-auto min-h-screen px-8 mt-8">
          <div className="flex grow border border-black py-4 rounded-md">
            <div className="w-full">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(savePost)} className="w-full">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({field}) => (
                      <div className="w-3/4 mx-auto mt-4">
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Title"
                            />
                          </FormControl>
                          <FormMessage>{errors.title && <span>{errors.title.message}</span>}</FormMessage>
                        </FormItem>
                      </div>
                    )}
                    />
                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <div className="w-3/4 mx-auto mt-4">
                        <FormItem>
                          <FormLabel>Slug</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="slug"
                            />
                          </FormControl>
                          <FormMessage>{errors.slug && <span>{errors.slug.message}</span>}</FormMessage>
                        </FormItem>
                      </div>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="publishedAt"
                    render={({ field }) => (
                      <div className="w-3/4 mx-auto mt-4">
                        <FormItem className="flex flex-col">
                          <FormLabel>Published Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn("w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground")}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a Date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="p-0" align="start">
                              <Calendar
                                mode="single"
                                // @ts-ignore
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date > new Date() || date < new Date("1900-01-01")
                                }
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage>{errors.publishedAt && <span>{errors.publishedAt.message}</span>}</FormMessage>
                        </FormItem>
                      </div>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="coverImage"
                    render={({ field }) => (
                      <div className="w-3/4 mx-auto mt-4">
                        <FormItem className="flex flex-col">
                          <FormLabel>Cover Image</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  role={"combobox"}
                                  className={cn("w-full justify-between",
                                    !field.value && "text-muted-foreground")}
                                >
                                  {field.value ? (
                                    mediaItems.find((m) => m.id === field.value)?.filename
                                  ) : (
                                    "Select Cover Image"
                                  )}
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-[750px] p-0">
                              <Command>
                                <CommandInput placeholder="Search for media" />
                                <CommandEmpty>No Media Found</CommandEmpty>
                                <CommandGroup>
                                  {mediaItems.map((media) => (
                                    <CommandItem
                                      key={media.id}
                                      value={media.id}
                                      onSelect={() => {
                                        form.setValue("coverImage", media.id)
                                      }} >
                                      <Check className={cn("mr-2 h-4 w-4", media.id === field.value)} />
                                      <div className="flex">
                                        <img src={media.url} alt={media.filename} className="h-8 w-8" />
                                        <span className="ml-4">{media.filename}</span>
                                      </div>
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </Command>
                            </PopoverContent>
                          </Popover>
                          <FormMessage>{errors.coverImage && <span>{errors.coverImage.message}</span>}</FormMessage>
                        </FormItem>
                        <div>
                          <a href={"/admin/media"} className="text-xs float-right underline mt-2">Manage Media</a>
                        </div>
                      </div>
                    )}
                 />
                  <Controller
                    control={form.control}
                    name={"body"}
                    render={({ field }) => (
                      <div className="w-3/4 mx-auto mt-4">
                        <FormItem>
                          <FormLabel>Content</FormLabel>
                          <Tiptap
                            html={field.value}
                            onChange={field.onChange}
                          />
                          <FormMessage>{errors.body && <span>{errors.body.message}</span>}</FormMessage>
                        </FormItem>
                      </div>
                    )}
                  />
                </form>
              </Form>
            </div>
          </div>
          <div className="w-1/5 border border-black p-4 ml-8 rounded-md">
            {post.isSuccess && (
              <ArticleSidebar
                postId={postId}
                isPublished={post.data.isPublished}
                publishedAt={post.data.publishedAt}
                savedAt={post.data.savedAt}
              />
            )}
          </div>
        </div>
      </div>
    </>
  )
}
