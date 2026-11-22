import { Pencil, Trash2, X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Specialty } from "@/db/schema";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogMedia, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useTransition } from "react";
import { removeSpecialty } from "@/actions/specialties";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

type SpecialtyCardProps = {
     specialty: Specialty;
     sponsorName?: string | null;
     editHref?: string;
     onDelete: (id: string) => void;
};

const dateFormat = new Intl.DateTimeFormat("hy-AM", {
     dateStyle: "medium",
     timeZone: "Asia/Yerevan",
});

export default function SpecialtyCard({
     specialty,
     sponsorName,
     onDelete
}: SpecialtyCardProps) {
     const [isDeleting, startTransition] = useTransition();
     const handleDelete = () => {
          startTransition(async()=>{
               const res = await removeSpecialty(specialty.id);
               if(res.error){
                    toast.error(res.error);
                    return;
               }
               if(res.success) {
                    onDelete(specialty.id);
                    return;
               }
          })
     }
     return (
          <AlertDialog>
               <article className="space-y-4 rounded-md border bg-card/60 p-4 text-card-foreground shadow-sm backdrop-blur-sm">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                         <div className="min-w-0">
                              <h2 className="wrap-break-word text-lg font-semibold">
                                   {specialty.name_hy}
                              </h2>
                              <p className="break-all text-sm text-muted-foreground">
                                   {specialty.slug}
                              </p>
                         </div>
                         <Badge variant={specialty.is_published ? "default" : "secondary"}>
                              {specialty.is_published ? "Հրապարակված է" : "Չհրապարակված"}
                         </Badge>
                    </div>
                    <dl className="space-y-2 text-sm">
                         <div className="flex justify-between gap-3">
                              <dt className="text-muted-foreground">Հերթականություն</dt>
                              <dd>{specialty.sort_order}</dd>
                         </div>
                         {sponsorName && (
                              <div className="flex justify-between gap-3">
                                   <dt className="text-muted-foreground">Հովանավոր</dt>
                                   <dd className="text-right">
                                        {sponsorName}
                                        {specialty.sponsor_until && (
                                             <div className="text-muted-foreground">
                                                  Մինչև {dateFormat.format(specialty.sponsor_until)}
                                             </div>
                                        )}
                                   </dd>
                              </div>
                         )}
                    </dl>
                    <div className="flex justify-between items-center">
                         <Button asChild variant="outline">
                              <Link href={`/admin/specialties/editor?id=${specialty.id}`}>
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
                         <AlertDialogTitle>Համոզվա՞ծ եք, որ ուզում եք ջնջել այս մասնագիտությունը</AlertDialogTitle>
                         <AlertDialogDescription>Գործողությունը հնարավոր չէ չեղարկել</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                         <AlertDialogCancel>
                              <X/>
                              Չեղարկել
                         </AlertDialogCancel>
                         <AlertDialogAction variant="destructive" onClick={handleDelete}>
                              {isDeleting ? <Spinner/> : <Trash2/>}
                              {isDeleting ? "Խնդրում ենք սպասել..." : "Ջնջել"}
                         </AlertDialogAction>
                    </AlertDialogFooter>
               </AlertDialogContent>
          </AlertDialog>
     );
}