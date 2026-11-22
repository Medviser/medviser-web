import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getQuestionEditorOptions, getQuestionForEdit } from "@/data/question";
import QuestionsEditorForm from "./form";

export const metadata: Metadata = {
     title: "Հարցի խմբագրիչ"
}
export default async function QuestionsEditor({searchParams}: {
     searchParams: Promise<{ id?: string | string[] }>;
}) {
     const { id } = await searchParams;
     if (id !== undefined && (typeof id !== "string" || !id.trim())) notFound();

     const [options, question] = await Promise.all([
          getQuestionEditorOptions(),
          id ? getQuestionForEdit(id) : Promise.resolve(null),
     ]);

     if (id && !question) notFound();

     return (
          <QuestionsEditorForm
               key={id ?? "new"}
               {...options}
               questionId={id}
               initialValues={question ?? undefined}
          />
     );
}