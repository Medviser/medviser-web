import type { Metadata } from "next";
import ReportsContent from "./content";
import { db } from "@/lib/drizzle";
import { errorReports } from "@/db/schema";
import { desc } from "drizzle-orm";

export const metadata: Metadata = {
     title: "Սխալների զեկույցներ"
}
export default async function ReportsPage() {
     const reports = await db.select().from(errorReports).orderBy(desc(errorReports.created_at)).limit(20);
     return (
          <ReportsContent reports={reports}/>
     )
}