"use client"
import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import type { Resource } from "@/db/schema";
import { BookOpen, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import useCRUD from "@/hooks/use-crud";
import ResourceCard from "./card";

interface ResourcesListProps{
     data: Resource[]
}
export default function ResourcesList({data}: ResourcesListProps){
     const router = useRouter()
     const {data: list, remove} = useCRUD(data)
     if(list.length===0) return (
          <Empty>
               <EmptyHeader>
                    <EmptyMedia variant="icon">
                         <BookOpen/>
                    </EmptyMedia>
                    <EmptyTitle>Ռեսուրսներ դեռ չկան</EmptyTitle>
                    <EmptyDescription>Ստեղծեք առաջին ռեսուրսը</EmptyDescription>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
               {list.map(val=>(
                    <ResourceCard
                         key={val.id}
                         resource={val}
                         onDelete={remove}
                    />
               ))}
          </div>
     )
}