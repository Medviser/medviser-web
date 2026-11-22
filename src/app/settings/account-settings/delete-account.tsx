"use client";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth/client";
import { cn } from "@/lib/utils";

const cardClassName =
  "space-y-4 rounded-md border bg-card/60 p-4 text-card-foreground shadow-sm";

export function DeleteAccount({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const form = useForm({ defaultValues: { password: "" } });
  const { isSubmitting, errors } = form.formState;

  function handleOpenChange(nextOpen: boolean) {
    if (isSubmitting) return;
    if (!nextOpen) form.reset();
    setOpen(nextOpen);
  }

  async function deleteAccount({ password }: { password: string }) {
    form.clearErrors("root.deleteAccount");

    const defaultError = "Չհաջողվեց ջնջել հաշիվը։";
    const normalizedPassword = password.trim();

    try {
      const { error } = await authClient.deleteUser({
        ...(normalizedPassword ? { password: normalizedPassword } : {}),
        callbackURL: "/auth",
      });

      if (error) {
        const message =
          error.code === "SESSION_EXPIRED"
            ? "Նորից մուտք գործեք և կրկնեք ջնջման հարցումը։"
            : error.message || defaultError;

        form.setError("root.deleteAccount", {
          message,
        });

        return;
      }

      /*
       * deleteUser-ի հաջող request-ը երկու արդյունք կարող է ունենալ.
       *
       * 1. Account-ը արդեն ջնջվել է։
       * 2. Better Auth-ը verification email է ուղարկել։
       *
       * Response message string-ի վրա չենք հիմնվում։
       */

      const { data: session } = await authClient.getSession();

      if (!session) {
        window.location.replace("/auth");
        return;
      }

      toast.success(
        "Ջնջումը հաստատելու համար բացեք ձեր էլ․ փոստին ուղարկված հղումը։",
      );

      form.reset();
      setOpen(false);
    } catch {
      form.setError("root.deleteAccount", {
        message: defaultError,
      });
    }
  }

  return (
    <section
      aria-labelledby="delete-account-heading"
      className={cn(cardClassName, "border-destructive/30", className)}
    >
      <div className="space-y-1">
        <h2 id="delete-account-heading" className="font-semibold">
          Ջնջել հաշիվը
        </h2>
        <p className="text-sm text-muted-foreground">
          MedViser հաշվի ջնջումը վերջնական է։
        </p>
      </div>
      <AlertDialog open={open} onOpenChange={handleOpenChange}>
        <AlertDialogTrigger asChild>
          <Button type="button" variant="destructive">
            Ջնջել հաշիվը
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ջնջե՞լ ձեր հաշիվը</AlertDialogTitle>
            <AlertDialogDescription>
              Ջնջումից հետո կկորցնեք այս հաշվով մուտքի հնարավորությունը։
            </AlertDialogDescription>
          </AlertDialogHeader>
          <form
            onSubmit={form.handleSubmit(deleteAccount)}
            className="space-y-4"
          >
            <Controller
              control={form.control}
              name="password"
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor="delete-account-password">
                    Ընթացիկ գաղտնաբառը, եթե այն ունեք
                  </FieldLabel>
                  <Input
                    {...field}
                    id="delete-account-password"
                    type="password"
                    autoComplete="current-password"
                    disabled={isSubmitting}
                  />
                </Field>
              )}
            />
            {errors.root?.deleteAccount && (
              <FieldError errors={[errors.root.deleteAccount]} />
            )}
            <AlertDialogFooter>
              <AlertDialogCancel type="button" disabled={isSubmitting}>
                Չեղարկել
              </AlertDialogCancel>
              <Button
                type="submit"
                variant="destructive"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Հարցումն ուղարկվում է…" : "Հաստատել ջնջումը"}
              </Button>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
