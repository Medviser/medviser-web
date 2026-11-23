import HomeContent from "@/app/admin/content";
import { errorReports } from "@/db/schema";
import { db } from "@/lib/drizzle";
import { desc, sql } from "drizzle-orm";

export default async function Home() {
     const [
          recentReports,
          reportStats,
     ] = await Promise.all([
     db
          .select()
          .from(errorReports)
          .orderBy(desc(errorReports.created_at))
          .limit(6),

     db
          .select({
               total: sql<number>`count(*)`,
               new: sql<number>`
                    count(*) filter (
                    where ${errorReports.status} = 'new'
                    )
               `,
               accepted: sql<number>`
                    count(*) filter (
                    where ${errorReports.status} = 'accepted'
                    )
               `,
               fixed: sql<number>`
                    count(*) filter (
                    where ${errorReports.status} = 'fixed'
                    )
               `,
          })
          .from(errorReports),
     ]);

     const stats = reportStats[0];
     return (
          <HomeContent
               stats={stats}
               recentReports={recentReports}
          />
     );
}