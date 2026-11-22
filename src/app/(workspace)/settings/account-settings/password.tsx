"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth/client";
import { passwordSchema } from "@/lib/schemas";
import type { PasswordValues } from "@/lib/types/schema";

const passwordFields = [
     { name: "currentPassword", label: "Ընթացիկ գաղտնաբառ", autoComplete: "current-password" },
     { name: "newPassword", label: "Նոր գաղտնաբառ", autoComplete: "new-password" },
     { name: "confirmPassword", label: "Կրկնեք նոր գաղտնաբառը", autoComplete: "new-password" },
] as const;

const sectionClassName = "space-y-4 rounded-md border bg-card/60 p-4 text-card-foreground shadow-sm";

export function PasswordSettings() {
     const form = useForm<PasswordValues>({
          resolver: zodResolver(passwordSchema),
          defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
     });
     const { isSubmitting } = form.formState;

     async function savePassword({ currentPassword, newPassword }: PasswordValues) {
          try {
               const { error } = await authClient.changePassword({ currentPassword, newPassword });
               if (error) {
                    toast.error(error.message || "Չհաջողվեց փոխել գաղտնաբառը։");
                    return;
               }
               form.reset();
               toast.success("Գաղտնաբառը փոխվեց։");
          } catch {
               toast.error("Չհաջողվեց փոխել գաղտնաբառը։");
          }
     }

     return (
          <section aria-labelledby="password-heading" className={sectionClassName}>
               <div className="space-y-1">
                    <h2 id="password-heading" className="font-semibold">Գաղտնաբառ</h2>
                    <p className="text-sm text-muted-foreground">Այս բաժինը էլ․ փոստով և գաղտնաբառով մուտք գործող հաշիվների համար է։</p>
               </div>
               <form noValidate onSubmit={form.handleSubmit(savePassword)} className="space-y-4">
                    <FieldGroup className="gap-4">
                         {passwordFields.map(({ name, label, autoComplete }) => (
                              <Controller
                                   key={name}
                                   control={form.control}
                                   name={name}
                                   render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                             <FieldLabel htmlFor={name}>{label}</FieldLabel>
                                             <Input
                                                  {...field}
                                                  id={name}
                                                  type="password"
                                                  autoComplete={autoComplete}
                                                  disabled={isSubmitting}
                                                  aria-invalid={fieldState.invalid}
                                                  aria-describedby={fieldState.error ? `${name}-error` : undefined}
                                             />
                                             {fieldState.error && <FieldError id={`${name}-error`} errors={[fieldState.error]} />}
                                        </Field>
                                   )}
                              />
                         ))}
                    </FieldGroup>
                    <Button type="submit" disabled={isSubmitting}>
                         {isSubmitting ? "Փոխվում է…" : "Փոխել գաղտնաբառը"}
                    </Button>
               </form>
          </section>
     );
}