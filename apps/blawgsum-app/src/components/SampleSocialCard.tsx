
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter
} from "@/src/components/ui/card";
import { Bookmark } from "lucide-react";
import {Button} from "@/src/components/ui/button";

interface SampleSocialCardProps {
    channel: string;
    content: string;
}
const SampleSocialCard = ({ channel, content }: SampleSocialCardProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{channel} sample post</CardTitle>
                <CardDescription>AI generated post for inspiration purposes</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm">{content}</p>
            </CardContent>
            <CardFooter>
                <div className="px-2 flex justify-between items-center">
                   <Bookmark className="h-6 w-6" />
                   <Button className="ml-6">
                        Edit and Send Button
                   </Button>
                </div>
            </CardFooter>
        </Card>
    )
}

export default SampleSocialCard;