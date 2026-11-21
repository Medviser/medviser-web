"use server";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/server";
import { loginSchema } from "@/lib/schemas";
import type { LoginFormValues } from "@/lib/types/schema";

export async function loginAdmin(values: LoginFormValues) {
     const validated = loginSchema.safeParse(values);
     if (!validated.success) {
          console.error(validated.error);
          return { error: "Ստուգեք լրացված դաշտերը։" }
     };
     const {password, email} = validated.data
     const { error } = await auth.signIn.email({
          email: email.trim(),
          password,
     });

     if (error) {
          return { error: error.message || "Չհաջողվեց մուտք գործել։ Ստուգեք մուտքի տվյալները։" };
     }

     redirect("/");
}