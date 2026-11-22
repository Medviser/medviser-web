"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth/client";
import { getInitialsFromName } from "@/lib/utils";
import { profileSchema } from "@/lib/schemas";
import type { ProfileValues } from "@/lib/types/schema";

type Profile = {
     name: string;
     email: string;
     emailVerified: boolean;
     image?: string | null;
};

const sectionClassName = "space-y-4 rounded-md border bg-card/60 p-4 text-card-foreground shadow-sm";

export default function ProfileSettings({ name, email, emailVerified, image }: Profile) {
     const form = useForm<ProfileValues>({
          resolver: zodResolver(profileSchema),
          defaultValues: { name },
     });
     const { isSubmitting, isDirty } = form.formState;

     async function saveProfile(values: ProfileValues) {
          try {
               const { error } = await authClient.updateUser(values);
               if (error) {
                    toast.error(error.message || "Չհաջողվեց պահպանել անունը։");
                    return;
               }
               form.reset(values);
               toast.success("Անունը պահպանվեց։");
          } catch {
               toast.error("Չհաջողվեց պահպանել անունը։");
          }
     }

     return (
          <section aria-labelledby="profile-settings-heading" className={sectionClassName}>
               <h2 id="profile-settings-heading" className="font-semibold">Պրոֆիլ</h2>
               <div className="flex items-center gap-3">
                    <Avatar className="size-12">
                         <AvatarImage src={image ?? undefined} alt="" />
                         <AvatarFallback>{name ? getInitialsFromName(name).slice(0, 2) : "?"}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 space-y-1">
                         <p className="wrap-break-word text-sm">{email}</p>
                         {emailVerified && <Badge variant="outline">Հաստատված էլ․ փոստ</Badge>}
                    </div>
               </div>
               <form noValidate onSubmit={form.handleSubmit(saveProfile)} className="space-y-4">
                    <Controller
                         control={form.control}
                         name="name"
                         render={({ field, fieldState }) => (
                              <Field data-invalid={fieldState.invalid}>
                                   <FieldLabel htmlFor="profile-name">Ցուցադրվող անուն</FieldLabel>
                                   <Input
                                        {...field}
                                        id="profile-name"
                                        autoComplete="name"
                                        disabled={isSubmitting}
                                        aria-invalid={fieldState.invalid}
                                        aria-describedby={fieldState.error ? "profile-name-error" : undefined}
                                   />
                                   {fieldState.error && <FieldError id="profile-name-error" errors={[fieldState.error]} />}
                              </Field>
                         )}
                    />
                    <Button type="submit" disabled={isSubmitting || !isDirty}>
                         {isSubmitting ? "Պահպանվում է…" : "Պահպանել անունը"}
                    </Button>
               </form>
          </section>
     );
}