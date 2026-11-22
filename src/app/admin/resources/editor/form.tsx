// resources/editor/form.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { createResource, editResource } from "@/actions/resource";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { Resource } from "@/db/schema";
import { resourceSchema } from "@/lib/schemas/index";
import type { ResourceFormValues } from "@/lib/types/schema";
import { useTransition } from "react";

export default function ResourceEditorForm({ resource }: { resource?: Resource }) {
     const router = useRouter();
     const [isSubmitting, startTransition] = useTransition()
     const form = useForm<ResourceFormValues>({
          resolver: zodResolver(resourceSchema),
          defaultValues: {
               title: resource?.title ?? "",
               url: resource?.url ?? "",
               description: resource?.description ?? "",
               is_published: resource?.is_published ?? false,
          },
     });

     function onSubmit(values: ResourceFormValues) {
          startTransition(async()=>{
               try {
                    const result = resource ? await editResource(resource.id, values) : await createResource(values);
                    if ("error" in result) {
                         toast.error(result.error);
                         return;
                    }
                    toast.success(resource ? "Ռեսուրսը պահպանվեց։" : "Ռեսուրսը ստեղծվեց։");
                    router.push("/admin/resources");
               } catch {
                    toast.error("Չհաջողվեց պահպանել ռեսուրսը։");
               }
          })
     }

     return (
          <div className="space-y-4">
               <div className="flex flex-wrap items-center justify-between gap-3">
                    <h1 className="text-xl font-semibold md:text-2xl lg:text-3xl">
                         {resource ? "Խմբագրել ռեսուրսը" : "Ստեղծել ռեսուրս"}
                    </h1>

                    <Button variant="outline" asChild>
                         <Link href="/admin/resources">
                              <ChevronLeft />
                              Վերադառնալ
                         </Link>
                    </Button>
               </div>

               <form
                    noValidate
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="w-full space-y-5 rounded-md border bg-card/60 p-4 shadow-sm backdrop-blur-sm"
               >
                    <FieldGroup className="gap-5">
                         <div className="grid gap-5 md:grid-cols-2">
                              <Controller
                                   control={form.control}
                                   name="title"
                                   disabled={isSubmitting}
                                   render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                             <FieldLabel htmlFor={field.name}>Վերնագիր</FieldLabel>
                                             <Input {...field} id={field.name} aria-invalid={fieldState.invalid} />
                                             {fieldState.error && <FieldError errors={[fieldState.error]} />}
                                        </Field>
                                   )}
                              />
                              <Controller
                                   control={form.control}
                                   name="url"
                                   disabled={isSubmitting}
                                   render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                             <FieldLabel htmlFor={field.name}>Հղում</FieldLabel>
                                             <Input
                                                  {...field}
                                                  id={field.name}
                                                  type="url"
                                                  placeholder="https://example.com"
                                                  aria-invalid={fieldState.invalid}
                                             />
                                        {fieldState.error && <FieldError errors={[fieldState.error]} />}
                                        </Field>
                                   )}
                              />
                         </div>
                         <Controller
                              control={form.control}
                              name="description"
                              disabled={isSubmitting}
                              render={({ field, fieldState }) => (
                                   <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>Նկարագրություն</FieldLabel>
                                        <Textarea
                                             {...field}
                                             id={field.name}
                                             rows={3}
                                             aria-invalid={fieldState.invalid}
                                        />
                                        {fieldState.error && <FieldError errors={[fieldState.error]} />}
                                   </Field>
                              )}
                         />
                         <Controller
                              control={form.control}
                              name="is_published"
                              disabled={isSubmitting}
                              render={({ field }) => (
                                   <Field orientation="horizontal">
                                        <Switch
                                             id={field.name}
                                             ref={field.ref}
                                             checked={field.value}
                                             onCheckedChange={field.onChange}
                                             onBlur={field.onBlur}
                                        />
                                        <FieldLabel htmlFor={field.name}>Հրապարակել</FieldLabel>
                                   </Field>
                              )}
                         />
                    </FieldGroup>

                    <div className="flex justify-end">
                         <Button type="submit" disabled={isSubmitting}>
                              {isSubmitting
                                   ? "Պահպանվում է…"
                                   : resource ? "Պահպանել" : "Ստեղծել"}
                         </Button>
                    </div>
               </form>
          </div>
     );
}