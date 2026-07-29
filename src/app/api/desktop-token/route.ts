import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { issueDesktopToken } from "@/lib/desktopToken";

/** Issue a desktop token for the currently logged-in web user */
export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = issueDesktopToken(session.user.id);
    return NextResponse.json({
      token,
      userId: session.user.id,
      email: session.user.email,
    });
  } catch (err) {
    console.error("POST /api/desktop-token:", err);
    return NextResponse.json(
      { error: "Failed to issue token" },
      { status: 500 }
    );
  }
}
