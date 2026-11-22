"use client";

import Link from "next/link";
import { useTransition } from "react";
import { toast } from "sonner";
import { removeResource } from "@/actions/resource";
import { Button } from "@/components/ui/button";
import type { Resource } from "@/db/schema";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogMedia, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Edit, ExternalLink, Trash2, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";

interface ResourceCardProps{
     resource: Resource,
     onDelete: (id: string) => void
}
export default function ResourceCard({ resource, onDelete }: ResourceCardProps) {
     const [isPending, startTransition] = useTransition();

     function onRemove() {
          startTransition(async () => {
               try {
                    const result = await removeResource(resource.id);
                    if ("error" in result) {
                         toast.error(result.error);
                         return;
                    }
                    toast.success("Ռեսուրսը ջնջվեց։");
                    onDelete(resource.id)
               } catch {
                    toast.error("Չհաջողվեց ջնջել ռեսուրսը։");
               }
          });
     }

     return (
          <AlertDialog>
               <article className="space-y-3 rounded-md border bg-card/60 p-4 shadow-sm backdrop-blur-sm">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                         <h2 className="min-w-0 wrap-break-word font-semibold">{resource.title}</h2>
                         <Badge variant={resource.is_published ? "default" : "secondary"}>
                              {resource.is_published ? "Հրապարակված է" : "Չհրապարակված"}
                         </Badge>
                    </div>
                    {resource.description && (
                         <p className="wrap-break-word text-sm text-muted-foreground">
                              {resource.description}
                         </p>
                    )}
                    <div className="flex flex-wrap gap-2">
                         <Button asChild size="sm" variant="outline">
                              <a href={resource.url} target="_blank" rel="noreferrer noopener nofollow">
                                   <ExternalLink/>
                                   Բացել հղումը
                              </a>
                         </Button>
                         <Button asChild variant="outline">
                              <Link href={`/admin/resources/editor?id=${encodeURIComponent(resource.id)}`}>
                                   <Edit/>
                                   Խմբագրել
                              </Link>
                         </Button>
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
                         <AlertDialogTitle>Համոզվա՞ծ եք, որ ուզում եք ջնջել այս ռեսուրսը</AlertDialogTitle>
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