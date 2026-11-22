import type { Metadata } from "next";
import ResourcesContent from "./content";
import { listResources } from "@/data/resources";

export const metadata: Metadata = {
     title: "Ռեսուրսներ"
}
export default async function ResourcesPage() {
     const resources = await listResources()
     return (
          <ResourcesContent resources={resources}/>
     )
}