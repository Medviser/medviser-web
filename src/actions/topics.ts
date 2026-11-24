"use server";
import { revalidatePath } from "next/cache";
import { deleteTopic, insertTopic, updateTopic } from "@/data/topics";
import { topicSchema } from "@/lib/schemas/index";
import type { TopicFormValues } from "@/lib/types/schema";
import { getUserWithPermission } from "@/lib/auth/permissions/get-user-with-permission";

export async function createTopic(values: TopicFormValues) {
     const parsed = topicSchema.safeParse(values);
     if (!parsed.success) {
          console.error(parsed.error)
          return { error: "Ստուգեք թեմայի անունն ու մասնագիտությունը։" };
     }
     
     const user = await getUserWithPermission({
          topic: ["create"],
     });
     if (!user) return { error: "Այս գործողության համար իրավունք չունեք։"};

     try {
          await insertTopic(parsed.data);
     } catch {
          return { error: "Չհաջողվեց ստեղծել թեման։" };
     }

     revalidatePath("/admin/topics");
     revalidatePath("/admin/questions/editor");
     return { success: true };
}

export async function editTopic(id: string, values: TopicFormValues) {
     const parsed = topicSchema.safeParse(values);
     if (!parsed.success) {
          console.error(parsed.error)
          return { error: "Մուտքագրեք թեմայի անունը։" };
     }
     
     const user = await getUserWithPermission({
          topic: ["update"],
     });
     if (!user) return { error: "Այս գործողության համար իրավունք չունեք։", };

     try {
          const updated = await updateTopic(id, parsed.data.name_hy) 
          if (!updated) return { error: "Թեման չի գտնվել։" };
     } catch {
          return { error: "Չհաջողվեց պահպանել թեման։" };
     }

     revalidatePath("/admin/topics");
     revalidatePath("/admin/questions/editor");
     return { success: true };
}

export async function removeTopic(id: string) {
     const user = await getUserWithPermission({
          topic: ["delete"],
     });
     if (!user) return { error: "Այս գործողության համար իրավունք չունեք։", };
     try {
          if (!(await deleteTopic(id))) {
               return { error: "Թեման չի գտնվել։" };
          }
     } catch (error) {
          const cause = error instanceof Error ? error.cause ?? error : error;
          if (
               cause &&
               typeof cause === "object" &&
               "code" in cause &&
               cause.code === "23503"
          ) {
               return { error: "Թեման կցված է հարցերի։ Նախ հեռացրեք այդ կապերը։" };
          }
          return { error: "Չհաջողվեց ջնջել թեման։" };
     }
     revalidatePath("/admin/topics");
     revalidatePath("/admin/questions/editor");
     return { success: true };
}