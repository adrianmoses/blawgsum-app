
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/src/components/ui/form";
import {useForm} from "react-hook-form";
import z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Popover, PopoverContent, PopoverTrigger} from "@/src/components/ui/popover";
import {cn} from "@/src/lib/utils";
import {Check, ChevronsUpDown} from "lucide-react";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem} from "@/src/components/ui/command";
import {trpc} from "@/src/app/_trpc/client";
import ScheduledDateTimePicker from "@/src/components/ScheduledDateTimePicker";
import {Textarea} from "@/src/components/ui/textarea";

const FormSchema = z.object({
    media: z.string().optional(),
    message: z.string(),
    scheduledAt: z.date(),
    channel: z.string(),
})

const NewSocialPostForm = ({ userId, projectId } : { userId : string, projectId: string }) => {
    const mediaItems = trpc.mediaList.useQuery({ projectId }).data || []
    const mutation = trpc.socialContentPost.useMutation()

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            media: "",
            message: "",
            scheduledAt: new Date(),
            channel: "twitter",
        }
    });

    const { errors } = form.formState

    const saveSocialContentPost = (data: z.infer<typeof FormSchema>) => {
        const { message, media, channel, scheduledAt } = data
        console.log('[saveSocialContentPost] user', userId)
        if (userId) {
            mutation.mutate({
                userId,
                message,
                mediaId: media ? media : undefined,
                channel,
                scheduledAt,
                projectId
            })
        } else {
            console.error('No userId')
        }
    }
    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(saveSocialContentPost)} className="w-full">
                    <FormField
                        control={form.control}
                        name="channel"
                        render={({field}) => (
                            <div className="w-3/4 mx-auto mt-4">
                                <FormItem>
                                    <FormLabel>Channel</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Channel"
                                            disabled={true}
                                        />
                                    </FormControl>
                                    <FormMessage>{errors.channel && <span>{errors.channel.message}</span>}</FormMessage>
                                </FormItem>
                            </div>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="message"
                        render={({field}) => (
                            <div className="w-3/4 mx-auto mt-4">
                                <FormItem>
                                    <FormLabel>Message</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            placeholder="Message"
                                        />
                                    </FormControl>
                                    <FormMessage>{errors.message && <span>{errors.message.message}</span>}</FormMessage>
                                </FormItem>
                            </div>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="media"
                        render={({ field }) => (
                            <div className="w-3/4 mx-auto mt-4">
                                <FormItem className="flex flex-col">
                                    <FormLabel>Image</FormLabel>
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
                                                        "Select Image"
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
                                                                form.setValue("media", media.id)
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
                                    <FormMessage>{errors.media && <span>{errors.media.message}</span>}</FormMessage>
                                </FormItem>
                                <div>
                                    <a href={"/projects/media"} className="text-xs float-right underline mt-2">Manage Media</a>
                                </div>
                            </div>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="scheduledAt"
                        render={({ field }) => (
                           <ScheduledDateTimePicker
                                 scheduledDate={field.value}
                                 onChange={(date: Date) => form.setValue("scheduledAt", date)}
                                 errors={errors}
                           />
                        )}
                    />
                    <Button type="submit" className="mt-8 w-full">Schedule To Send</Button>
                </form>
            </Form>
        </div>
    )
}

export default NewSocialPostForm;