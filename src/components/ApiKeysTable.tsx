
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table"

import { Button } from "@/src/components/ui/button"
import {timeAgo} from "@/src/app/utils/time-ago";
import {trpc} from "@/src/app/_trpc/client";

interface ApiKeyRowProps {
  name: string
  prefix: string
  scopes: string[]
  createdAt: Date
}
const ApiKeyRow = ({ name, prefix, scopes, createdAt }: ApiKeyRowProps) => {
  return (
    <TableRow>
      <TableCell className="font-medium">{name.trim()}</TableCell>
      <TableCell>{prefix}</TableCell>
      <TableCell>{scopes.join(", ")}</TableCell>
      <TableCell>{timeAgo(createdAt)}</TableCell>
      <TableCell>
        <Button variant={"destructive"}>Delete</Button>
      </TableCell>
    </TableRow>
  )
}

const ApiKeysTable = ({userId}: {userId: string}) => {
  const apiKeys = trpc.apiKeyList.useQuery({userId},  {enabled: !!userId})
  return (
    <Table>
      <TableCaption>List of Generated API Keys</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Key Prefix</TableHead>
          <TableHead>Scopes</TableHead>
          <TableHead>Created</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {apiKeys.data?.map((apiKey) => (
          <ApiKeyRow
            key={apiKey.id}
            name={apiKey.name}
            prefix={apiKey.keyPrefix}
            scopes={apiKey.scopes}
            createdAt={apiKey.createdAt}
          />
        ))}
      </TableBody>
    </Table>
  )
}

export default ApiKeysTable
