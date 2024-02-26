"use client";
import ImageUploader from "@/src/components/ImageUploader";
import {useAuth} from "@clerk/nextjs";
import {trpc} from "@/src/app/_trpc/client";
import AdminNavigation from "@/src/components/AdminNavigation";
import MediaItem from "@/src/components/MediaItem";


export default function MediaPage()  {
  const { userId } : { userId: string | null | undefined } = useAuth();

  // @ts-ignore
  const userGet = trpc.userGet.useQuery({ clerkUserId: userId }, {enabled: !!userId})

  // @ts-ignore
  const mediaList = trpc.mediaList.useQuery({ userId: userGet.data?.id }, {enabled: !!userGet.data?.id})

  return (
    <>
      <div className="hidden h-screen flex-col md:flex">
        <AdminNavigation
            pageName="Media"
            userId={userGet.data?.id}/>
        <div className="flex h-full">
          <div className="upload-section h-full w-1/2 flex flex-col items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="mb-8">Upload cover images</div>
              {userGet.data && (
                <ImageUploader userId={userGet.data.id} refetchImage={mediaList.refetch}/>
              )}
            </div>
          </div>
          <div className="media-list-section min-w-1/2 border-l-2">
            <div className="w-full flex mx-12 py-8">
              {mediaList.isSuccess && mediaList.data && mediaList.data.map((media) => (
                <MediaItem media={media} key={media.id}/>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
