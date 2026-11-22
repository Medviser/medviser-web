import * as z from "zod";

export const NO_SPONSOR = "none";

const sponsorUntilSchema = z.string({ error: "Մուտքագրեք վավերական ամսաթիվ և ժամ։" }).trim().refine((value) =>value === "" || z.iso.datetime({ local: true }).safeParse(value).success, {
     error: "Մուտքագրեք վավերական ամսաթիվ և ժամ։"
}).transform((value) => {
     if (value === "") return null;
     return new Date(value.endsWith("Z") ? value : `${value}Z`);
});

export const loginSchema = z.object({
     email: z.email("Մուտքագրեք վավեր էլ․ փոստի հասցե կամ հեռախոսահամար։").trim().max(200, "Էլ․ հասցեն 200 նիշից ավել է").transform(val=>val.toLowerCase()),
     password: z.string().min(1, "Մուտքագրեք գաղտնաբառը։").min(8,"Գաղնաբառը պետք է ունենա առնվազն 8 նիշ"),
     rememberMe: z.boolean(),
});

export const specialtyFields = z.object({
     name_hy: z.string({ error: "Մուտքագրեք մասնագիտության անունը։" }).trim().min(1, "Մուտքագրեք մասնագիտության անունը։"),
     slug: z.string({ error: "Մուտքագրեք հասցեի անվանումը։" }).trim().min(1, "Մուտքագրեք հասցեի անվանումը։").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/,"Օգտագործեք փոքրատառ լատինատառեր, թվեր և դրանց միջև գծիկներ։",),
     sort_order: z.number({ error: "Մուտքագրեք հերթականության համարը։" }).int("Հերթականության համարը պետք է ամբողջ թիվ լինի։").min(-2147483648, "Հերթականության համարը թույլատրելի միջակայքից դուրս է։").max(2147483647, "Հերթականության համարը թույլատրելի միջակայքից դուրս է։"),
     sponsor_id: z.string({ error: "Ընտրեք հովանավոր։" }).trim().transform((value) => value === NO_SPONSOR || value === "" ? null : value),
     sponsor_until: sponsorUntilSchema,
     is_published: z.boolean({
          error: "Նշեք հրապարակման կարգավիճակը։",
     }),
})
.refine(
     ({ sponsor_id, sponsor_until }) =>sponsor_until === null || sponsor_id !== null,{
          path: ["sponsor_until"],
          error: "Ժամկետ սահմանելու համար նախ ընտրեք հովանավոր։",
     },
);

const hasSponsorForExpiry = ({sponsor_id,sponsor_until,}: {
     sponsor_id: string | null;
     sponsor_until: Date | null;
}) => sponsor_until === null || sponsor_id !== null;

const sponsorExpiryError = {
     path: ["sponsor_until"],
     error: "Ժամկետ սահմանելու համար նախ ընտրեք հովանավոր։",
};

export const specialtySchema = specialtyFields.refine(
     hasSponsorForExpiry,
     sponsorExpiryError,
);
export const specialtyDataSchema = z.object({
     ...specialtyFields.shape,
     sponsor_id: z.string({ error: "Ընտրեք հովանավոր։" }).trim().min(1, "Ընտրեք հովանավոր։").refine((value) => value !== NO_SPONSOR, "Ընտրեք հովանավոր։").nullable(),
     sponsor_until: z.date({ error: "Մուտքագրեք վավերական ամսաթիվ և ժամ։" }).nullable(),
}).refine(hasSponsorForExpiry, sponsorExpiryError);

export const questionSchema = z.object({
     specialty_id: z.string().min(1, "Ընտրեք մասնագիտությունը։"),
     section_id: z.string().min(1, "Ընտրեք բաժինը։"),
     topic_ids: z.array(z.string().min(1)),
     number: z.number({ error: "Մուտքագրեք հարցի համարը։" }).int("Համարը պետք է ամբողջ թիվ լինի։").min(1, "Համարը պետք է լինի առնվազն 1։").max(2147483647, "Համարը թույլատրելի միջակայքից դուրս է։"),
     stem: z.string().trim().min(1, "Մուտքագրեք հարցի տեքստը։"),
     options: z.array(
          z.object({
               id: z.string().min(1),
               text: z.string().trim().min(1, "Լրացրեք տարբերակը։"),
          })
     ).length(4, "Հարցը պետք է ունենա չորս տարբերակ։"),
     correct_option_id: z.string().min(1, "Նշեք ճիշտ պատասխանը։"),
     explanation: z.string().trim().min(1, "Գրեք պատասխանի հիմնավորումը։"),
     note: z.string().trim(),
     sources: z.array(
          z.object({
               title: z.string().trim().min(1, "Նշեք աղբյուրի անունը։"),
               url: z.url({
                    protocol: /^https?$/,
                    error: "Մուտքագրեք վավեր HTTP կամ HTTPS հղում։",
               }),
          }),
     ),
     shuffle: z.boolean(),
})
.refine(({ options, correct_option_id }) => correct_option_id === "" || options.some(({ id }) => id === correct_option_id),{
     path: ["correct_option_id"],
     error: "Ընտրեք նշված տարբերակներից մեկը։",
});

export const resourceSchema = z.object({
     title: z.string().trim().min(1, "Մուտքագրեք ռեսուրսի վերնագիրը։"),
     url: z.string().trim().pipe(
          z.url({
               protocol: /^https?$/,
               error: "Մուտքագրեք վավեր HTTP կամ HTTPS հղում։",
          }),
     ),
     description: z.string().trim(),
     is_published: z.boolean(),
});

export const sectionSchema = z.object({
     name_hy: z.string().trim().min(1, "Մուտքագրեք բաժնի անունը։"),
     specialty_id: z.string().trim().min(1, "Ընտրեք մասնագիտությունը։"),
     sort_order: z.int32({ error: "Մուտքագրեք թույլատրելի միջակայքում գտնվող ամբողջ թիվ։" }),
});

export const topicSchema = z.object({
     name_hy: z.string().trim().min(1, "Մուտքագրեք թեմայի անունը։"),
     specialty_id: z.string().trim().min(1, "Ընտրեք մասնագիտությունը։"),
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