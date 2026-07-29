import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * Client uploads to Vercel Blob.
 * Browser calls upload() from @vercel/blob/client with handleUploadUrl: "/api/blob/upload"
 * Requires BLOB_READ_WRITE_TOKEN in env (from Vercel Blob store).
 */
export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
          throw new Error("Not authenticated");
        }

        let kind: "resume" | "document" = "document";
        try {
          if (clientPayload) {
            const parsed = JSON.parse(clientPayload) as { kind?: string };
            if (parsed.kind === "resume") kind = "resume";
          }
        } catch {
          /* ignore */
        }

        // Organize by user + kind: resumes/userId/... or documents/userId/...
        return {
          allowedContentTypes: [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "text/plain",
            "text/markdown",
            "text/csv",
            "application/rtf",
          ],
          maximumSizeInBytes: 20 * 1024 * 1024, // 20 MB
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({
            userId: session.user.id,
            kind,
            pathname,
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // Note: onUploadCompleted may not run on localhost without a public tunnel
        try {
          if (!tokenPayload) return;
          const { userId, kind } = JSON.parse(tokenPayload) as {
            userId: string;
            kind: "resume" | "document";
          };
          const name =
            blob.pathname.split("/").pop()?.replace(/-[a-zA-Z0-9]+\./, ".") ||
            blob.pathname;

          if (kind === "resume") {
            await prisma.resume.create({
              data: {
                userId,
                name: name.replace(/\.[^.]+$/, "") || name,
                fileUrl: blob.url,
              },
            });
          } else {
            await prisma.document.create({
              data: {
                userId,
                name,
                fileUrl: blob.url,
              },
            });
          }
        } catch (e) {
          console.error("onUploadCompleted DB error:", e);
        }
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: message },
      { status: message === "Not authenticated" ? 401 : 400 }
    );
  }
}
