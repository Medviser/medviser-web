import type { ErrorReport } from "@/db/schema"

interface ReportCardProps{
     data: ErrorReport
}
export default function ReportCard({data}: ReportCardProps){
     return (
          <article className="space-y-3 rounded-md border bg-card/60 p-4 shadow-sm backdrop-blur-sm">
               
          </article>
     )
}