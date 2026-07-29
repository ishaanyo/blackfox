import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SessionStatus, SessionType } from "@prisma/client";
import { getApiUserId } from "@/lib/getApiUser";

export async function GET(req: Request) {
  try {
    const userId = await getApiUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const callSessions = await prisma.callSession.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ sessions: callSessions });
  } catch (err) {
    console.error("GET /api/sessions:", err);
    return NextResponse.json(
      { error: "Failed to load sessions" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const userId = await getApiUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      type = "INTERVIEW",
      company,
      jobDescription,
      role,
      model = "GPT-4o",
      language = "English",
      autoAnswer = true,
      saveTranscript = true,
      isFreeSession = true,
    } = body;

    const callSession = await prisma.callSession.create({
      data: {
        userId,
        type:
          type === "REGULAR_CALL" || type === "regular"
            ? SessionType.REGULAR_CALL
            : SessionType.INTERVIEW,
        status: SessionStatus.READY,
        company: company || null,
        jobDescription: jobDescription || null,
        role: role || null,
        model,
        language,
        autoAnswer,
        saveTranscript,
        isFreeSession: Boolean(isFreeSession),
      },
    });

    return NextResponse.json({ session: callSession }, { status: 201 });
  } catch (err) {
    console.error("POST /api/sessions:", err);
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 500 }
    );
  }
}
