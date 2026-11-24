import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../drizzle";
import { env } from "../env";
import { nextCookies } from "better-auth/next-js";
import { sendDeleteAccountEmail, sendPassResetEmail, sendVerificationMail } from "../email";
import { admin, jwt } from "better-auth/plugins";

import * as authSchema from "@/db/auth-schema";
import { contentEditor, reviewer, user, admin as adminRole, ac } from "./permissions";
import { BASE_URL } from "../utils";

export const auth = betterAuth({
     appName: "Medviser",
     database: drizzleAdapter(db, {
          provider: "pg",
          schema: authSchema
     }),
     emailAndPassword: { 
          enabled: true,
          sendResetPassword: async ({url, user}) => await sendPassResetEmail(user.email, url),
          revokeSessionsOnPasswordReset: true,
          requireEmailVerification: true
     },
     emailVerification: {
          sendVerificationEmail: async({url, user}) => await sendVerificationMail(user.email, url),
          sendOnSignUp: true,
          sendOnSignIn: true
     },
     socialProviders: { 
          github: { 
               clientId: env.GITHUB_ID, 
               clientSecret: env.GITHUB_SECRET, 
          }, 
          google: {
               clientId: env.GOOGLE_ID,
               clientSecret: env.GOOGLE_SECRET
          }
     },
     plugins: [
          admin({
               ac,
               defaultRole: "user",
               roles: {
                    user,
                    content_editor: contentEditor,
                    reviewer,
                    admin: adminRole,
               },
               adminRoles: ["admin"],
          }),
          jwt({
               jwt: {
                    issuer: BASE_URL,
                    audience: "medviser-audience",
                    expirationTime: 365 * 1000 * 60 * 60 * 24,
               },
               jwks: {
                    keyPairConfig: {
                         alg: "ES256",
                    },
               },
          }),
          nextCookies(),
     ],
     user: {
          additionalFields: {
               role: {
                    type: ["user","content_editor","reviewer","admin"],
                    required: false,
                    defaultValue: "user",
                    input: false,
               },
               specialtyId: {
                    type: "string",
                    required: false,
                    input: true
               },
               professionalStatus: {
                    type: "string",
                    required: false,
                    input: true
               },
               workplace: {
                    type: "string",
                    required: false,
                    input: true
               },
               hcpVerified: {
                    type: ["none", "self_declared", "verified"],
                    required: false,
                    defaultValue: "none",
                    input: true
               },
               organizationId: {
                    type: "string",
                    required: false,
                    input: true
               },
               consentTermsAt: {
                    type: "date",
                    required: false,
                    input: true
               },
               consentMarketing: {
                    type: "boolean",
                    defaultValue: false
               },
               registryNumber: {
                    type: "string",
                    input: true,
                    required: false,
               }
          },
          deleteUser: {
               enabled: true,
               sendDeleteAccountVerification: async({user, url}) => await sendDeleteAccountEmail(user.email,url)
          },
     },
     account: {
          accountLinking: {
               enabled: true,
               disableImplicitLinking: true,
          }
     }
});