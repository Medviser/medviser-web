"use client";
import { isAuthApiError } from "@neon/auth/next";
import { useCallback, useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { SiGithub } from "react-icons/si";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/client";
import { cn } from "@/lib/utils";

const cardClassName = "space-y-4 rounded-md border bg-card/60 p-4 text-card-foreground shadow-sm";

const providers = [
     { id: "google", name: "Google", Icon: FcGoogle },
     { id: "github", name: "GitHub", Icon: SiGithub },
] as const;

type Provider = (typeof providers)[number]["id"];
type LinkedAccount = { id: string; providerId: string };

function authErrorDetail(error?: { status?: number; code?: string } | null) {
     return error?.status ? ` (HTTP ${error.status}${error.code ? ` · ${error.code}` : ""})` : "";
}

export function LinkedAccounts({ className }: { className?: string }) {
     const [linkedAccounts, setLinkedAccounts] = useState<LinkedAccount[]>();
     const [loadError, setLoadError] = useState<string>();
     const [pendingAction, setPendingAction] = useState<{ provider: Provider; kind: "link" | "unlink" }>();
     const isLastSignInMethod = linkedAccounts?.length === 1;

     const loadAccounts = useCallback(async (signal?: AbortSignal) => {
          const message = "Չհաջողվեց բեռնել կապված հաշիվները։";
          try {
               const { data, error } = await authClient.listAccounts({ fetchOptions: { signal } });
               if (signal?.aborted) return;

               if (error || !data) {
                    setLoadError(message + authErrorDetail(error));
                    return;
               }

               setLinkedAccounts(data.map(({ id, providerId }) => ({ id, providerId })));
          } catch (error) {
               if (!signal?.aborted) {
                    setLoadError(message + authErrorDetail(isAuthApiError(error) ? error : undefined));
               }
          }
     }, []);

     useEffect(() => {
          const controller = new AbortController();
          void loadAccounts(controller.signal);
          return () => controller.abort();
     }, [loadAccounts]);

     useEffect(() => {
          const url = new URL(window.location.href);
          if (!url.searchParams.has("accountLinkError")) return;

          const code = url.searchParams.get("error");
          const detail = code && /^[a-z0-9_-]{1,80}$/i.test(code) ? ` (${code})` : "";
          toast.error(`Չհաջողվեց կապել հաշիվը։${detail}`);
          url.searchParams.delete("accountLinkError");
          url.searchParams.delete("error");
          url.searchParams.delete("error_description");
          window.history.replaceState(null, "", url);
     }, []);

     function retryLoadingAccounts() {
          setLoadError(undefined);
          void loadAccounts();
     }

     async function linkProvider(provider: Provider) {
          setPendingAction({ provider, kind: "link" });

          const message = "Չհաջողվեց սկսել հաշվի կապումը։";

          try {
               const { error } = await authClient.linkSocial({
                    provider,
                    callbackURL: new URL("/settings", window.location.origin).href,
                    errorCallbackURL: new URL(
                         "/settings?accountLinkError=1",
                         window.location.origin
                    ).href,
               });

               if (error) {
                    toast.error(message + authErrorDetail(error));
                    setPendingAction(undefined);
               }
          } catch (error) {
               toast.error(
                    message +
                         authErrorDetail(
                              isAuthApiError(error) ? error : undefined
                         )
               );
               setPendingAction(undefined);
          }
     }

     async function unlinkProvider(provider: Provider, accountId: string) {
          if (pendingAction || !linkedAccounts || linkedAccounts.length < 2) return;

          setPendingAction({ provider, kind: "unlink" });
          try {
               const { data, error } = await authClient.unlinkAccount({ accountId });
               if (error || !data?.status) {
                    const message = error?.code === "SESSION_EXPIRED"
                         ? "Նորից մուտք գործեք և կրկնեք անջատումը։"
                         : error?.message || "Չհաջողվեց անջատել հաշիվը։";
                    toast.error(message);
                    return;
               }
               setLinkedAccounts(accounts => accounts?.filter(account => account.id !== accountId));
               toast.success("Հաշիվն անջատվեց։");
          } catch {
               toast.error("Չհաջողվեց անջատել հաշիվը։");
          } finally {
               setPendingAction(undefined);
          }
     }

     return (
          <section aria-labelledby="linked-accounts-heading" className={cn(cardClassName, className)}>
               <h2 id="linked-accounts-heading" className="font-semibold">Կապված հաշիվներ</h2>
               <ul className="divide-y overflow-hidden rounded-md border">
                    {providers.map(({ id, name, Icon }) => {
                         const account = linkedAccounts?.find(({ providerId }) => providerId === id);
                         return (
                              <li key={id} className="flex flex-wrap items-center justify-between gap-3 px-3 py-2">
                                   <span className="flex items-center gap-2 text-sm">
                                        <Icon aria-hidden="true" className="size-4" />
                                        {name}
                                   </span>
                                   {account ? (
                                        <div className="flex items-center gap-2">
                                             <Badge variant="secondary">Կապված է</Badge>
                                             <AlertDialog>
                                                  <AlertDialogTrigger asChild>
                                                       <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            aria-label={`Անջատել ${name} հաշիվը`}
                                                            aria-describedby={isLastSignInMethod ? "last-sign-in-method" : undefined}
                                                            disabled={isLastSignInMethod || Boolean(pendingAction)}
                                                       >
                                                            {pendingAction?.provider === id && pendingAction.kind === "unlink"
                                                                 ? "Անջատվում է…" : "Անջատել"}
                                                       </Button>
                                                  </AlertDialogTrigger>
                                                  <AlertDialogContent>
                                                       <AlertDialogHeader>
                                                            <AlertDialogTitle>Անջատե՞լ {name} հաշիվը</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                 Անջատելուց հետո այս կապով այլևս չեք կարողանա մուտք գործել ձեր MedViser հաշիվ։
                                                            </AlertDialogDescription>
                                                       </AlertDialogHeader>
                                                       <AlertDialogFooter>
                                                            <AlertDialogCancel>Չեղարկել</AlertDialogCancel>
                                                            <AlertDialogAction variant="destructive" onClick={() => unlinkProvider(id, account.id)}>
                                                                 Անջատել
                                                            </AlertDialogAction>
                                                       </AlertDialogFooter>
                                                  </AlertDialogContent>
                                             </AlertDialog>
                                        </div>
                                   ) : (
                                        <Button
                                             type="button"
                                             variant="outline"
                                             size="sm"
                                             disabled={(!linkedAccounts && !loadError) || Boolean(pendingAction)}
                                             onClick={() => linkProvider(id)}
                                        >
                                             {pendingAction?.provider === id && pendingAction.kind === "link"
                                                  ? "Կապվում է…" : `Կապել ${name}`}
                                        </Button>
                                   )}
                              </li>
                         );
                    })}
               </ul>
               {isLastSignInMethod && providers.some(({ id }) => linkedAccounts[0]?.providerId === id) && (
                    <p id="last-sign-in-method" className="text-sm text-muted-foreground">
                         Վերջին մուտքի եղանակն անջատելու համար նախ ավելացրեք մեկ այլ եղանակ։
                    </p>
               )}
               {!linkedAccounts && (
                    <div className="flex flex-wrap items-center gap-2">
                         <output className="text-sm text-muted-foreground">
                              {loadError || "Բեռնվում են կապված հաշիվները…"}
                         </output>
                         {loadError && (
                              <Button type="button" size="sm" variant="outline" onClick={retryLoadingAccounts}>
                                   Կրկին փորձել
                              </Button>
                         )}
                    </div>
               )}
          </section>
     );
}