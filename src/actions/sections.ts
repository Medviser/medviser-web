"use server";
import { revalidatePath } from "next/cache";
import { deleteSection, insertSection, updateSection } from "@/data/sections";
import { sectionSchema } from "@/lib/schemas/index";
import type { SectionFormValues } from "@/lib/types/schema";
import { getUserWithPermission } from "@/lib/auth/permissions/get-user-with-permission";

async function saveSection(values: SectionFormValues, id?: string): Promise<{
     error?: string,
     success?: boolean
}> {
     const parsed = sectionSchema.safeParse(values);
     if (!parsed.success) {
          console.error(parsed.error);
          return { error: "Ստուգեք լրացված դաշտերը։" }
     };

     const user = await getUserWithPermission({
          section: [id === undefined ? "create" : "update",],
     });
     if (!user) return { error: "Այս գործողության համար իրավունք չունեք։",};

     try {
          if (id === undefined) {
               await insertSection(parsed.data);
          } else if (!(await updateSection(id, parsed.data))) {
               return { error: "Բաժինը չի գտնվել։" };
          }
     } catch {
          return { error: "Չհաջողվեց պահպանել բաժինը։" };
     }

     revalidatePath("/admin/sections");
     return { success: true };
}

export async function createSection(values: SectionFormValues) {
     return saveSection(values);
}

export async function editSection(id: string, values: SectionFormValues) {
     if (typeof id !== "string" || !id.trim()) return { error: "Բաժնի ID-ն պարտադիր է։" };
     return saveSection(values, id);
}

export async function removeSection(id: string) {
     if (typeof id !== "string" || !id.trim()) return { error: "Բաժնի ID-ն պարտադիր է։" };

     const user = await getUserWithPermission({
          section: ["delete"],
     });
     if (!user) return { error: "Այս գործողության համար իրավունք չունեք։",};

     try {
          if (!(await deleteSection(id))) return { error: "Բաժինը չի գտնվել։" };
     } catch {
          return { error: "Չհաջողվեց ջնջել բաժինը։ Հնարավոր է՝ այն հարցեր ունի։" };
     }

     revalidatePath("/admin/sections");
     return { success: true };
}