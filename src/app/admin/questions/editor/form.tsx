"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, Plus, Save } from "lucide-react";
import Link from "next/link";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea";
import { questionSchema } from "@/lib/schemas/index";
import type { QuestionFormValues } from "@/lib/types/schema";
import { useTransition } from "react";
import { createQuestion, editQuestion } from "@/actions/questions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";

type NamedOption = { id: string; name_hy: string };
type SpecialtyOption = NamedOption & { specialty_id: string };

type QuestionsEditorFormProps = {
     specialties: NamedOption[];
     sections: SpecialtyOption[];
     topics: SpecialtyOption[];
     initialValues?: QuestionFormValues;
     questionId?: string
};

const letters = ["Ա", "Բ", "Գ", "Դ"];

export default function QuestionsEditorForm({
     specialties,
     sections,
     topics,
     initialValues,
     questionId
}: QuestionsEditorFormProps) {
     const router = useRouter();
     const [isSubmitting, startTransition] = useTransition();
     const form = useForm<QuestionFormValues>({
          resolver: zodResolver(questionSchema),
          defaultValues: initialValues ?? {
               specialty_id: "",
               section_id: "",
               topic_ids: [],
               number: 1,
               stem: "",
               options: letters.map((_, index) => ({ id: `o${index + 1}`, text: "" })),
               correct_option_id: "",
               explanation: "",
               note: "",
               sources: [],
               shuffle: true,
          },
     });
     const { fields: sources, append, remove } = useFieldArray({
          control: form.control,
          name: "sources",
     });
     const [specialtyId, options] = useWatch({
          control: form.control,
          name: ["specialty_id", "options"],
     });
     const { errors } = form.formState;
     const visibleSections = sections.filter((item) => item.specialty_id === specialtyId);
     const visibleTopics = topics.filter((item) => item.specialty_id === specialtyId);

     const onSubmit = (values: QuestionFormValues) => {
          startTransition(async() => {
               const res = questionId ? await editQuestion(questionId, values) : await createQuestion(values);
               if(res.error) {
                    toast.error(res.error);
                    return;
               }
               if(res.success) {
                    form.reset();
                    router.push("/admin/questions")
               }
          })
     }
     return (
          <div className="space-y-4">
               <div className="flex flex-wrap items-center justify-between gap-3">
                    <h1 className="text-xl font-semibold md:text-2xl lg:text-3xl">
                         {initialValues ? "Խմբագրել հարցը" : "Ստեղծել հարց"}
                    </h1>
                    <Button variant="outline" asChild>
                         <Link href="/admin/questions">
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
                         <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                              <Controller
                                   control={form.control}
                                   name="specialty_id"
                                   disabled={isSubmitting}
                                   render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                             <FieldLabel htmlFor={field.name}>Մասնագիտություն</FieldLabel>
                                             <Select
                                                  value={field.value}
                                                  onValueChange={(value) => {
                                                       if (value === field.value) return;
                                                       field.onChange(value);
                                                       form.setValue("section_id", "", { shouldDirty: true });
                                                       form.setValue("topic_ids", [], { shouldDirty: true });
                                                  }}
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
                                                       {specialties.map((item) => (
                                                            <SelectItem key={item.id} value={item.id}>
                                                                 {item.name_hy}
                                                            </SelectItem>
                                                       ))}
                                                  </SelectContent>
                                             </Select>
                                             {fieldState.error && <FieldError errors={[fieldState.error]} />}
                                        </Field>
                                   )}
                              />
                              <Controller
                                   control={form.control}
                                   name="section_id"
                                   disabled={isSubmitting || !specialtyId}
                                   render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                             <FieldLabel htmlFor={field.name}>Բաժին</FieldLabel>
                                             <Select
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
                                                       <SelectValue placeholder="Ընտրեք բաժինը" />
                                                  </SelectTrigger>
                                                  <SelectContent>
                                                       {visibleSections.map((item) => (
                                                            <SelectItem key={item.id} value={item.id}>
                                                                 {item.name_hy}
                                                            </SelectItem>
                                                       ))}
                                                  </SelectContent>
                                             </Select>
                                             {fieldState.error && <FieldError errors={[fieldState.error]} />}
                                        </Field>
                                   )}
                              />
                              <Controller
                                   control={form.control}
                                   name="number"
                                   disabled={isSubmitting}
                                   render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                             <FieldLabel htmlFor={field.name}>Հարցի համարը</FieldLabel>
                                             <Input
                                                  {...field}
                                                  id={field.name}
                                                  type="number"
                                                  min={1}
                                                  step={1}
                                                  value={Number.isNaN(field.value) ? "" : field.value}
                                                  onChange={(event) => field.onChange(event.currentTarget.valueAsNumber)}
                                                  aria-invalid={fieldState.invalid}
                                             />
                                             {fieldState.error && <FieldError errors={[fieldState.error]} />}
                                        </Field>
                                   )}
                              />
                         </div>
                         {visibleTopics.length > 0 && (
                              <Controller
                                   control={form.control}
                                   name="topic_ids"
                                   disabled={isSubmitting}
                                   render={({ field }) => (
                                        <fieldset className="space-y-2">
                                             <legend className="text-sm font-medium">Թեմաներ</legend>
                                             <div className="flex flex-wrap gap-4">
                                                  {visibleTopics.map((topic) => (
                                                       <label key={topic.id} className="flex items-center gap-2 text-sm">
                                                            <input
                                                                 type="checkbox"
                                                                 checked={field.value.includes(topic.id)}
                                                                 onBlur={field.onBlur}
                                                                 onChange={(event) =>
                                                                      field.onChange(
                                                                           event.currentTarget.checked
                                                                                ? [...field.value, topic.id]
                                                                                : field.value.filter((id) => id !== topic.id),
                                                                      )
                                                                 }
                                                            />
                                                            {topic.name_hy}
                                                       </label>
                                                  ))}
                                             </div>
                                        </fieldset>
                                   )}
                              />
                         )}

                         <Controller
                              control={form.control}
                              name="stem"
                              disabled={isSubmitting}
                              render={({ field, fieldState }) => (
                                   <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>Հարցի տեքստը</FieldLabel>
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
                              name="correct_option_id"
                              disabled={isSubmitting}
                              render={({ field: correct, fieldState: correctState }) => (
                                   <fieldset className="space-y-3">
                                        <legend className="text-sm font-medium">
                                             Պատասխանների տարբերակներ և ճիշտ պատասխան
                                        </legend>
                                        {options.map((option, index) => (
                                             <Controller
                                                  key={option.id}
                                                  control={form.control}
                                                  disabled={isSubmitting}
                                                  name={`options.${index}.text`}
                                                  render={({ field, fieldState }) => (
                                                       <Field data-invalid={fieldState.invalid}>
                                                            <div className="flex items-center gap-3">
                                                                 <input
                                                                      ref={index === 0 ? correct.ref : undefined}
                                                                      type="radio"
                                                                      name={correct.name}
                                                                      value={option.id}
                                                                      checked={correct.value === option.id}
                                                                      onChange={() => correct.onChange(option.id)}
                                                                      onBlur={correct.onBlur}
                                                                      aria-invalid={correctState.invalid}
                                                                      aria-label={`${letters[index]} տարբերակը ճիշտ է`}
                                                                 />
                                                                 <FieldLabel htmlFor={`option-${option.id}`}>{letters[index]}</FieldLabel>
                                                                 <Input
                                                                      {...field}
                                                                      id={`option-${option.id}`}
                                                                      aria-invalid={fieldState.invalid}
                                                                 />
                                                            </div>
                                                            {fieldState.error && <FieldError errors={[fieldState.error]} />}
                                                       </Field>
                                                  )}
                                             />
                                        ))}
                                        {correctState.error && <FieldError errors={[correctState.error]} />}
                                   </fieldset>
                              )}
                         />
                         <Controller
                              control={form.control}
                              name="explanation"
                              disabled={isSubmitting}
                              render={({ field, fieldState }) => (
                                   <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>Հիմնավորում</FieldLabel>
                                        <Textarea
                                             {...field}
                                             id={field.name}
                                             rows={4}
                                             aria-invalid={fieldState.invalid}
                                        />
                                        {fieldState.error && <FieldError errors={[fieldState.error]} />}
                                   </Field>
                              )}
                         />
                         <Controller
                              control={form.control}
                              name="note"
                              disabled={isSubmitting}
                              render={({ field, fieldState }) => (
                                   <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>Նշում</FieldLabel>
                                        <Textarea
                                             {...field}
                                             id={field.name}
                                             rows={2}
                                             aria-invalid={fieldState.invalid}
                                        />
                                        {fieldState.error && <FieldError errors={[fieldState.error]} />}
                                   </Field>
                              )}
                         />
                         <fieldset className="space-y-3">
                              <legend className="text-sm font-medium">Աղբյուրներ</legend>
                              {sources.map((source, index) => (
                                   <div key={source.id} className="grid items-start gap-3 md:grid-cols-[1fr_1fr_auto]">
                                        <Controller
                                             control={form.control}
                                             disabled={isSubmitting}
                                             name={`sources.${index}.title`}
                                             render={({ field, fieldState }) => (
                                                  <Field data-invalid={fieldState.invalid}>
                                                       <FieldLabel htmlFor={`source-${source.id}-title`}>Անուն</FieldLabel>
                                                       <Input
                                                            {...field}
                                                            id={`source-${source.id}-title`}
                                                            aria-invalid={fieldState.invalid}
                                                       />
                                                       {fieldState.error && <FieldError errors={[fieldState.error]} />}
                                                  </Field>
                                             )}
                                        />
                                        <Controller
                                             control={form.control}
                                             name={`sources.${index}.url`}
                                             disabled={isSubmitting}
                                             render={({ field, fieldState }) => (
                                                  <Field data-invalid={fieldState.invalid}>
                                                       <FieldLabel htmlFor={`source-${source.id}-url`}>Հղում</FieldLabel>
                                                       <Input
                                                            {...field}
                                                            id={`source-${source.id}-url`}
                                                            type="url"
                                                            aria-invalid={fieldState.invalid}
                                                       />
                                                       {fieldState.error && <FieldError errors={[fieldState.error]} />}
                                                  </Field>
                                             )}
                                        />
                                        <Button type="button" variant="outline" onClick={() => remove(index)}>
                                             Հեռացնել
                                        </Button>
                                   </div>
                              ))}
                              <Button
                                   type="button"
                                   variant="outline"
                                   onClick={() => append({ title: "", url: "" })}
                              >
                                   Ավելացնել աղբյուր
                              </Button>
                         </fieldset>
                         <Controller
                              control={form.control}
                              name="shuffle"
                              disabled={isSubmitting}
                              render={({ field }) => (
                                   <Field orientation="horizontal">
                                        <Switch
                                             id={field.name}
                                             checked={field.value}
                                             onCheckedChange={field.onChange}
                                             onBlur={field.onBlur}
                                             ref={field.ref}
                                        />
                                        <FieldLabel htmlFor={field.name}>Խառնել տարբերակները</FieldLabel>
                                   </Field>
                              )}
                         />
                    </FieldGroup>
                    {errors.root?.save && <FieldError errors={[errors.root.save]} />}
                    <div className="flex justify-end">
                         <Button type="submit" disabled={isSubmitting}>
                              {isSubmitting ? <Spinner/> : initialValues ? <Save/> : <Plus/>}
                              {isSubmitting ? "Խնդրում ենք սպասել․․․" : initialValues ? "Պահպանել" : "Ստեղծել"}
                         </Button>
                    </div>
               </form>
          </div>
     );
}