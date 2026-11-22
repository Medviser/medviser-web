import * as z from "zod"
import { createEnv } from "@t3-oss/env-nextjs";

export const env = createEnv({
     server: {
          DATABASE_URL: z.url().min(1,"Database URL is Required for updating and fetching data"),
          BETTER_AUTH_SECRET: z.string().min(1,"BetterAuth Secret is required to make authentication work"),
          BETTER_AUTH_URL: z.url().min(1,"BetterAuthURL is required to make authentication work"),
          GITHUB_ID: z.string().min(1,"GitHub Client ID is required to sign in with GitHub"),
          GITHUB_SECRET: z.string().min(1,"GitHub Client secret is required to sign in with GitHub"),
          GOOGLE_ID: z.string().min(1,"Google Client ID is required to sign in with Google"),
          GOOGLE_SECRET: z.string().min(1,"Google Client secret is required to sign in with Google"),
          RESEND_API: z.string().min(1,"Resend API Key is Required to send emails"),
          RESEND_ONBOARDING: z.email("Onboarding email should be valid").min(1,"Onboarding email is required")
     },
     experimental__runtimeEnv: process.env
})