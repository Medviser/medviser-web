import type { ErrorReport } from "@/db/schema"
import ReportCard from "./card"
import { Button } from "@/components/ui/button"
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent } from "@/components/ui/empty"
import { BookOpen, RotateCcw } from "lucide-react"
import router from "next/router"

interface ErrorReportsListProps{
     reports: ErrorReport[]
}
export default function ErrorReportsList({reports}: ErrorReportsListProps){
     if(reports.length===0) return (
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
               {reports.map(report=>(
                    <ReportCard
                         key={report.id}
                         data={report}
                    />
               ))}
          </div>
     )
}