"use client";
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

const cardClassName =
  "space-y-4 rounded-md border bg-card/60 p-4 text-card-foreground shadow-sm";
const providers = [
  { id: "google", name: "Google", Icon: FcGoogle },
  { id: "github", name: "GitHub", Icon: SiGithub },
] as const;
type Provider = (typeof providers)[number]["id"];
type LinkedAccount = {
  id: string;
  providerId: string;
};

export function LinkedAccounts({ className }: { className?: string }) {
  const [linkedAccounts, setLinkedAccounts] = useState<LinkedAccount[]>();
  const [loadError, setLoadError] = useState<string>();
  const [pendingAction, setPendingAction] = useState<{
    provider: Provider;
    kind: "link" | "unlink";
  }>();
  const isLastSignInMethod = linkedAccounts?.length === 1;
  const loadAccounts = useCallback(async () => {
    setLoadError(undefined);

    try {
      const { data, error } = await authClient.listAccounts();

      if (error) {
        setLoadError(error.message || "Չհաջողվեց բեռնել կապված հաշիվները։");
        return;
      }

      setLinkedAccounts(
        (data ?? []).map(({ id, providerId }) => ({
          id,
          providerId,
        })),
      );
    } catch {
      setLoadError("Չհաջողվեց բեռնել կապված հաշիվները։");
    }
  }, []);

  async function linkProvider(provider: Provider) {
    if (pendingAction) return;

    setPendingAction({
      provider,
      kind: "link",
    });

    try {
      const { error } = await authClient.linkSocial({
        provider,
        callbackURL: "/settings",
      });

      if (error) {
        toast.error(error.message || "Չհաջողվեց սկսել հաշվի կապումը։");
        setPendingAction(undefined);
      }

      // Success-ի դեպքում browser-ը OAuth redirect է անում։
    } catch {
      toast.error("Չհաջողվեց սկսել հաշվի կապումը։");
      setPendingAction(undefined);
    }
  }

  async function unlinkProvider(provider: Provider, accountId: string) {
    if (pendingAction || !linkedAccounts || linkedAccounts.length <= 1) {
      return;
    }

    setPendingAction({
      provider,
      kind: "unlink",
    });

    try {
      const { error } = await authClient.unlinkAccount({
        accountId,
      });

      if (error) {
        toast.error(error.message || "Չհաջողվեց անջատել հաշիվը։");
        return;
      }

      await loadAccounts();
      toast.success("Հաշիվն անջատվեց։");
    } catch {
      toast.error("Չհաջողվեց անջատել հաշիվը։");
    } finally {
      setPendingAction(undefined);
    }
  }

  useEffect(() => {
    void loadAccounts();
  }, [loadAccounts]);

  useEffect(() => {
    const url = new URL(window.location.href);
    const error = url.searchParams.get("error");
    if (!error) return;
    const errorMessages: Record<string, string> = {
      unable_to_link_account: "Չհաջողվեց կապել հաշիվը։",
      account_already_linked_to_different_user:
        "Այս հաշիվն արդեն կապված է մեկ այլ օգտատիրոջ հետ։",
      account_not_linked: "Այս հաշիվը դեռ կապված չէ ձեր օգտահաշվին։",
      email_doesnt_match:
        "Այս հաշվի էլ. հասցեն չի համապատասխանում ձեր օգտահաշվին։",
      state_mismatch:
        "Հաշվի կապման գործընթացը անվավեր կամ ժամկետանց է։ Կրկին փորձեք։",
      state_invalid: "Հաշվի կապման տվյալներն անվավեր են։ Կրկին փորձեք։",
    };
    toast.error(errorMessages[error] ?? `Չհաջողվեց կապել հաշիվը։ (${error})`);
    url.searchParams.delete("error");
    url.searchParams.delete("error_description");
    window.history.replaceState(null, "", url.pathname + url.search + url.hash);
  }, []);

  return (
    <section
      aria-labelledby="linked-accounts-heading"
      className={cn(cardClassName, className)}
    >
      <h2 id="linked-accounts-heading" className="font-semibold">
        Կապված հաշիվներ
      </h2>

      <ul className="divide-y overflow-hidden rounded-md border">
        {providers.map(({ id, name, Icon }) => {
          const account = linkedAccounts?.find(
            ({ providerId }) => providerId === id,
          );

          const isLinking =
            pendingAction?.provider === id && pendingAction.kind === "link";

          const isUnlinking =
            pendingAction?.provider === id && pendingAction.kind === "unlink";

          return (
            <li
              key={id}
              className="flex flex-wrap items-center justify-between gap-3 px-3 py-2"
            >
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
                        aria-describedby={
                          isLastSignInMethod ? "last-sign-in-method" : undefined
                        }
                        disabled={isLastSignInMethod || Boolean(pendingAction)}
                      >
                        {isUnlinking ? "Անջատվում է…" : "Անջատել"}
                      </Button>
                    </AlertDialogTrigger>

                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Անջատե՞լ {name} հաշիվը
                        </AlertDialogTitle>

                        <AlertDialogDescription>
                          Անջատելուց հետո այս մուտքի եղանակն այլևս հասանելի չի
                          լինի ձեր MedViser հաշվի համար։
                        </AlertDialogDescription>
                      </AlertDialogHeader>

                      <AlertDialogFooter>
                        <AlertDialogCancel>Չեղարկել</AlertDialogCancel>

                        <AlertDialogAction
                          variant="destructive"
                          onClick={() => unlinkProvider(id, account.id)}
                        >
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
                  disabled={!linkedAccounts || Boolean(pendingAction)}
                  onClick={() => linkProvider(id)}
                >
                  {isLinking ? "Կապվում է…" : `Կապել ${name}`}
                </Button>
              )}
            </li>
          );
        })}
      </ul>

      {isLastSignInMethod && (
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
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => void loadAccounts()}
            >
              Կրկին փորձել
            </Button>
          )}
        </div>
      )}
    </section>
  );
}
