"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { createTopic, editTopic } from "@/actions/topics";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
     Select,
     SelectContent,
     SelectItem,
     SelectTrigger,
     SelectValue,
} from "@/components/ui/select";
import type { getTopicSpecialtyOptions } from "@/data/topics";
import type { Topic } from "@/db/schema";
import { topicSchema } from "@/lib/schemas/index";
import type { TopicFormValues } from "@/lib/types/schema";

type Props = {
     topic: Topic | null;
     specialties: Awaited<ReturnType<typeof getTopicSpecialtyOptions>>;
};

export default function TopicEditorForm({ topic, specialties }: Props) {
     const router = useRouter();
     const [isPending, startTransition] = useTransition();
     const form = useForm<TopicFormValues>({
          resolver: zodResolver(topicSchema),
          defaultValues: {
               name_hy: topic?.name_hy ?? "",
               specialty_id: topic?.specialty_id ?? "",
          },
     });
     function onSubmit(values: TopicFormValues) {
          startTransition(async () => {
               try {
                    const result = topic ? await editTopic(topic.id, {
                         ...values,
                         specialty_id: topic.specialty_id,
                    }) : await createTopic(values);
                    if (result.error) {
                         toast.error(result.error);
                         return;
                    }
                    toast.success("Թեման պահպանվեց։");
                    form.reset();
                    router.push("/admin/topics");
               } catch {
                    toast.error("Չհաջողվեց պահպանել թեման։ Կրկին փորձեք։");
               }
          });
     }
     return (
          <div className="space-y-4">
               <div className="flex flex-wrap items-center justify-between gap-3">
                    <h1 className="text-2xl font-semibold">
                         {topic ? "Խմբագրել թեման" : "Ստեղծել թեմա"}
                    </h1>
                    <Button asChild variant="outline">
                         <Link href="/admin/topics">Վերադառնալ</Link>
                    </Button>
               </div>
               <form
                    noValidate
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-5 rounded-md border bg-card/60 p-4 shadow-sm"
               >
                    <FieldGroup>
                         <Controller
                              control={form.control}
                              name="name_hy"
                              disabled={isPending}
                              render={({ field, fieldState }) => (
                                   <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>Թեմայի անունը</FieldLabel>
                                        <Input
                                             {...field}
                                             id={field.name}
                                             aria-invalid={fieldState.invalid}
                                             placeholder="Օրինակ՝ Սրտաբանություն"
                                        />
                                        {fieldState.error && <FieldError errors={[fieldState.error]} />}
                                   </Field>
                              )}
                         />
                         <Controller
                              control={form.control}
                              name="specialty_id"
                              disabled={Boolean(topic) || isPending}
                              render={({ field, fieldState }) => (
                                   <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>Մասնագիտություն</FieldLabel>
                                        <Select
                                             name={field.name}
                                             value={field.value}
                                             onValueChange={field.onChange}
                                             disabled={field.disabled}
                                        >
                                             <SelectTrigger
                                                  id={field.name}
                                                  ref={field.ref}
                                                  onBlur={field.onBlur}
                                                  aria-invalid={fieldState.invalid}
                                                  disabled={field.disabled}
                                                  className="w-full"
                                             >
                                                  <SelectValue placeholder="Ընտրեք մասնագիտությունը" />
                                             </SelectTrigger>
                                             <SelectContent>
                                                  {specialties.map((specialty) => (
                                                       <SelectItem key={specialty.id} value={specialty.id}>
                                                            {specialty.name_hy}
                                                       </SelectItem>
                                                  ))}
                                             </SelectContent>
                                        </Select>
                                        {fieldState.error && <FieldError errors={[fieldState.error]} />}
                                   </Field>
                              )}
                         />
                    </FieldGroup>
                    <div className="flex justify-end">
                         <Button type="submit" disabled={isPending}>
                         {isPending ? "Պահպանվում է…" : topic ? "Պահպանել" : "Ստեղծել"}
                         </Button>
                    </div>
               </form>
          </div>
     );
}