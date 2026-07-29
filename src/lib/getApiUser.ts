import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { verifyDesktopToken } from "@/lib/desktopToken";

/**
 * Resolve user id from NextAuth session cookie OR
 * Authorization: Bearer <desktop-token>
 */
export async function getApiUserId(req: Request): Promise<string | null> {
  const session = await getServerSession(authOptions);
  if (session?.user?.id) return session.user.id;

  const auth = req.headers.get("authorization") || "";
  const m = auth.match(/^Bearer\s+(.+)$/i);
  if (!m) return null;
  return verifyDesktopToken(m[1].trim());
}
