"use client"
import HeadingActions from "@/components/admin/header-actions";
import QuestionsList from "./list";
import { useMemo, useState } from "react";
import type { getQuestions } from "@/data/question";

interface QuestionsContentProps{
     questions: Awaited<ReturnType<typeof getQuestions>>
}
export default function QuestionsContent({questions}: QuestionsContentProps){
     const [search, setSearch] = useState("")
     const filteredQuestions = useMemo(()=>questions.filter(val=>val.stem.toLowerCase().includes(search.toLowerCase())),[questions, search.toLowerCase])
     return (
          <div className="space-y-3">
               <h1 className="font-semibold text-xl md:text-2xl lg:text-3xl">Հարցեր</h1>
               <HeadingActions
                    href="/admin/questions/editor"
                    search={search}
                    onSearchChange={setSearch}
                    resultCount={filteredQuestions.length}
               />
               <QuestionsList questions={filteredQuestions}/>
          </div>
     );
}