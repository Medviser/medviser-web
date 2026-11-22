import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import type { Specialty } from "@/db/schema";
import { FolderTree, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import SpecialtyCard from "./card";
import useCRUD from "@/hooks/use-crud";

interface SpecialtiesListProps{
     data: Specialty[]
}
export default function SpecialtiesList({data}: SpecialtiesListProps){
     const router = useRouter()
     const {data: list, remove} = useCRUD(data)
     if(list.length===0) return (
          <Empty>
               <EmptyHeader>
                    <EmptyMedia variant="icon">
                         <FolderTree/>
                    </EmptyMedia>
                    <EmptyTitle>Մասնագիտություններ չկան</EmptyTitle>
                    <EmptyDescription>Ստեղծեք առաջին մասնագիտությունը</EmptyDescription>
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
                    <SpecialtyCard
                         key={val.id}
                         specialty={val}
                         onDelete={remove}
                    />
               ))}
          </div>
     )
}