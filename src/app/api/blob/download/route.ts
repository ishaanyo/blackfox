import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * Public blobs are already reachable by URL.
 * This route just redirects after a simple auth check.
 * Query: ?url=https://...
 */
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");
    if (!url) {
      return NextResponse.json({ error: "Missing url" }, { status: 400 });
    }

    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch {
      return NextResponse.json({ error: "Invalid url" }, { status: 400 });
    }
    if (
      !parsed.hostname.endsWith(".public.blob.vercel-storage.com") &&
      !parsed.hostname.endsWith(".blob.vercel-storage.com")
    ) {
      return NextResponse.json({ error: "Invalid blob host" }, { status: 400 });
    }

    return NextResponse.redirect(url, 302);
  } catch (err) {
    console.error("blob download:", err);
    return NextResponse.json({ error: "Download failed" }, { status: 500 });
  }
}