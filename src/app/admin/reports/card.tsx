import type { ErrorReport } from "@/db/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CalendarDays, CircleAlert, ExternalLink } from "lucide-react";

interface ReportCardProps {
  data: ErrorReport;
}

const statusLabels = {
  new: "Նոր",
  accepted: "Ընդունված",
  rejected: "Մերժված",
  fixed: "Ուղղված",
} as const;

const statusVariants = {
  new: "default",
  accepted: "secondary",
  rejected: "destructive",
  fixed: "outline",
} as const;

export default function ReportCard({ data }: ReportCardProps) {
  return (
    <article className="space-y-3 rounded-md border bg-card/60 p-4 shadow-sm backdrop-blur-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <CircleAlert className="size-4 text-muted-foreground" />
          <h2 className="font-medium">{data.type}</h2>
        </div>
        <Badge variant={statusVariants[data.status]}>
          {statusLabels[data.status]}
        </Badge>
      </div>
      <p className="line-clamp-3 text-sm text-muted-foreground">{data.text}</p>
      <div className="space-y-1 text-xs text-muted-foreground">
        <p>
          Հարցի ID՝ <span className="font-mono">{data.question_id}</span>
        </p>
        {data.user_id && (
          <p>
            Օգտատիրոջ ID՝ <span className="font-mono">{data.user_id}</span>
          </p>
        )}
        <div className="flex items-center gap-1">
          <CalendarDays className="size-3.5" />
          <time dateTime={data.created_at.toISOString()}>
            {data.created_at.toLocaleString("hy-AM")}
          </time>
        </div>
      </div>
      <div className="flex justify-end">
        <Button asChild size="sm" variant="outline">
          <Link href={`/admin/reports/${data.id}`}>
            Բացել
            <ExternalLink />
          </Link>
        </Button>
      </div>
    </article>
  );
}