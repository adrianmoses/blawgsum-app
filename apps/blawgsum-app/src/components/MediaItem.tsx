import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogFooter,
} from "@/src/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/src/components/ui/form";
import z from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Textarea} from "@/src/components/ui/textarea";
import {trpc} from "@/src/app/_trpc/client";
import {DialogClose} from "@radix-ui/react-dialog";
import {Button} from "@/src/components/ui/button";

interface MediaProps {
  id: string
  url: string
  filename: string
  name: string | null
}

interface MediaItemProps {
  media: MediaProps
}


const MediaUpdateFormSchema = z.object({
    name: z.string(),
})


const EditMediaForm = ({ media }: MediaItemProps) => {

    const mutation = trpc.mediaUpdate.useMutation()

    const form = useForm<z.infer<typeof MediaUpdateFormSchema>>({
        resolver: zodResolver(MediaUpdateFormSchema),
        defaultValues: {
            name: media.name || "Unnamed Cover Image"
        }
    });

    const saveMedia = (data: z.infer<typeof MediaUpdateFormSchema>) => {
       const { name } = data;
       if (media.id && name) {
          mutation.mutate({
                mediaId: media.id,
                name
          })
       }
    }

    const { errors } = form.formState

    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(saveMedia)} className="w-full">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({field}) => (
                            <div className="w-3/4 mx-auto mt-4">
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            placeholder="Name"
                                        />
                                    </FormControl>
                                    <FormMessage>{errors.name && <span>{errors.name.message}</span>}</FormMessage>
                                </FormItem>
                            </div>
                        )}
                    />
                    <img src={media.url} alt={"no image"} width={300}
                         height={300}/>
                    <Button type="submit" className="mt-8 w-full">Save Name</Button>
                </form>
            </Form>
        </div>
    )
}

const MediaItem = ({media}: MediaItemProps) => {
    return (
        <Dialog>
        <DialogTrigger>
              <div className="flex mb-8 cursor-pointer">
                  <div className="mr-4 flex-shrink-0">
                      <img
                          alt={media.name || "Unnamed Cover Image"}
                          className="h-16 w-16"
                          src={media.url}
                      />
                  </div>
                  <div>
                      <h4 className="text-lg font-bold hover:underline">{media.name || "Unnamed Cover Image"}</h4>
                  </div>
              </div>
          </DialogTrigger>
          <DialogContent>
              <DialogHeader>
                    <h2 className="text-lg font-bold">Edit Media</h2>
              </DialogHeader>
              <EditMediaForm media={media} />
              <DialogFooter>
                  <DialogFooter className="w-full flex justify-between">
                      <DialogClose asChild>
                          <Button variant={"secondary"}>Cancel</Button>
                      </DialogClose>
                      <Button variant={"destructive"}>Delete Image</Button>
                  </DialogFooter>
              </DialogFooter>
          </DialogContent>
      </Dialog>
  )
}

export default MediaItem
