"use client";
import { ChevronLeft, Plus, Save } from "lucide-react";
import Link from "next/link";
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
import { Switch } from "@/components/ui/switch";
import type { Specialty, sponsors } from "@/db/schema";
import type { SpecialtyFormData, SpecialtyFormValues } from "@/lib/types/schema";
import { specialtySchema } from "@/lib/schemas/index";
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTransition } from "react";
import { createSpecialty, editSpecialty } from "@/actions/specialties";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";

type SponsorOption = Pick<typeof sponsors.$inferSelect, "id" | "name">;

type SpecialtyEditorFormProps = {
     specialty?: Specialty | null;
     sponsorOptions: SponsorOption[];
     backHref?: string;
};

const NO_SPONSOR = "none";

export default function SpecialtyEditorForm({
     specialty,
     sponsorOptions,
     backHref = "/admin/specialties",
}: SpecialtyEditorFormProps) {
     const [isSubmitting, startTransition] = useTransition()
     const router = useRouter()
     const sponsorUntil = specialty?.sponsor_until?.toISOString().slice(0, -1);
     const form = useForm<SpecialtyFormValues, unknown, SpecialtyFormData>({
          resolver: zodResolver(specialtySchema),
          defaultValues: {
               name_hy: specialty?.name_hy ?? "",
               slug: specialty?.slug ?? "",
               sort_order: specialty?.sort_order ?? 0,
               sponsor_id: specialty?.sponsor_id ?? NO_SPONSOR,
               sponsor_until: sponsorUntil ?? "",
               is_published: specialty?.is_published ?? false,
          },
     });
     const onSubmit = (values: SpecialtyFormData) => {
          startTransition(async() => {
               const res = specialty ? await editSpecialty(specialty.id, values) : await createSpecialty(values);
               if(res.error) {
                    toast.error(res.error);
                    return;
               }
               toast.success(specialty ? "Մասնագիտությունը պահպանվեց։" : "Մասնագիտությունը ստեղծվեց։");
               router.push("/admin/specialties")
          })
     }
     return (
          <div className="space-y-4">
               <div className="flex flex-wrap items-center justify-between gap-3">
                    <h1 className="text-xl font-semibold md:text-2xl lg:text-3xl">
                         {specialty ? "Խմբագրել մասնագիտությունը" : "Ստեղծել մասնագիտություն"}
                    </h1>
                    <Button variant="outline" asChild>
                         <Link href={backHref}>
                              <ChevronLeft />
                              Վերադառնալ
                         </Link>
                    </Button>
               </div>
               <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-5 rounded-md border bg-card/60 backdrop-blur-sm p-4 shadow-sm">
                    <FieldGroup className="gap-5">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                              <Controller
                                   control={form.control}
                                   name="name_hy"
                                   disabled={isSubmitting}
                                   render={({field, fieldState})=>(
                                        <Field data-invalid={fieldState.invalid}>
                                             <FieldLabel htmlFor={field.name}>Անունը հայերեն</FieldLabel>
                                             <Input
                                                  {...field}
                                                  id={field.name}
                                                  aria-invalid={fieldState.invalid}
                                                  placeholder="Ընտանեկան բժշկություն"
                                             />
                                             {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </Field>
                                   )}
                              />
                              <Controller
                                   control={form.control}
                                   name="slug"
                                   disabled={isSubmitting}
                                   render={({field, fieldState})=>(
                                        <Field data-invalid={fieldState.invalid}>
                                             <FieldLabel htmlFor={field.name}>Հասցեի անվանում (slug)</FieldLabel>
                                             <Input
                                                  {...field}
                                                  id={field.name}
                                                  aria-invalid={fieldState.invalid}
                                                  placeholder="family-medicine"
                                                  pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                                                  autoCapitalize="none"
                                                  spellCheck={false}
                                             />
                                             {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </Field>
                                   )}
                              />
                         </div>
                         <Controller
                              control={form.control}
                              name="sort_order"
                              disabled={isSubmitting}
                              render={({ field, fieldState }) => (
                                   <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>Հերթականություն</FieldLabel>
                                        <Input
                                             {...field}
                                             id={field.name}
                                             type="number"
                                             step={1}
                                             value={Number.isNaN(field.value) ? "" : field.value}
                                             onChange={(event) => field.onChange(event.currentTarget.valueAsNumber)}
                                             aria-invalid={fieldState.invalid}
                                        />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                   </Field>
                              )}
                         />
                         <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                              <Controller
                                   control={form.control}
                                   name="sponsor_id"
                                   disabled={isSubmitting}
                                   render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                             <FieldLabel htmlFor={field.name}>Հովանավոր</FieldLabel>
                                             <Select
                                                  name={field.name}
                                                  value={field.value}
                                                  onValueChange={field.onChange}
                                             >
                                                  <SelectTrigger
                                                       ref={field.ref}
                                                       id={field.name}
                                                       onBlur={field.onBlur}
                                                       aria-invalid={fieldState.invalid}
                                                       disabled={field.disabled}
                                                       className="w-full"
                                                  >
                                                       <SelectValue />
                                                  </SelectTrigger>
                                                  <SelectContent>
                                                       <SelectItem value={NO_SPONSOR}>
                                                            Առանց հովանավորի
                                                       </SelectItem>
                                                       {sponsorOptions.map((sponsor) => (
                                                            <SelectItem key={sponsor.id} value={sponsor.id}>
                                                                 {sponsor.name}
                                                            </SelectItem>
                                                       ))}
                                                  </SelectContent>
                                             </Select>
                                             {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </Field>
                                   )}
                              />
                              <Controller
                                   control={form.control}
                                   name="sponsor_until"
                                   disabled={isSubmitting}
                                   render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                             <FieldLabel htmlFor={field.name}>
                                                  Հովանավորության ավարտը (UTC)
                                             </FieldLabel>
                                             <Input
                                                  {...field}
                                                  id={field.name}
                                                  type="datetime-local"
                                                  step="0.001"
                                                  aria-invalid={fieldState.invalid}
                                             />
                                             {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </Field>
                                   )}
                              />
                         </div>
                         <Controller
                              control={form.control}
                              name="is_published"
                              disabled={isSubmitting}
                              render={({ field, fieldState }) => (
                                   <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                                        <Switch
                                             ref={field.ref}
                                             id={field.name}
                                             name={field.name}
                                             checked={field.value}
                                             onCheckedChange={field.onChange}
                                             onBlur={field.onBlur}
                                             aria-invalid={fieldState.invalid}
                                        />
                                        <FieldLabel htmlFor={field.name}>Հրապարակել</FieldLabel>
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                   </Field>
                              )}
                         />
                    </FieldGroup>
                    <div className="flex justify-end">
                         <Button type="submit">
                              {isSubmitting ? <Spinner/> : specialty ? <Save/> : <Plus/>}
                              {isSubmitting ? "Խնդրում ենք սպասել․․․" : specialty ? "Պահպանել" : "Ստեղծել"}
                         </Button>
                    </div>
               </form>
          </div>
     );
}

