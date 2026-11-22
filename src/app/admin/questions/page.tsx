import type { Metadata } from "next";
import QuestionsContent from "./content";
import { getQuestions } from "@/data/question";

export const metadata: Metadata = {
     title: "Հարցեր"
}
export default async function QuestionsPage() {
     const questions = await getQuestions()
     return (
          <QuestionsContent questions={questions}/>
     )
}