import type { Metadata } from "next";
import SpecialtyEditorForm from "./form";
import { getSpecialtyById } from "@/data/specialties";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
     title: "Մասնագիտության խմբագրիչ"
}
export default async function SpecialtyEditor({searchParams}: {
     searchParams: Promise<{ id?: string }>
}){
     const { id } = await searchParams;
     
     if (id === undefined) return <SpecialtyEditorForm sponsorOptions={[]}/>;
     if (typeof id !== "string" || !id) notFound();

     const specialty = await getSpecialtyById(id);
     if (!specialty) notFound();

     return <SpecialtyEditorForm specialty={specialty} sponsorOptions={[]}/>
}