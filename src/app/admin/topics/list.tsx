import useCRUD from "@/hooks/use-crud"
import TopicCard from "./card"
import type { getTopics } from "@/data/topics"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent } from "@/components/ui/empty"
import { FolderTree, RotateCcw } from "lucide-react"

interface TopicListProps{
     topics: Awaited<ReturnType<typeof getTopics>>
}
export default function TopicList({topics}: TopicListProps){
     const router = useRouter()
     const {data, remove} = useCRUD(topics)
     if(data.length===0) return (
          <Empty>
               <EmptyHeader>
                    <EmptyMedia variant="icon">
                         <FolderTree/>
                    </EmptyMedia>
                    <EmptyTitle>Թեմաներ չկան</EmptyTitle>
                    <EmptyDescription>Ստեղծեք առաջին թեման</EmptyDescription>
               </EmptyHeader>
               <EmptyContent>
                    <Button variant="outline" onClick={()=>router.refresh()}>
                         <RotateCcw/>
                         Թարմացնել էջը
                    </Button>
               </EmptyContent>
          </Empty>
     )
     return (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
               {data.map((topic) => (
                    <TopicCard key={topic.id} topic={topic} postRemove={remove} />
               ))}
          </div>
     )
}