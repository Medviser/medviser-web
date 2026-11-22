"use client";
import { useState } from "react";
import { toast } from "sonner";
import {
     AlertDialog,
     AlertDialogAction,
     AlertDialogCancel,
     AlertDialogContent,
     AlertDialogDescription,
     AlertDialogFooter,
     AlertDialogHeader,
     AlertDialogTitle,
     AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/client";

const sectionClassName = "space-y-4 rounded-md border bg-card/60 p-4 text-card-foreground shadow-sm";

export function SessionSettings() {
     const [isRevoking, setIsRevoking] = useState(false);

     async function revokeOtherSessions() {
          setIsRevoking(true);
          try {
               const { error } = await authClient.revokeOtherSessions();
               if (error) {
                    toast.error(error.message || "Չհաջողվեց ավարտել մյուս սեսիաները։");
                    return;
               }
               toast.success("Մյուս սեսիաներն ավարտվեցին։");
          } catch {
               toast.error("Չհաջողվեց ավարտել մյուս սեսիաները։");
          } finally {
               setIsRevoking(false);
          }
     }

     return (
          <section aria-labelledby="sessions-heading" className={sectionClassName}>
               <div className="space-y-1">
                    <h2 id="sessions-heading" className="font-semibold">Մուտքի սեսիաներ</h2>
                    <p className="text-sm text-muted-foreground">Դուրս եկեք հաշվից մյուս սարքերում և դիտարկիչներում։</p>
               </div>
               <AlertDialog>
                    <AlertDialogTrigger asChild>
                         <Button type="button" variant="outline" disabled={isRevoking}>
                              {isRevoking ? "Սեսիաներն ավարտվում են…" : "Ավարտել մյուս սեսիաները"}
                         </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                         <AlertDialogHeader>
                              <AlertDialogTitle>Ավարտե՞լ մյուս սեսիաները</AlertDialogTitle>
                              <AlertDialogDescription>
                                   Մյուս սարքերում և դիտարկիչներում նորից պետք է մուտք գործեք։ Այս սեսիան կմնա ակտիվ։
                              </AlertDialogDescription>
                         </AlertDialogHeader>
                         <AlertDialogFooter>
                              <AlertDialogCancel>Չեղարկել</AlertDialogCancel>
                              <AlertDialogAction variant="destructive" onClick={revokeOtherSessions}>
                                   Ավարտել սեսիաները
                              </AlertDialogAction>
                         </AlertDialogFooter>
                    </AlertDialogContent>
               </AlertDialog>
          </section>
     );
}