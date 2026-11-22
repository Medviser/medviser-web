import { removeQuestion } from "@/actions/questions";
import EditorCard from "@/components/admin/editor-card";
import { Button } from "@/components/ui/button";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent } from "@/components/ui/empty";
import type { getQuestions } from "@/data/question";
import useCRUD from "@/hooks/use-crud";
import { BookOpen, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";

interface QuestionsListProps{
     questions: Awaited<ReturnType<typeof getQuestions>>
}
export default function QuestionsList({questions}: QuestionsListProps){
     const router = useRouter()
     const {data, remove} = useCRUD(questions)
     if(data.length===0) return (
          <Empty>
               <EmptyHeader>
                    <EmptyMedia variant="icon">
                         <BookOpen/>
                    </EmptyMedia>
                    <EmptyTitle>Հարցեր դեռ չկան</EmptyTitle>
                    <EmptyDescription>Ստեղծեք առաջին հարցը կամ ներմուծել բոլոր հարցերը</EmptyDescription>
               </EmptyHeader>
               <EmptyContent>
                    <Button variant="outline" onClick={()=>router.refresh()}>
                         <RotateCcw/>
                         Թարմացնել էջը
                    </Button>
               </EmptyContent>
          </Empty>
     )
     return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
               {data.map((question) => (
                    <EditorCard
                         id={question.id}
                         key={question.id}
                         title={`${question.number}. ${question.stem}`}
                         detail={question.section}
                         editHref={`/admin/questions/editor?id=${encodeURIComponent(question.id)}`}
                         removeAction={removeQuestion.bind(null, question.id)}
                         postDelete={remove}
                    />
               ))}
          </div>
     )
}