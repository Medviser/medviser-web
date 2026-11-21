import "server-only";
import { headers } from "next/headers";

export async function getAdminUser() {
     const reqHeaders = await headers();
     const host = reqHeaders.get("host");
     const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

     const res = await fetch(`${protocol}://${host}/api/auth/get-session`, {
          headers: {
               cookie: reqHeaders.get("cookie") ?? "",
          },
          cache: "no-store",
     });

     if (!res.ok) return null;

     const session = await res.json();
     const user = session?.user;

     if (!user?.emailVerified) return null;
     if (!("role" in user) || user.role !== "admin") return null;

     return user;
}