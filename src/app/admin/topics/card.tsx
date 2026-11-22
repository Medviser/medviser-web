"use client";

import Link from "next/link";
import { useTransition } from "react";
import { toast } from "sonner";
import { removeTopic } from "@/actions/topics";
import { Button } from "@/components/ui/button";
import type { getTopics } from "@/data/topics";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogMedia, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Spinner } from "@/components/ui/spinner";
import { Pencil, Trash2, X } from "lucide-react";

type TopicCardProps = {
     postRemove: (id: string) => void
     topic: Awaited<ReturnType<typeof getTopics>>[number];
};

export default function TopicCard({ topic, postRemove }: TopicCardProps) {
     const [isPending, startTransition] = useTransition();
     function onDelete() {
          startTransition(async () => {
               try {
                    const result = await removeTopic(topic.id);
                    if (result.error) {
                         toast.error(result.error);
                         return;
                    }
                    postRemove(topic.id)
                    toast.success("Թեման ջնջվեց։");
               } catch {
                    toast.error("Չհաջողվեց ջնջել թեման։");
               }
          });
     }
     return (
          <AlertDialog>
               <article className="space-y-4 rounded-md border bg-card/80 p-4 shadow-sm">
                    <div>
                         <h2 className="font-semibold">{topic.name_hy}</h2>
                         <p className="text-sm text-muted-foreground">{topic.specialty_name}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                         <Button asChild variant="outline">
                              <Link href={`/admin/topics/editor?id=${topic.id}`}>
                                   <Pencil aria-hidden="true" />
                                   Խմբագրել
                              </Link>
                         </Button>
                         <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="icon" title="Ջնջել մասնագիտությունը">
                                   <Trash2/>
                              </Button>
                         </AlertDialogTrigger>
                    </div>
               </article>
               <AlertDialogContent>
                    <AlertDialogHeader>
                         <AlertDialogMedia>
                              <Trash2/>
                         </AlertDialogMedia>
                         <AlertDialogTitle>Ջնջե՞լ «{topic.name_hy}» թեման։</AlertDialogTitle>
                         <AlertDialogDescription>Գործողությունը հնարավոր չէ չեղարկել</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                         <AlertDialogCancel>
                              <X/>
                              Չեղարկել
                         </AlertDialogCancel>
                         <AlertDialogAction variant="destructive" onClick={onDelete}>
                              {isPending ? <Spinner/> : <Trash2/>}
                              {isPending ? "Խնդրում ենք սպասել..." : "Ջնջել"}
                         </AlertDialogAction>
                    </AlertDialogFooter>
               </AlertDialogContent>
          </AlertDialog>
     );
}