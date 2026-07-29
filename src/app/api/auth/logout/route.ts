import { NextResponse } from "next/server";

/** Optional explicit logout endpoint — client should prefer signOut() from next-auth/react */
export async function POST() {
  const res = NextResponse.json({ ok: true });
  // Clear common next-auth cookies
  const cookieNames = [
    "next-auth.session-token",
    "__Secure-next-auth.session-token",
    "next-auth.csrf-token",
    "__Host-next-auth.csrf-token",
    "next-auth.callback-url",
    "__Secure-next-auth.callback-url",
  ];
  for (const name of cookieNames) {
    res.cookies.set(name, "", { maxAge: 0, path: "/" });
  }
  return res;
}
