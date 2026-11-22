import "server-only";
import { getCurrentUser } from "./get-current-user";

export async function getAdminUser() {
     const user = await getCurrentUser()

     if (!user?.emailVerified) return null;
     if (!("role" in user) || user.role !== "admin") return null;

     return user;
}