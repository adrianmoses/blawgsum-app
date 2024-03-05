import {Input} from "@/src/components/ui/input"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/src/components/ui/form"
import {z} from "zod"
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {trpc} from "@/src/app/_trpc/client";
import {Button} from "@/src/components/ui/button";
import PreviewAvatarDialog from "@/src/components/PreviewAvatarDialog";
import {toast} from "@/src/components/ui/use-toast";



interface UserProps {
    id: string
    name: string | null
    email: string

}
interface UserProfileProps {
    user: UserProps
}

const FormSchema = z.object({
    name: z.string(),
})
const UserProfileForm = ({ user } : UserProfileProps) => {
    const mutation = trpc.userUpdate.useMutation()
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: user.name || "",
        }
    })


    const updateUser = (data: z.infer<typeof FormSchema>) => {
        // check if the user uploaded an image
        if (user.id) {
            mutation.mutate({
                userId: user.id,
                name: data.name
            })
        }

    }

    if (mutation.isSuccess) {
        toast({
            title: "User Updated",
            description: `Your profile has been successfully updated`,
        })
    }


    const { errors } = form.formState
    return (
        <div className="w-full">
            <PreviewAvatarDialog user={user} />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(updateUser)}>
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
                                            placeholder="No Name"
                                        />
                                    </FormControl>
                                    <FormMessage>{errors.name && <span>{errors.name.message}</span>}</FormMessage>
                                </FormItem>
                            </div>
                        )}
                    />
                    <div className="w-3/4 mx-auto mt-4">
                        <Button type="submit" className="w-full">Update Profile</Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default UserProfileForm