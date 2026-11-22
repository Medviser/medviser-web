import { Resend } from "resend";
import { env } from "./env";

export const resend = new Resend(env.RESEND_API);

export const sendVerificationMail = async (email: string, url: string) => {
     await resend.emails.send({
          from: `MedViser <${env.RESEND_ONBOARDING}>`,
          to: email,
          subject: "MedViser — Էլ․ հասցեի հաստատում",
          html: `
               <p>Էլ․ հասցեն հաստատելու համար սեղմեք հղմանը.</p>
               <p><a href="${url}">Հաստատել էլ․ հասցեն</a></p>
          `,
     })
};
export const sendPassResetEmail = async (email: string, url: string) => {
     await resend.emails.send({
          from: `MedViser <${env.RESEND_ONBOARDING}>`,
          to: email,
          subject: "MedViser — Գաղտնաբառի վերականգնում",
          html: `
               <p>Գաղտնաբառը փոխելու համար սեղմեք հղմանը.</p>
               <p><a href="${url}">Փոխել գաղտնաբառը</a></p>
          `,
     });
}
export const sendDeleteAccountEmail = async (email: string, url: string) => {
     await resend.emails.send({
          from: `MedViser <${env.RESEND_ONBOARDING}>`,
          to: email,
          subject: "MedViser — Հաշվի ջնջում",
          html: `
               <p>Հաշիվը ջնջելու համար սեղմեք հղմանը.</p>
               <p><a href="${url}">Հաստատել ջնջումը</a></p>
          `,
     });
}