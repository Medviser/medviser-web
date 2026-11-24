import "server-only";

import { auth } from "@/lib/auth";
import { getCurrentUser } from "../get-current-user";

// Extract the full argument object type
type UserHasPermissionParams = NonNullable<Parameters<typeof auth.api.userHasPermission>[0]>;

export async function getUserWithPermission(
  permissions: UserHasPermissionParams["body"]["permissions"],
) {
  const user = await getCurrentUser();

  if (!user?.emailVerified) {
    return null;
  }

  const result = await auth.api.userHasPermission({
    body: {
      userId: user.id,
      permissions: {
        ...permissions
      },
    },
  });

  if (!result?.success) {
    return null;
  }

  return user;
}