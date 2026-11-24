import "server-only";

import { auth } from "@/lib/auth";
import { getCurrentUser } from "../get-current-user";

type UserHasPermissionParams = NonNullable<Parameters<typeof auth.api.userHasPermission>[0]>;

export async function hasUserPermission(
  permissions: UserHasPermissionParams["body"]["permissions"],
) {
  const user = await getCurrentUser();

  if (!user?.emailVerified) {
    return false;
  }

  const result = await auth.api.userHasPermission({
    body: {
      userId: user.id,
      permissions,
    },
  });

  return Boolean(result?.success);
}