// src/actions/resources.ts
"use server";

import { revalidatePath } from "next/cache";
import { deleteResource, insertResource, updateResource } from "@/data/resources";
import { resourceSchema } from "@/lib/schemas/index";
import type { ResourceFormValues } from "@/lib/types/schema";
import { getAdminUser } from "@/lib/auth/admin";

type ResourceResult = { success: true } | { error: string };

export async function createResource(values: ResourceFormValues): Promise<ResourceResult> {
     const parsed = resourceSchema.safeParse(values);
     if (!parsed.success) {
          console.error(parsed.error);
          return { error: "Ստուգեք լրացված դաշտերը։" }
     };

     const adminUser = await getAdminUser();
     if(!adminUser) return {error: "Կողմնակի անձանց մուտքն արգելված է"}

     try {
          await insertResource(parsed.data);
     } catch {
          return { error: "Չհաջողվեց ստեղծել ռեսուրսը։" };
     }

     revalidatePath("/admin/resources");
     return { success: true };
}

export async function editResource(id: string, values: ResourceFormValues): Promise<ResourceResult> {
     if (typeof id !== "string" || !id.trim()) {
          return { error: "Ռեսուրսի ID-ն պարտադիր է։" };
     }

     const parsed = resourceSchema.safeParse(values);
     if (!parsed.success) {
          console.error(parsed.error);
          return { error: "Ստուգեք լրացված դաշտերը։" }
     };

     const adminUser = await getAdminUser();
     if(!adminUser) return {error: "Կողմնակի անձանց մուտքն արգելված է"}

     try {
          if (!(await updateResource(id, parsed.data))) {
               return { error: "Ռեսուրսը չի գտնվել։" };
          }
     } catch {
          return { error: "Չհաջողվեց պահպանել ռեսուրսը։" };
     }

     revalidatePath("/admin/resources");
     return { success: true };
}

export async function removeResource(id: string): Promise<ResourceResult> {
     if (typeof id !== "string" || !id.trim()) {
          return { error: "Ռեսուրսի ID-ն պարտադիր է։" };
     }

     const adminUser = await getAdminUser();
     if(!adminUser) return {error: "Կողմնակի անձանց մուտքն արգելված է"}

     try {
          if (!(await deleteResource(id))) {
               return { error: "Ռեսուրսը չի գտնվել։" };
          }
     } catch {
          return { error: "Չհաջողվեց ջնջել ռեսուրսը։" };
     }

     revalidatePath("/admin/resources");
     return { success: true };
}