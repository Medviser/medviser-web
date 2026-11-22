"use server"
import { deleteSpecialty, insertSpecialty, updateSpecialty } from "@/data/specialties";
import { getAdminUser } from "@/lib/auth/admin";
import { specialtyDataSchema } from "@/lib/schemas/index";
import type { SpecialtyFormData } from "@/lib/types/schema";
import { revalidatePath } from "next/cache";

export async function createSpecialty(values: SpecialtyFormData){
     const validated = specialtyDataSchema.safeParse(values);
     if (!validated.success) {
          console.error(validated.error);
          return { error: "Ստուգեք լրացված դաշտերը։" }
     };

     const adminUser = await getAdminUser();
     if(!adminUser) return {error: "Կողմնակի անձանց մուտքն արգելված է"}

     try {
          await insertSpecialty(validated.data);
     } catch {
          return { error: "Չհաջողվեց պահպանել մասնագիտությունը։ Կրկին փորձեք։" };
     }

     revalidatePath("/admin/specialties");
     return { success: true };
}
export async function editSpecialty(id: string, values: SpecialtyFormData){
     if (typeof id !== "string" || !id.trim()) {
          return { error: "ID-ն պարտադիր է։" };
     }
     const validated = specialtyDataSchema.safeParse(values);
     if (!validated.success) {
          console.error(validated.error);
          return { error: "Ստուգեք լրացված դաշտերը։" }
     };
     
     const adminUser = await getAdminUser();
     if(!adminUser) return {error: "Կողմնակի անձանց մուտքն արգելված է"}

     try {
          await updateSpecialty(id, validated.data);
     } catch {
          return { error: "Չհաջողվեց պահպանել մասնագիտությունը։ Կրկին փորձեք։" };
     }

     revalidatePath("/admin/specialties");
     return { success: true };
}
export async function removeSpecialty(id: string) {
     if (typeof id !== "string" || !id.trim()) {
          return { error: "ID-ն պարտադիր է։" };
     }

     const adminUser = await getAdminUser();
     if(!adminUser) return {error: "Կողմնակի անձանց մուտքն արգելված է"}

     try {
          const deletedId = await deleteSpecialty(id.trim());
          if (deletedId === null) return { error: "Մասնագիտությունը չի գտնվել։" };
     } catch {
          return { error: "Չհաջողվեց ջնջել մասնագիտությունը։ Կրկին փորձեք։" };
     }
     revalidatePath("/admin/specialties");
     return { success: true };
}