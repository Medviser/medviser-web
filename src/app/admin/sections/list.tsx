import { removeSection } from "@/actions/sections";
import EditorCard from "@/components/admin/editor-card";
import { Button } from "@/components/ui/button";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent } from "@/components/ui/empty";
import type { getSections } from "@/data/sections";
import useCRUD from "@/hooks/use-crud";
import { RotateCcw, TableOfContents } from "lucide-react";
import { useRouter } from "next/navigation";

interface SectionsListProps{
     sections: Awaited<ReturnType<typeof getSections>>
}
export default function SectionsList({sections}: SectionsListProps){
     const router = useRouter()
     const {data, remove} = useCRUD(sections)
     if(data.length===0) return (
          <Empty>
               <EmptyHeader>
                    <EmptyMedia variant="icon">
                         <TableOfContents/>
                    </EmptyMedia>
                    <EmptyTitle>Բաժիններ դեռ չկան</EmptyTitle>
                    <EmptyDescription>Ստեղծեք առաջին բաժինը</EmptyDescription>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
               {sections.map((section) => (
                    <EditorCard
                         id={section.id}
                         key={section.id}
                         title={section.name_hy}
                         detail={`${section.specialty} · Հերթականություն՝ ${section.sort_order}`}
                         editHref={`/admin/sections/editor?id=${encodeURIComponent(section.id)}`}
                         removeAction={removeSection.bind(null, section.id)}
                         postDelete={remove}
                    />
               ))}
          </div>
     )
}