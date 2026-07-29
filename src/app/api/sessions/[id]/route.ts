import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SessionStatus } from "@prisma/client";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const callSession = await prisma.callSession.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!callSession) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const transcripts = await prisma.callTranscript.findMany({
      where: { sessionId: id },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({
      session: {
        ...callSession,
        transcripts: transcripts.map((t) => ({
          ...t,
          id: t.id.toString(),
        })),
      },
    });
  } catch (err) {
    console.error("GET /api/sessions/[id]:", err);
    return NextResponse.json({ error: "Failed to load session" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const existing = await prisma.callSession.findFirst({
      where: { id, userId: session.user.id },
    });
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const data: Record<string, unknown> = {};
    if (body.status === "ACTIVE") {
      data.status = SessionStatus.ACTIVE;
      data.startedAt = new Date();
    }
    if (body.status === "ENDED") {
      data.status = SessionStatus.ENDED;
      data.endedAt = new Date();
      if (existing.startedAt) {
        data.durationSeconds = Math.floor(
          (Date.now() - existing.startedAt.getTime()) / 1000
        );
      }
    }
    if (typeof body.durationSeconds === "number") {
      data.durationSeconds = body.durationSeconds;
    }
    if (typeof body.company === "string") data.company = body.company;
    if (typeof body.role === "string") data.role = body.role;
    if (typeof body.jobDescription === "string") data.jobDescription = body.jobDescription;
    if (typeof body.model === "string") data.model = body.model;
    if (typeof body.language === "string") data.language = body.language;
    if (typeof body.autoAnswer === "boolean") data.autoAnswer = body.autoAnswer;
    if (typeof body.saveTranscript === "boolean") data.saveTranscript = body.saveTranscript;

    const updated = await prisma.callSession.update({
      where: { id },
      data,
    });

    return NextResponse.json({ session: updated });
  } catch (err) {
    console.error("PATCH /api/sessions/[id]:", err);
    return NextResponse.json({ error: "Failed to update session" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const existing = await prisma.callSession.findFirst({
      where: { id, userId: session.user.id },
    });
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await prisma.callSession.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/sessions/[id]:", err);
    return NextResponse.json({ error: "Failed to delete session" }, { status: 500 });
  }
}
