"use client";

import Link from "next/link";
import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogMedia, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { Edit, ExternalLink, Trash2, X } from "lucide-react";
import { Spinner } from "../ui/spinner";

type Props = {
     title: string;
     detail: string;
     editHref: string;
     removeAction: () => Promise<{ success?: boolean, error?: string }>;
     postDelete: (id: string) => void
     id: string,
     openLink?: string
};

export default function EditorCard({ title, detail, editHref, removeAction, postDelete, id, openLink }: Props) {
     const [isPending, startTransition] = useTransition();
     function onRemove() {
          startTransition(async () => {
               try {
                    const result = await removeAction();
                    if ("error" in result) {
                         toast.error(result.error);
                         return
                    }
                    postDelete(id)
                    toast.success("Գրառումը ջնջվեց։");
               } catch {
                    toast.error("Չհաջողվեց ջնջել գրառումը։");
               }
          });
     }
     return (
          <AlertDialog>
               <article className="space-y-3 rounded-md border bg-card/60 p-4 shadow-sm">
                    <h2 className="wrap-break-word font-semibold">{title}</h2>
                    <p className="text-sm text-muted-foreground">{detail}</p>
                    <div className="flex flex-wrap gap-2">
                         <Button variant="outline" asChild>
                              <Link href={editHref}>
                                   <Edit/>
                                   Խմբագրել
                              </Link>
                         </Button>
                         {openLink && (
                              <Button variant="outline" asChild>
                                   <Link href={openLink}>
                                        <ExternalLink/>
                                        Բացել
                                   </Link>
                              </Button>
                         )}
                         <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="icon" title="Ջնջել ռեսուրսը">
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
                         <AlertDialogTitle>Ջնջե՞լ «{title}» գրառումը։</AlertDialogTitle>
                         <AlertDialogDescription>Գործողությունը հնարավոր չէ չեղարկել</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                         <AlertDialogCancel>
                              <X/>
                              Չեղարկել
                         </AlertDialogCancel>
                         <AlertDialogAction variant="destructive" onClick={onRemove}>
                              {isPending ? <Spinner/> : <Trash2/>}
                              {isPending ? "Խնդրում ենք սպասել..." : "Ջնջել"}
                         </AlertDialogAction>
                    </AlertDialogFooter>
               </AlertDialogContent>
          </AlertDialog>
     );
}