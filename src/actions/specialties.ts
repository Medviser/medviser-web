"use server"
import { deleteSpecialty, insertSpecialty, updateSpecialty } from "@/data/specialties";
import { getUserWithPermission } from "@/lib/auth/permissions/get-user-with-permission";
import { specialtyDataSchema } from "@/lib/schemas/index";
import type { SpecialtyFormData } from "@/lib/types/schema";
import { revalidatePath } from "next/cache";

export async function createSpecialty(values: SpecialtyFormData){
     const validated = specialtyDataSchema.safeParse(values);
     if (!validated.success) {
          console.error(validated.error);
          return { error: "Ստուգեք լրացված դաշտերը։" }
     };

     const user = await getUserWithPermission({
          specialty: ["create"]
     });
     if (!user) return { error: "Այս գործողության համար իրավունք չունեք։"};

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
     
     const user = await getUserWithPermission({
          specialty: ["update"]
     });
     if (!user) return { error: "Այս գործողության համար իրավունք չունեք։"};

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

     const user = await getUserWithPermission({
          specialty: ["delete"]
     });
     if (!user) return { error: "Այս գործողության համար իրավունք չունեք։"};

     try {
          const deletedId = await deleteSpecialty(id.trim());
          if (deletedId === null) return { error: "Մասնագիտությունը չի գտնվել։" };
     } catch {
          return { error: "Չհաջողվեց ջնջել մասնագիտությունը։ Կրկին փորձեք։" };
     }
     revalidatePath("/admin/specialties");
     return { success: true };
}