import { put, del } from "@vercel/blob";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function blobToken() {
  return (
    process.env.BLACK_READ_WRITE_TOKEN ||
    process.env.BLACKFOX_READ_WRITE_TOKEN ||
    process.env.BLOB_READ_WRITE_TOKEN ||
    ""
  );
}

/** Server upload → Vercel Blob + Neon metadata only (no local file storage). */
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = blobToken();
    if (!token) {
      return NextResponse.json(
        {
          error:
            "Blob token missing. Set BLACK_READ_WRITE_TOKEN in .env (from Vercel Blob store).",
        },
        { status: 500 }
      );
    }

    const form = await request.formData();
    const file = form.get("file") as File | null;
    const kind = (form.get("kind") as string) || "document";

    if (!file) {
      return NextResponse.json({ error: "No file" }, { status: 400 });
    }

    const folder = kind === "resume" ? "resumes" : "documents";
    const pathname = `${folder}/${session.user.id}/${file.name}`;

    const blob = await put(pathname, file, {
      access: "public",
      addRandomSuffix: true,
      token,
    });

    const displayName =
      kind === "resume"
        ? file.name.replace(/\.[^.]+$/, "") || file.name
        : file.name;

    if (kind === "resume") {
      const row = await prisma.resume.create({
        data: {
          userId: session.user.id,
          name: displayName,
          fileUrl: blob.url,
        },
      });
      return NextResponse.json(
        {
          blob: { url: blob.url, pathname: blob.pathname, contentType: blob.contentType },
          item: row,
        },
        { status: 201 }
      );
    }

    const row = await prisma.document.create({
      data: {
        userId: session.user.id,
        name: displayName,
        fileUrl: blob.url,
      },
    });
    return NextResponse.json(
      {
        blob: { url: blob.url, pathname: blob.pathname, contentType: blob.contentType },
        item: row,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("server-upload:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Upload failed" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const token = blobToken();
    const { url, id, kind } = await request.json();
    if (url && token) {
      await del(url, { token });
    }
    if (id && kind === "resume") {
      await prisma.resume.deleteMany({ where: { id, userId: session.user.id } });
    }
    if (id && kind === "document") {
      await prisma.document.deleteMany({ where: { id, userId: session.user.id } });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("blob DELETE:", err);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
