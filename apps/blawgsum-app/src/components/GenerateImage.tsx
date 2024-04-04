import React, {useEffect, useRef} from 'react';
import { Input } from '@/src/components/ui/input';
import { Button } from '@/src/components/ui/button';
import { RotateCw } from 'lucide-react';
import {trpc} from "@/src/app/_trpc/client";

interface GenerateImageProps {
    projectId: string;
    userId: string;
    setGeneratedImageBase64: (b64: string) => void;

}

const GenerateImage = ({ projectId, userId, setGeneratedImageBase64 } : GenerateImageProps) => {
    const [isLoading, setIsLoading] = React.useState(false)

    const imageGenerate = trpc.imageGenerate.useMutation({
        onSuccess: (data) => {
            console.log(data)
            setIsLoading(false)
        }
    })
    const imagePromptRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (imageGenerate.isSuccess && imageGenerate.data?.dataURL) {
            setGeneratedImageBase64(imageGenerate.data.dataURL)
        }
    }, [imageGenerate.isSuccess])

    const createImage = async () => {
        setIsLoading(true)
        const prompt = imagePromptRef.current?.value

        if (!prompt) {
            return
        }

        await imageGenerate.mutateAsync({ prompt, userId, projectId })
    }

    return (
        <div className="flex flex-col w-full">
            <Input type="text" placeholder="Enter a prompt for image" className="w-full" ref={imagePromptRef} />
            <Button className="w-full mt-4" onClick={() => createImage()} disabled={isLoading}>
                {isLoading && (
                    <RotateCw className="mr-2 h-4 w-4 animate-spin"/>
                )}{" "}Generate
            </Button>
        </div>
    )
}

export default GenerateImage;