"use client";
import ImageUploader from "@/src/components/ImageUploader";
import {useAuth} from "@clerk/nextjs";
import {trpc} from "@/src/app/_trpc/client";
import ProjectNavigation from "@/src/components/ProjectNavigation";
import MediaItem from "@/src/components/MediaItem";
import {useState} from "react";
import GenerateImage from "@/src/components/GenerateImage";
import PreviewMediaDialog from "@/src/components/PreviewMediaDialog";


export default function MediaPage({ params } : { params: { id: string }})  {
  const [ generatedImageBase64, setGeneratedImageBase64 ] = useState<string | null>(null)

  const { id: projectId } = params;
  const { userId } : { userId: string | null | undefined } = useAuth();

  // @ts-ignore
  const userGet = trpc.userGet.useQuery({ clerkUserId: userId }, {enabled: !!userId})

  // @ts-ignore
  const mediaList = trpc.mediaList.useQuery({userId: userGet.data?.id, projectId }, {enabled: !!userGet.data?.id})

  return (
    <>
      <div className="hidden h-screen flex-col md:flex">
        <ProjectNavigation
            projectId={projectId}
            pageName="Media"
            userId={userGet.data?.id}/>
        <div className="flex h-full">
          <div className="upload-section h-full w-1/2 flex flex-col items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="mb-8">Upload cover images</div>
              {userGet.data && (
                <ImageUploader
                    projectId={projectId}
                    userId={userGet.data.id}
                    refetchImage={mediaList.refetch}/>
              )}
              <div className="my-8">Or</div>
              <div className="mb-8">Generate Image From Prompt</div>
              {userGet.data && (
                <GenerateImage
                    projectId={projectId}
                    userId={userGet.data.id}
                    setGeneratedImageBase64={setGeneratedImageBase64}/>
              )}
              <div className="mt-2">
                {userGet.data && generatedImageBase64 && (
                    <PreviewMediaDialog
                        userId={userGet.data.id}
                        projectId={projectId}
                        generatedImageBase64={generatedImageBase64} />
                )}
              </div>
            </div>
          </div>
          <div className="media-list-section min-w-1/2 border-l-2">
            <div className="w-full flex flex-col mx-12 py-8">
              {mediaList.isSuccess && mediaList.data && mediaList.data.map((media) => (
                <MediaItem media={media} key={media.id} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
