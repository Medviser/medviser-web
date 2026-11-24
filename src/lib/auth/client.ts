import { createAuthClient } from "better-auth/react"
import { adminClient } from "better-auth/client/plugins";
import { ac, admin, contentEditor, reviewer, user } from "./permissions";

export const authClient = createAuthClient({
    baseURL: process.env.NODE_ENV==="production" ? "https://medviser.vercel.app" : "http://localhost:3000",
    plugins: [
        adminClient({
            ac,
            roles: {
                user,
                content_editor: contentEditor,
                reviewer,
                admin
            }
        }),
    ],
})