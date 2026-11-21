"use server"
import { deleteQuestion, insertQuestion, updateQuestion } from "@/data/question";
import { getAdminUser } from "@/lib/auth/admin";
import { questionSchema } from "@/lib/schemas";
import type { QuestionFormValues } from "@/lib/types/schema";
import { revalidatePath } from "next/cache";

export async function createQuestion(values: QuestionFormValues){
     const validated = questionSchema.safeParse(values);
     if (!validated.success) {
          console.error(validated.error);
          return { error: "Ստուգեք լրացված դաշտերը։" }
     };
     const adminUser = await getAdminUser();
     if (!adminUser) {
          return { error: "Այս գործողության համար իրավունք չունեք։" };
     }
     try {
          await insertQuestion(validated.data);
     } catch {
          return { error: "Չհաջողվեց պահպանել հարցը։ Կրկին փորձեք։" };
     }
     revalidatePath("/questions");
     return { success: true };
}
export async function editQuestion(id: string, values: QuestionFormValues) {
     if (typeof id !== "string" || !id.trim()) {
          return { error: "Հարցի ID-ն պարտադիր է։" };
     }

     const parsed = questionSchema.safeParse(values);
     if (!parsed.success) {
          console.error(parsed.error);
          return { error: "Ստուգեք լրացված դաշտերը։" }
     };

     const adminUser = await getAdminUser();
     if(!adminUser) return {error: "Կողմնակի անձանց մուտքն արգելված է"}

     try {
          await updateQuestion(id, parsed.data);
     } catch {
          return { error: "Չհաջողվեց պահպանել հարցը։" };
     }

     revalidatePath("/questions");
     return { success: true };
}

export async function removeQuestion(id: string) {
     if (typeof id !== "string" || !id.trim()) {
          return { error: "Հարցի ID-ն պարտադիր է։" };
     }

     const adminUser = await getAdminUser();
     if(!adminUser) return {error: "Կողմնակի անձանց մուտքն արգելված է"}

     try {
          if (!(await deleteQuestion(id))) {
               return { error: "Հարցը չի գտնվել։" };
          }
     } catch {
          return { error: "Չհաջողվեց ջնջել հարցը։ Հնարավոր է՝ այն արդեն օգտագործվում է։" };
     }

     revalidatePath("/questions");
     return { success: true };
}