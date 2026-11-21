// src/proxy.ts (or middleware.ts in Next.js 15 and earlier)
import { auth } from "@/lib/auth/server";
import type { NextRequest } from "next/server";

const authMiddleware = auth.middleware({
  loginUrl: "/auth/",
});

export default function proxy(request: NextRequest) {
  // Skip auth middleware on Server Actions so they don't get treated as signed-out
  if (request.headers.has("Next-Action")) {
    return;
  }
  return authMiddleware(request);
}

export const config = {
  matcher: [
    "/((?!auth(?:/|$)|api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
