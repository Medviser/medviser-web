import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

import { db } from "@/lib/drizzle";
import { questions } from "@/db/schema";

import SingleQuestionContent from "./content";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function SingleQuestionPage({ params }: Props) {
  const { id } = await params;

  const [question] = await db
    .select()
    .from(questions)
    .where(eq(questions.id, id))
    .limit(1);

  if (!question) {
    notFound();
  }

  return <SingleQuestionContent data={question} />;
}