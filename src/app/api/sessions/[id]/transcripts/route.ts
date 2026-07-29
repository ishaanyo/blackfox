import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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
      transcripts: transcripts.map((t) => ({
        ...t,
        id: t.id.toString(),
      })),
    });
  } catch (err) {
    console.error("GET transcripts:", err);
    return NextResponse.json({ error: "Failed to load transcripts" }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { role, content } = body as { role?: string; content?: string };

    if (!role || !content) {
      return NextResponse.json(
        { error: "role and content are required" },
        { status: 400 }
      );
    }

    const callSession = await prisma.callSession.findFirst({
      where: { id, userId: session.user.id },
    });
    if (!callSession) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const transcript = await prisma.callTranscript.create({
      data: {
        sessionId: id,
        role,
        content,
      },
    });

    return NextResponse.json({
      transcript: { ...transcript, id: transcript.id.toString() },
    }, { status: 201 });
  } catch (err) {
    console.error("POST transcripts:", err);
    return NextResponse.json({ error: "Failed to save transcript" }, { status: 500 });
  }
}
