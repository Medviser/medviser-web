import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getResourceById } from "@/data/resources";
import ResourceEditorForm from "./form";

export const metadata: Metadata = {
     title: "Ռեսուրսների խմբագրիչ"
}
export default async function ResourceEditorPage({searchParams}: {
     searchParams: Promise<{ id?: string | string[] }>;
}) {
     const { id } = await searchParams;

     if (id === undefined) return <ResourceEditorForm />;
     if (typeof id !== "string" || !id) notFound();

     const resource = await getResourceById(id);
     if (!resource) notFound();

     return <ResourceEditorForm key={resource.id} resource={resource} />;
}