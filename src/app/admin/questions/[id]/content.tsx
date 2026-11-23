import Link from "next/link";
import {
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ExternalLink,
  FileText,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Question } from "@/db/schema";

interface SingleQuestionContentProps {
  data: Question;
}

const statusLabels = {
  draft: "Սևագիր",
  in_review: "Վերանայման մեջ",
  needs_check: "Ստուգման կարիք ունի",
  published: "Հրապարակված",
  archived: "Արխիվացված",
} as const;

const statusVariants = {
  draft: "secondary",
  in_review: "default",
  needs_check: "outline",
  published: "default",
  archived: "secondary",
} as const;

const letters = ["Ա", "Բ", "Գ", "Դ"];

export default function SingleQuestionContent({
  data,
}: SingleQuestionContentProps) {
  const options = data.options ?? [];
  const sources = data.sources ?? [];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold md:text-2xl lg:text-3xl">
            Հարց #{data.number}
          </h1>

          <p className="text-sm text-muted-foreground">
            ID՝ <span className="font-mono">{data.id}</span>
          </p>
        </div>

        <Button asChild variant="outline">
          <Link href="/admin/questions">
            <ChevronLeft />
            Վերադառնալ
          </Link>
        </Button>
      </div>

      <article className="space-y-5 rounded-md border bg-card/60 p-4 text-card-foreground shadow-sm backdrop-blur-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Հարցի վիճակ</p>

            <Badge variant={statusVariants[data.status]}>
              {statusLabels[data.status]}
            </Badge>
          </div>

          <Badge variant="outline">Տարբերակ {data.version}</Badge>
        </div>

        <section className="space-y-2">
          <div className="flex items-center gap-2">
            <FileText className="size-4 text-muted-foreground" />

            <h2 className="font-semibold">Հարց</h2>
          </div>

          <p className="whitespace-pre-wrap rounded-md border bg-background/50 p-3 text-sm">
            {data.stem}
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold">Պատասխանների տարբերակներ</h2>

          <div className="space-y-2">
            {options.length > 0 ? (
              options.map((option,i) => {
                const isCorrect = option.id === data.correct_option_id;

                return (
                  <div
                    key={option.id}
                    className="flex items-start gap-3 rounded-md border p-3"
                  >
                    <div className="mt-0.5 flex size-6 shrink-0 items-center justify-center font-semibold">
                      {letters[i]}
                    </div>

                    <p className="flex-1 text-sm">{option.text}</p>

                    {isCorrect && (
                      <Badge variant="outline">
                        <CheckCircle2 className="size-3.5" />
                        Ճիշտ
                      </Badge>
                    )}
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-muted-foreground">
                Պատասխանների տարբերակներ չկան։
              </p>
            )}
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold">Բացատրություն</h2>

          <p className="whitespace-pre-wrap rounded-md border bg-background/50 p-3 text-sm">
            {data.explanation}
          </p>
        </section>

        {data.note && (
          <section className="space-y-2">
            <h2 className="font-semibold">Նշում</h2>

            <p className="whitespace-pre-wrap rounded-md border bg-background/50 p-3 text-sm text-muted-foreground">
              {data.note}
            </p>
          </section>
        )}

        {data.review_comment && (
          <section className="space-y-2">
            <h2 className="font-semibold">Վերանայման մեկնաբանություն</h2>

            <p className="whitespace-pre-wrap rounded-md border bg-background/50 p-3 text-sm">
              {data.review_comment}
            </p>
          </section>
        )}

        <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-1 rounded-md border p-3">
            <dt className="text-xs text-muted-foreground">Մասնագիտության ID</dt>

            <dd className="wrap-break-word font-mono text-sm">
              {data.specialty_id}
            </dd>
          </div>

          <div className="space-y-1 rounded-md border p-3">
            <dt className="text-xs text-muted-foreground">Բաժնի ID</dt>

            <dd className="wrap-break-word font-mono text-sm">
              {data.section_id}
            </dd>
          </div>

          <div className="space-y-1 rounded-md border p-3">
            <dt className="text-xs text-muted-foreground">Shuffle</dt>

            <dd className="text-sm">
              {data.shuffle ? "Միացված է" : "Անջատված է"}
            </dd>
          </div>

          <div className="space-y-1 rounded-md border p-3">
            <dt className="text-xs text-muted-foreground">Թարմացվել է</dt>

            <dd className="text-sm">
              <time dateTime={data.updated_at.toISOString()}>
                {data.updated_at.toLocaleString("hy-AM")}
              </time>
            </dd>
          </div>

          <div className="space-y-1 rounded-md border p-3">
            <dt className="text-xs text-muted-foreground">Վերանայել է</dt>

            <dd className="wrap-break-word font-mono text-sm">
              {data.reviewed_by ?? "Դեռ չի վերանայվել"}
            </dd>
          </div>

          <div className="space-y-1 rounded-md border p-3">
            <dt className="text-xs text-muted-foreground">
              Վերանայման ամսաթիվ
            </dt>

            <dd className="text-sm">
              {data.reviewed_at ? (
                <time dateTime={data.reviewed_at.toISOString()}>
                  {data.reviewed_at.toLocaleString("hy-AM")}
                </time>
              ) : (
                "Չկա"
              )}
            </dd>
          </div>
        </dl>

        {sources.length > 0 && (
          <section className="space-y-2">
            <div className="flex items-center gap-2">
              <BookOpen className="size-4 text-muted-foreground" />

              <h2 className="font-semibold">Աղբյուրներ</h2>
            </div>

            <div className="space-y-2">
              {sources.map((source, index) => (
                <div
                  key={`${source.url}-${index}`}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-md border p-3"
                >
                  <span className="text-sm">{source.title}</span>

                  <Button asChild variant="outline" size="sm">
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Բացել
                      <ExternalLink />
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  );
}