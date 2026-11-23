import "server-only";
import { getCurrentUser } from "./get-current-user";

export async function getAdminUser() {
  const user = await getCurrentUser();

  if (!user?.emailVerified) {
    return null;
  }

  const roles =
    typeof user.role === "string"
      ? user.role.split(",").map((role) => role.trim())
      : [];

  if (!roles.includes("admin")) {
    return null;
  }

  return user;
}