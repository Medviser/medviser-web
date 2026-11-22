import { notFound } from "next/navigation";
import { getTopicById, getTopicSpecialtyOptions } from "@/data/topics";
import TopicEditorForm from "./form";

type Props = {
     searchParams: Promise<{ id?: string | string[] }>;
};
export default async function TopicEditorPage({ searchParams }: Props) {
     const { id } = await searchParams;
     if (id !== undefined && (typeof id !== "string" || !id.trim())) notFound();
     const [topic, specialties] = await Promise.all([
          id ? getTopicById(id) : Promise.resolve(null),
          getTopicSpecialtyOptions(),
     ]);
     if (id && !topic) notFound();
     return (
          <TopicEditorForm
               key={topic?.id ?? "new"}
               topic={topic}
               specialties={specialties}
          />
     );
}