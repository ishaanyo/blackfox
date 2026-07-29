import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    hasNextAuthSecret: Boolean(process.env.NEXTAUTH_SECRET),
    hasDatabaseUrl: Boolean(process.env.DATABASE_URL),
    hasGoogle: Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
    nextAuthUrl: process.env.NEXTAUTH_URL || null,
  });
}
