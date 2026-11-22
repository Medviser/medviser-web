import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SectionEditorForm from "./form";
import { listSpecialties } from "@/data/specialties";
import { getSectionById } from "@/data/sections";

export const metadata: Metadata = {
     title: "Բաժնի խմբագրիչ"
}
export default async function SectionsEditor({
     searchParams,
}: {
     searchParams: Promise<{ id?: string | string[] }>;
}) {
     const { id } = await searchParams;
     if (id !== undefined && (typeof id !== "string" || !id.trim())) notFound();

     const [specialties, section] = await Promise.all([
          listSpecialties(),
          id ? getSectionById(id) : Promise.resolve(null),
     ]);

     if (id && !section) notFound();

     return (
          <SectionEditorForm
               specialties={specialties}
               section={section}
          />
     );
}