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
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/src/components/ui/dialog";
import {Button} from "@/src/components/ui/button";
import {useState} from "react";
import {trpc} from "@/src/app/_trpc/client";
import {Copy, Check} from "lucide-react"
import {useToast} from "@/src/components/ui/use-toast";

const FormSchema = z.object({
  name: z.string(),
})


const ApiKeyNameForm = ({ setApiKey, userId, projectId } : { setApiKey: (apiKey: string) => void, userId: string, projectId: string }) => {
  const mutation = trpc.apiKeyCreate.useMutation()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  const saveNameAndCreateApiKey = async (data: z.infer<typeof FormSchema>) => {
    console.log('data', data)
    const { name} = data
    if (name && userId) {
      await mutation.mutateAsync({ name, userId, scopes: [], projectId  })
    }
  }

  if (mutation.isSuccess) {
    const { apiKey } = mutation.data
    setApiKey(apiKey)
  }

  return (
    <div className="w-3/4 mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(saveNameAndCreateApiKey)}>
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
                      placeholder="name"
                    />
                  </FormControl>
                </FormItem>
              </div>
            )}
          />
          <div className="w-3/4 mx-auto mt-4">
              <span className="text-xs">
                {"Scopes aren't offered just yet in Blawgsum. All keys have full access"}
              </span>
          </div>
          <div className="w-3/4 mx-auto mt-4">
            <Button className="w-full">Generate Key</Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

const ApiKeyDisplay = ({ apiKey }: {apiKey: string}) => {
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const saveToClipboard = () => {
    navigator.clipboard
      .writeText(apiKey)
      .then(() => {
        setCopied(true)
        toast({
          title: "API Key Copied",
          description: "Saved!",
        })
        setTimeout(() => {
          setCopied(false)
        }, 3000);
      })
  }

  return (
    <div className="flex">
        <input value={apiKey} className="w-full" disabled={true}  />
        <div onClick={saveToClipboard} className="cursor-pointer">
          {copied ? (
            <span className="w-24 h-24">
              <Check color="green" size={36}/>
            </span>
          ) : (
            <Copy />
          )}
        </div>
    </div>
  )
}

const ApiKeyDialog = ({userId, projectId }: { userId: string, projectId: string }) => {

  const [apiKey, setApiKey] = useState<string | null>(null)

  return (
    <Dialog>
      <DialogTrigger className="w-full mt-8">
        <Button>Create New API Key</Button>
      </DialogTrigger>
      <DialogContent className="w-full">
        <DialogHeader>
          <DialogTitle>{apiKey ? "New API Key Created!" : "Create New API Key" }</DialogTitle>
          <DialogDescription>
            {apiKey ? "Your new API key has been created! Copy it and store it securely. You won't be able to see it again."
              : "Set a name, choose scopes, and generate a new API key"}
          </DialogDescription>
        </DialogHeader>
        {apiKey ? (
          <ApiKeyDisplay apiKey={apiKey} />
          ) : (
          <ApiKeyNameForm setApiKey={setApiKey}
                          userId={userId}
                          projectId={projectId} />
        )}
    </DialogContent>
  </Dialog>
  )
}

export default ApiKeyDialog
