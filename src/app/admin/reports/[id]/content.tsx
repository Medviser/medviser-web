import Link from "next/link";
import {
  CalendarDays,
  ChevronLeft,
  CircleAlert,
  UserRound,
} from "lucide-react";

import type { ErrorReport } from "@/db/schema";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface SingleReportContentProps {
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

export default function SingleReportContent({
  data,
}: SingleReportContentProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold md:text-2xl lg:text-3xl">
            Սխալի զեկույց
          </h1>

          <p className="text-sm text-muted-foreground">
            Զեկույցի ID՝ <span className="font-mono">{data.id}</span>
          </p>
        </div>

        <Button asChild variant="outline">
          <Link href="/admin/reports">
            <ChevronLeft />
            Վերադառնալ
          </Link>
        </Button>
      </div>

      <article className="space-y-5 rounded-md border bg-card/60 p-4 text-card-foreground shadow-sm backdrop-blur-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <CircleAlert className="size-5 text-muted-foreground" />

            <div>
              <p className="text-sm text-muted-foreground">Զեկույցի տեսակ</p>

              <h2 className="font-semibold">{data.type}</h2>
            </div>
          </div>

          <Badge variant={statusVariants[data.status]}>
            {statusLabels[data.status]}
          </Badge>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Նկարագրություն</h3>

          <p className="whitespace-pre-wrap wrap-break-word rounded-md border bg-background/50 p-3 text-sm">
            {data.text}
          </p>
        </div>

        <dl className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1 rounded-md border p-3">
            <dt className="text-xs text-muted-foreground">Հարցի ID</dt>

            <dd className="wrap-break-word font-mono text-sm">
              {data.question_id}
            </dd>
          </div>

          <div className="space-y-1 rounded-md border p-3">
            <dt className="flex items-center gap-1 text-xs text-muted-foreground">
              <UserRound className="size-3.5" />
              Օգտատեր
            </dt>

            <dd className="wrap-break-word font-mono text-sm">
              {data.user_id ?? "Անանուն"}
            </dd>
          </div>

          <div className="space-y-1 rounded-md border p-3">
            <dt className="flex items-center gap-1 text-xs text-muted-foreground">
              <CalendarDays className="size-3.5" />
              Ստեղծվել է
            </dt>

            <dd className="text-sm">
              <time dateTime={data.created_at.toISOString()}>
                {data.created_at.toLocaleString("hy-AM")}
              </time>
            </dd>
          </div>

          <div className="space-y-1 rounded-md border p-3">
            <dt className="text-xs text-muted-foreground">Լուծվել է</dt>

            <dd className="text-sm">
              {data.resolved_at ? (
                <time dateTime={data.resolved_at.toISOString()}>
                  {data.resolved_at.toLocaleString("hy-AM")}
                </time>
              ) : (
                "Դեռ լուծված չէ"
              )}
            </dd>
          </div>
        </dl>

        <div className="flex flex-wrap gap-2 border-t pt-4">
          <Button asChild variant="outline">
            <Link href={`/admin/questions/${data.question_id}`}>
              Բացել հարցը
            </Link>
          </Button>
        </div>
      </article>
    </div>
  );
}
