import {Table, TableBody, TableCaption, TableHead, TableHeader, TableRow} from "@/src/components/ui/table";


export function ArticlesTable() {
  return (
    <Table>
      <TableCaption>A list of articles</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Status</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Published At</TableHead>
          <TableHead>Tags</TableHead>
          <TableHead>Modified At</TableHead>
          <TableHead>Created At</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
      </TableBody>
    </Table>
  )
}
