import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs"

export default function ArticleSidebar() {
 return (
   <>
     <Tabs defaultValue="tools">
       <div>
         <TabsList>
           <TabsTrigger value="stats">Stats</TabsTrigger>
           <TabsTrigger value="tools">Tools</TabsTrigger>
           <TabsTrigger value="publish">Publish</TabsTrigger>
         </TabsList>
       </div>
       <TabsContent value="stats">
         <div className="flex flex-col space-y-2">
           <span>Stats</span>
           <span>Stats</span>
         </div>
       </TabsContent>
       <TabsContent value="tools">
          <div className="flex flex-col space-y-2">
            <span>Tools</span>
            <span>Tools</span>
          </div>
       </TabsContent>
       <TabsContent value="publish">
          <div className="flex flex-col space-y-2">
            <span>Publish</span>
            <span>Publish</span>
          </div>
       </TabsContent>
     </Tabs>
   </>
 )
}
