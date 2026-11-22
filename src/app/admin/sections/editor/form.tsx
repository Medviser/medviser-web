"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { createSection, editSection } from "@/actions/sections";
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
import type { Section, specialties as specialtiesTable } from "@/db/schema";
import { sectionSchema } from "@/lib/schemas/index";
import type { SectionFormValues } from "@/lib/types/schema";

type Props = {
  section?: Section | null;
  specialties: Pick<typeof specialtiesTable.$inferSelect, "id" | "name_hy">[];
};

export default function SectionEditorForm({ section, specialties }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<SectionFormValues>({
    resolver: zodResolver(sectionSchema),
    defaultValues: {
      name_hy: section?.name_hy ?? "",
      specialty_id: section?.specialty_id ?? "",
      sort_order: section?.sort_order ?? 0,
    },
  });

  function onSubmit(values: SectionFormValues) {
    startTransition(async () => {
      try {
        const result = section
          ? await editSection(section.id, values)
          : await createSection(values);

        if (result.error) {
          toast.error(result.error);
          return;
        }

        if (result.success) {
          toast.success("Բաժինը պահպանվեց։");
          form.reset();
          router.push("/admin/sections");
        }
      } catch {
        toast.error("Չհաջողվեց պահպանել բաժինը։ Կրկին փորձեք։");
      }
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">
          {section ? "Խմբագրել բաժինը" : "Ստեղծել բաժին"}
        </h1>
        <Button variant="outline" asChild>
          <Link href="/admin/sections">Վերադառնալ</Link>
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
                <FieldLabel htmlFor={field.name}>Բաժնի անունը</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="specialty_id"
            disabled={isPending}
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

          <Controller
            control={form.control}
            name="sort_order"
            disabled={isPending}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Հերթականություն</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  type="number"
                  step={1}
                  value={Number.isNaN(field.value) ? "" : field.value}
                  onChange={(event) =>
                    field.onChange(event.currentTarget.valueAsNumber)
                  }
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </FieldGroup>

        <div className="flex justify-end">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Պահպանվում է…" : section ? "Պահպանել" : "Ստեղծել"}
          </Button>
        </div>
      </form>
    </div>
  );
}