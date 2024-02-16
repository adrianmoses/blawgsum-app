import { useForm } from 'react-hook-form'
import { Input } from "@/src/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel, FormMessage
} from "@/src/components/ui/form"
import { z } from "zod"
import {zodResolver} from "@hookform/resolvers/zod";

const FormSchema = z.object({
  apiKey: z.string(),
  jwtToken: z.string(),
})

const AuthKeysForm = () => {

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  return (
    <div className="w-full">
      <div className="w-3/4 mx-auto">
        <Form {...form}>
          <form>
            <FormField
              control={form.control}
              name="apiKey"
              render={({field}) => (
                <div className="w-3/4 mx-auto mt-4">
                  <FormItem>
                    <FormLabel>API Key</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="apiKey"
                      />
                    </FormControl>
                  </FormItem>
                </div>
              )}
            />
            <FormField
              control={form.control}
              name="jwtToken"
              render={({ field }) => (
                <div className="w-3/4 mx-auto mt-4">
                  <FormItem>
                    <FormLabel>JWT Token</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="jwtToken"
                      />
                    </FormControl>
                  </FormItem>
                </div>
              )}
            />
          </form>
        </Form>
      </div>
    </div>
  )
}

export default AuthKeysForm
