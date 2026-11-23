"use client";
import type { ErrorReport } from "@/db/schema";
import useCurrentUser from "@/hooks/use-current-user";
import ReportCard from "./reports/card";

interface HomeContentProps {
  stats: {
    total: number;
    new: number;
    accepted: number;
    fixed: number;
  };
  recentReports: ErrorReport[];
}
export default function HomeContent({
  stats,
  recentReports,
}: HomeContentProps) {
  const user = useCurrentUser();
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="font-semibold text-xl md:text-2xl lg:text-3xl">
          {!user ? "Բարև Ձեզ": `Բարև, ${user?.name.split(" ")[0]}`}
        </h1>

        <p className="text-sm text-muted-foreground">
          Բարի գալուստ մեր ադմինիստրատորի վահանակ։
        </p>
      </div>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Բոլոր զեկույցները" value={stats?.total ?? 0} />

        <StatCard label="Նոր" value={stats?.new ?? 0} />

        <StatCard label="Ընդունված" value={stats?.accepted ?? 0} />

        <StatCard label="Ուղղված" value={stats?.fixed ?? 0} />
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-semibold text-lg">Վերջին զեկույցները</h2>
        </div>

        {recentReports.length > 0 ? (
          <div className="grid gap-3 lg:grid-cols-2">
            {recentReports.map((report) => (
              <ReportCard key={report.id} data={report} />
            ))}
          </div>
        ) : (
          <div className="rounded-md border bg-card/60 p-6 text-center text-sm text-muted-foreground">
            Զեկույցներ դեռ չկան։
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <article className="space-y-1 rounded-md border bg-card/60 p-4 shadow-sm">
      <p className="text-sm text-muted-foreground">{label}</p>

      <p className="text-2xl font-semibold">{value}</p>
    </article>
  );
}
