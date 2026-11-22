"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, Eye, EyeOff, KeyRound } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";

import { authClient } from "@/lib/auth/client";
import { newPasswordSchema } from "@/lib/schemas/auth";
import type { NewPasswordFormValues } from "@/lib/types/schema";

interface PasswordResetNewContentProps{
  token?: string;
  error?: string;
}
export default function PasswordResetNewContent({token, error}: PasswordResetNewContentProps) {
  const router = useRouter();

  const [shown, setShown] = useState(false);
  const [confirmShown, setConfirmShown] = useState(false);
  const [isSubmitting, startTransition] = useTransition();

  const form = useForm<NewPasswordFormValues>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: NewPasswordFormValues) => {
    if (!token) {
      toast.error("Վերականգնման հղումը անվավեր կամ ժամկետանց է։");
      return;
    }

    startTransition(async () => {
      const { error } = await authClient.resetPassword({
        newPassword: values.password,
        token,
      });

      if (error) {
        toast.error(error.message || "Չհաջողվեց փոխել գաղտնաբառը։");
        return;
      }

      toast.success("Գաղտնաբառը հաջողությամբ փոխվեց։");
      router.replace("/auth");
    });
  };

  if (error || !token) {
    return (
      <div className="p-5 rounded-md bg-card/80 backdrop-blur-md border text-card-foreground shadow-sm max-w-sm w-full space-y-5">
        <h1 className="font-semibold text-xl md:text-2xl">Անվավեր հղում</h1>

        <p className="text-sm text-muted-foreground">
          Վերականգնման հղումը անվավեր կամ ժամկետանց է։
        </p>

        <Button asChild>
          <Link href="/auth/pass-reset">Նոր հղում ստանալ</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="p-5 rounded-md bg-card/80 backdrop-blur-md border text-card-foreground shadow-sm max-w-lg w-full space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div className="space-y-2">
          <h1 className="font-semibold text-xl md:text-2xl lg:text-3xl">
            Նոր գաղտնաբառ
          </h1>

          <Button asChild variant="link" className="p-0">
            <Link href="/auth">Վերադառնալ մուտքին</Link>
          </Button>
        </div>

        <Button asChild variant="secondary">
          <Link href="/">
            <ChevronLeft />
            Վերադառնալ
          </Link>
        </Button>
      </div>

      <form noValidate onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup className="gap-5">
          <Controller
            control={form.control}
            name="password"
            disabled={isSubmitting}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Նոր գաղտնաբառ</FieldLabel>

                <InputGroup>
                  <InputGroupInput
                    {...field}
                    id={field.name}
                    type={shown ? "text" : "password"}
                    autoComplete="new-password"
                    aria-invalid={fieldState.invalid}
                  />

                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      type="button"
                      size="icon-xs"
                      aria-label={
                        shown ? "Թաքցնել գաղտնաբառը" : "Ցուցադրել գաղտնաբառը"
                      }
                      onClick={() => setShown((value) => !value)}
                    >
                      {shown ? <EyeOff /> : <Eye />}
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>

                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="confirmPassword"
            disabled={isSubmitting}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>
                  Կրկնել նոր գաղտնաբառը
                </FieldLabel>

                <InputGroup>
                  <InputGroupInput
                    {...field}
                    id={field.name}
                    type={confirmShown ? "text" : "password"}
                    autoComplete="new-password"
                    aria-invalid={fieldState.invalid}
                  />

                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      type="button"
                      size="icon-xs"
                      aria-label={
                        confirmShown
                          ? "Թաքցնել գաղտնաբառը"
                          : "Ցուցադրել գաղտնաբառը"
                      }
                      onClick={() => setConfirmShown((value) => !value)}
                    >
                      {confirmShown ? <EyeOff /> : <Eye />}
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>

                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Spinner /> : <KeyRound />}

            {isSubmitting ? "Փոխվում է…" : "Փոխել գաղտնաբառը"}
          </Button>
        </FieldGroup>
      </form>
    </div>
  );
}
