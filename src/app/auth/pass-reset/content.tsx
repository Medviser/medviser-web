"use client";

import Link from "next/link";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, Mail } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

import { authClient } from "@/lib/auth/client";
import { passwordResetRequestSchema } from "@/lib/schemas/auth";
import type { PasswordResetRequestFormValues } from "@/lib/types/schema";

export default function PasswordResetContent() {
  const [isSubmitting, startTransition] = useTransition();

  const form = useForm<PasswordResetRequestFormValues>({
    resolver: zodResolver(passwordResetRequestSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: PasswordResetRequestFormValues) => {
    startTransition(async () => {
      const { error } = await authClient.requestPasswordReset({
        email: values.email,
        redirectTo: "/auth/password/new",
      });

      if (error) {
        toast.error(error.message || "Չհաջողվեց ուղարկել վերականգնման հղումը։");

        return;
      }

      /*
       * Deliberately generic.
       * Don't reveal whether the account exists.
       */
      toast.success(
        "Եթե այդ էլ․ փոստով հաշիվ գոյություն ունի, վերականգնման հղումը կուղարկվի։",
      );
    });
  };

  return (
    <div className="p-5 rounded-md bg-card/80 backdrop-blur-md border text-card-foreground shadow-sm max-w-lg w-full space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div className="space-y-2 flex-3">
          <h1 className="font-semibold text-xl md:text-2xl lg:text-3xl">
            Գաղտնաբառի վերականգնում
          </h1>

          <Button asChild variant="link" className="p-0">
            <Link href="/auth">Արդեն հիշե՞լ եք։</Link>
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
            name="email"
            disabled={isSubmitting}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Էլ․ փոստ</FieldLabel>

                <Input
                  {...field}
                  id={field.name}
                  type="email"
                  autoComplete="email"
                  autoCapitalize="none"
                  spellCheck={false}
                  placeholder="name@example.com"
                  aria-invalid={fieldState.invalid}
                />

                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Spinner /> : <Mail />}

            {isSubmitting ? "Ուղարկվում է…" : "Ուղարկել վերականգնման հղումը"}
          </Button>
        </FieldGroup>
      </form>
    </div>
  );
}
