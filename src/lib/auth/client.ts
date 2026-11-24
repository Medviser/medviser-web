import { createAuthClient } from "better-auth/react"
import { adminClient, jwtClient } from "better-auth/client/plugins";
import { ac, admin, contentEditor, reviewer, user } from "./permissions";
import { BASE_URL } from "../utils";

export const authClient = createAuthClient({
    baseURL: BASE_URL,
    plugins: [
        jwtClient(),
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