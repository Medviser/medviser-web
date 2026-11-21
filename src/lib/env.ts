import * as z from "zod"
import { createEnv } from "@t3-oss/env-nextjs";

export const env = createEnv({
     server: {
          DATABASE_URL: z.url(),
          NEON_AUTH_BASE_URL: z.url(),
          NEON_AUTH_COOKIE_SECRET: z.string()
     },
     experimental__runtimeEnv: process.env
})