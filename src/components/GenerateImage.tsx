import React, {useEffect, useRef} from 'react';
import { Input } from '@/src/components/ui/input';
import { Button } from '@/src/components/ui/button';
import {generateImage} from "@/src/app/content-generation/image-gen";
import {trpc} from "@/src/app/_trpc/client";

interface GenerateImageProps {
    projectId: string;
    userId: string;
    setPreviewImageUrl: (url: string) => void;

}
const GenerateImage = ({ projectId, userId, setPreviewImageUrl } : GenerateImageProps) => {

    const imageGenerate = trpc.imageGenerate.useMutation()

    const imagePromptRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (imageGenerate.isSuccess && imageGenerate.data?.imageUrl) {
            setPreviewImageUrl(imageGenerate.data.imageUrl)
        }

    }, [imageGenerate.isSuccess])

    const createImage = async () => {
        const prompt = imagePromptRef.current?.value

        if (!prompt) {
            return
        }

        imageGenerate.mutate({ prompt, userId, projectId })
    }

    return (
        <div className="flex flex-col w-full">
            <Input type="text" placeholder="Enter a prompt for image" className="w-full" ref={imagePromptRef} />
            <Button className="w-full mt-4" onClick={() => createImage()}>Generate</Button>
        </div>
    )
}

export default GenerateImage;