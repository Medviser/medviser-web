import * as z from "zod";

export const loginSchema = z.object({
     email: z.email("Մուտքագրեք վավեր էլ․ փոստի հասցե կամ հեռախոսահամար։").trim().max(200, "Էլ․ հասցեն 200 նիշից ավել է").transform(val=>val.toLowerCase()),
     password: z.string().min(1, "Մուտքագրեք գաղտնաբառը։").min(8,"Գաղնաբառը պետք է ունենա առնվազն 8 նիշ"),
     rememberMe: z.boolean(),
});

export const registerSchema = z.object({
     name: z.string().trim().min(2, "Անունը պետք է պարունակի առնվազն 2 նիշ։"),
     email: z.email("Մուտքագրեք վավեր էլ․ փոստ։").trim().transform(val=>val.toLowerCase()),
     password: z.string().min(8, "Գաղտնաբառը պետք է պարունակի առնվազն 8 նիշ։"),
     confirmPassword: z.string(),
     acceptTerms: z.boolean().refine(value => value, {
          message: "Պետք է ընդունեք օգտագործման պայմանները։",
     }),
}).refine(data => data.password === data.confirmPassword,{
     path: ["confirmPassword"],
     message: "Գաղտնաբառերը չեն համընկնում։",
});

export const profileSchema = z.object({
     name: z.string().trim().min(1, "Մուտքագրեք ձեր անունը։"),
});

export const passwordSchema = z.object({
     currentPassword: z.string().min(1, "Մուտքագրեք ընթացիկ գաղտնաբառը։"),
     newPassword: z.string().min(8, "Գաղտնաբառը պետք է ունենա առնվազն 8 նիշ։"),
     confirmPassword: z.string(),
}).refine(({ newPassword, confirmPassword }) => newPassword === confirmPassword, {
     path: ["confirmPassword"],
     message: "Գաղտնաբառերը չեն համընկնում։",
});

export const passwordResetRequestSchema = z.object({
     email: z.email("Մուտքագրեք վավեր էլ․ փոստ։").trim().transform(val=>val.toLowerCase()),
});

export const newPasswordSchema = z.object({
     password: z.string().min(8,"Գաղտնաբառը պետք է պարունակի առնվազն 8 նիշ։"),
     confirmPassword: z.string().min(8,"Գաղտնաբառը պետք է պարունակի առնվազն 8 նիշ։"),
}).refine(data => data.password === data.confirmPassword,{
     path: ["confirmPassword"],
     message:"Գաղտնաբառերը չեն համընկնում։",
});