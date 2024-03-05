import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/src/components/ui/form";
import {Textarea} from "@/src/components/ui/textarea";
import {Input} from "@/src/components/ui/input";
import {Button} from "@/src/components/ui/button";
import {trpc} from "@/src/app/_trpc/client";
import {toast} from "@/src/components/ui/use-toast";


const FormSchema = z.object({
    name: z.string(),
    description: z.string().optional(),
})
const CreateProjectForm = ({ userId } : { userId: string }) => {
    const mutation = trpc.projectCreate.useMutation()

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: "Untitled",
        }
    })

    const { errors } = form.formState

    const createProject = (data: z.infer<typeof FormSchema>) => {
        console.log("called createProject")
        const { name, description } = data
        if (name && userId) {
            mutation.mutate({
                name,
                description,
                userId
            })
        }
    }

    if (mutation.isSuccess) {
        toast({
            title: "Project Created",
            description: `Your new project has been created`,
        })
    }

    return (
        <div>
           <Form {...form}>
               <form onSubmit={form.handleSubmit(createProject)} className="w-full">
                   <FormField
                       control={form.control}
                       name="name"
                       render={({field}) => (
                           <div className="w-3/4 mx-auto mt-4">
                               <FormItem>
                                   <FormLabel>Name</FormLabel>
                                   <FormControl>
                                       <Input
                                           {...field}
                                           placeholder="Untitled Project"
                                       />
                                   </FormControl>
                                   <FormMessage>{errors.name && <span>{errors.name.message}</span>}</FormMessage>
                               </FormItem>
                           </div>
                       )}
                   />
                   <FormField
                       control={form.control}
                       name="description"
                       render={({field}) => (
                           <div className="w-3/4 mx-auto mt-4">
                               <FormItem>
                                   <FormLabel>Description</FormLabel>
                                   <FormControl>
                                       <Textarea
                                           {...field}
                                           placeholder="Description"
                                       />
                                   </FormControl>
                                   <FormMessage>{errors.description && <span>{errors.description.message}</span>}</FormMessage>
                               </FormItem>
                           </div>
                       )}
                   />
                   <div className="mt-8 w-3/4 mx-auto">
                       <Button type="submit" className="w-full">Create Project</Button>
                   </div>
               </form>
           </Form>
        </div>
    )
}

export default CreateProjectForm