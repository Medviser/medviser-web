import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

import { db } from "@/lib/drizzle";
import { errorReports } from "@/db/schema";

import SingleReportContent from "./content";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function SingleReportPage({ params }: Props) {
  const { id } = await params;

  const [report] = await db
    .select()
    .from(errorReports)
    .where(eq(errorReports.id, id))
    .limit(1);

  if (!report) {
    notFound();
  }

  return <SingleReportContent data={report} />;
}
