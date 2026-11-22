"use client"
import type { ErrorReport } from "@/db/schema"
import ReportCard from "./card"
import { Button } from "@/components/ui/button"
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyContent } from "@/components/ui/empty"
import { Flag, RotateCcw } from "lucide-react"
import { useRouter } from "next/navigation"

interface ErrorReportsListProps{
     reports: ErrorReport[]
}
export default function ErrorReportsList({reports}: ErrorReportsListProps){
     const router = useRouter()
     if(reports.length===0) return (
          <Empty>
               <EmptyHeader>
                    <EmptyMedia variant="icon">
                         <Flag/>
                    </EmptyMedia>
                    <EmptyTitle>Այս պահին զեկույցներ դեռ չկան</EmptyTitle>
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