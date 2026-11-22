"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, Eye, EyeOff, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth/client";
import { toast } from "sonner";
import { registerSchema } from "@/lib/schemas/auth";
import type { RegisterFormValues } from "@/lib/types/schema";

export default function RegisterContent() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, startTransition] = useTransition();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  const onSubmit = (values: RegisterFormValues) => {
    startTransition(async () => {
      await authClient.signUp.email(
        {
          name: values.name,
          email: values.email,
          password: values.password,
          callbackURL: "/",
        },
        {
          onError(context) {
            toast.error(context.error.message || "Չհաջողվեց ստեղծել հաշիվը։");
          },
          onSuccess() {
            toast.success("Հաշիվը հաջողությամբ ստեղծվեց։");
          },
        },
      );
    });
  };

  return (
    <div className="p-5 rounded-md bg-card/80 backdrop-blur-md border text-card-foreground shadow-sm max-w-lg w-full space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div className="space-y-2 flex-3">
          <h1 className="font-semibold text-xl md:text-2xl lg:text-3xl">
            Գրանցում
          </h1>

          <Button asChild variant="link" className="p-0">
            <Link href="/auth">Արդեն ունե՞ք հաշիվ։</Link>
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
            name="name"
            disabled={isSubmitting}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Անուն</FieldLabel>

                <Input
                  {...field}
                  id={field.name}
                  autoComplete="name"
                  aria-invalid={fieldState.invalid}
                />

                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

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

          <Controller
            control={form.control}
            name="password"
            disabled={isSubmitting}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Գաղտնաբառ</FieldLabel>

                <InputGroup>
                  <InputGroupInput
                    {...field}
                    id={field.name}
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    aria-invalid={fieldState.invalid}
                  />

                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      type="button"
                      size="icon-xs"
                      aria-label={
                        showPassword
                          ? "Թաքցնել գաղտնաբառը"
                          : "Ցուցադրել գաղտնաբառը"
                      }
                      onClick={() => setShowPassword((value) => !value)}
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
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
                <FieldLabel htmlFor={field.name}>Կրկնել գաղտնաբառը</FieldLabel>

                <InputGroup>
                  <InputGroupInput
                    {...field}
                    id={field.name}
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    aria-invalid={fieldState.invalid}
                  />

                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      type="button"
                      size="icon-xs"
                      onClick={() => setShowConfirmPassword((value) => !value)}
                    >
                      {showConfirmPassword ? <EyeOff /> : <Eye />}
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>

                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="acceptTerms"
            disabled={isSubmitting}
            render={({ field, fieldState }) => (
              <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                <Checkbox
                  ref={field.ref}
                  id="accept-terms"
                  checked={field.value}
                  onBlur={field.onBlur}
                  onCheckedChange={(checked) =>
                    field.onChange(checked === true)
                  }
                  disabled={field.disabled}
                />

                <FieldContent>
                  <FieldLabel htmlFor="accept-terms">
                    Համաձայն եմ{" "}
                    <Link href="/terms" className="underline">
                      օգտագործման պայմաններին
                    </Link>
                  </FieldLabel>

                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldContent>
              </Field>
            )}
          />

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Spinner /> : <UserPlus />}

            {isSubmitting ? "Հաշիվը ստեղծվում է…" : "Գրանցվել"}
          </Button>
        </FieldGroup>
      </form>
    </div>
  );
}
