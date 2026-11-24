"use server";

import { revalidatePath } from "next/cache";
import { deleteResource, insertResource, updateResource } from "@/data/resources";
import { resourceSchema } from "@/lib/schemas/index";
import type { ResourceFormValues } from "@/lib/types/schema";
import { getUserWithPermission } from "@/lib/auth/permissions/get-user-with-permission";

type ResourceResult = { success: true } | { error: string };

export async function createResource(values: ResourceFormValues): Promise<ResourceResult> {
     const parsed = resourceSchema.safeParse(values);
     if (!parsed.success) {
          console.error(parsed.error);
          return { error: "Ստուգեք լրացված դաշտերը։" }
     };

     const user = await getUserWithPermission({
          resource: ["create"],
     });
     if (!user) return { error: "Այս գործողության համար իրավունք չունեք։"};

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

     const user = await getUserWithPermission({
          resource: ["update"],
     });
     if (!user) return { error: "Այս գործողության համար իրավունք չունեք։"};

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

     const user = await getUserWithPermission({
          resource: ["delete"],
     });
     if (!user) return { error: "Այս գործողության համար իրավունք չունեք։"};

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