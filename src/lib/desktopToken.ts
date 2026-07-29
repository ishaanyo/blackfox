import crypto from "crypto";

const TTL_SEC = 60 * 60 * 24 * 30; // 30 days

function secret() {
  const s = process.env.NEXTAUTH_SECRET;
  if (!s) throw new Error("NEXTAUTH_SECRET is not set");
  return s;
}

/** Create a desktop token for userId */
export function issueDesktopToken(userId: string): string {
  const exp = Math.floor(Date.now() / 1000) + TTL_SEC;
  const payload = `${userId}.${exp}`;
  const sig = crypto
    .createHmac("sha256", secret())
    .update(payload)
    .digest("base64url");
  return `${payload}.${sig}`;
}

/** Verify token → userId or null */
export function verifyDesktopToken(token: string): string | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [userId, expStr, sig] = parts;
    const exp = parseInt(expStr, 10);
    if (!userId || !exp || Number.isNaN(exp)) return null;
    if (exp < Math.floor(Date.now() / 1000)) return null;

    const payload = `${userId}.${expStr}`;
    const expected = crypto
      .createHmac("sha256", secret())
      .update(payload)
      .digest("base64url");
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
    return userId;
  } catch {
    return null;
  }
}
