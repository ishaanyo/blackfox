import { NextResponse } from "next/server";
import { getApiUserId } from "@/lib/getApiUser";
import { prisma } from "@/lib/prisma";

const AICREDITS_BASE =
  process.env.AICREDITS_BASE || "https://api.aicredits.in/v1";
const DEFAULT_CHAT_MODEL =
  process.env.DEFAULT_CHAT_MODEL || "google/gemini-3.1-flash-lite";

type ChatMessage = { role: string; content: string };

function languageDisplayName(code: string): string {
  const map: Record<string, string> = {
    bg: "Bulgarian",
    hr: "Croatian",
    cs: "Czech",
    da: "Danish",
    nl: "Dutch",
    en: "English",
    et: "Estonian",
    fi: "Finnish",
    fr: "French",
    de: "German",
    el: "Greek",
    hu: "Hungarian",
    it: "Italian",
    lv: "Latvian",
    lt: "Lithuanian",
    mt: "Maltese",
    pl: "Polish",
    pt: "Portuguese",
    ro: "Romanian",
    ru: "Russian",
    sk: "Slovak",
    sl: "Slovenian",
    es: "Spanish",
    sv: "Swedish",
    uk: "Ukrainian",
  };
  return map[code.trim().toLowerCase()] || "English";
}

/**
 * POST /api/chat
 * Desktop (and web) chat proxy — AICREDITS_API_KEY stays on the server.
 *
 * Auth: NextAuth session cookie OR Authorization: Bearer <desktop-token>
 *
 * Body:
 * {
 *   message: string;                 // latest user message (required)
 *   messages?: { role, content }[];  // prior history (optional; server will append message)
 *   model?: string;
 *   language?: string;               // ISO code, e.g. "en"
 *   sessionId?: string;              // CallSession id — used to own-check + save transcripts
 *   saveTranscript?: boolean;
 * }
 */
export async function POST(req: Request) {
  try {
    const userId = await getApiUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const apiKey = process.env.AICREDITS_API_KEY?.trim();
    if (!apiKey) {
      console.error("AICREDITS_API_KEY is not set on the server");
      return NextResponse.json(
        { error: "Chat service not configured" },
        { status: 503 }
      );
    }

    const body = await req.json();
    const {
      message,
      messages: priorMessages,
      model,
      language = "en",
      sessionId,
      saveTranscript = true,
    } = body as {
      message?: string;
      messages?: ChatMessage[];
      model?: string;
      language?: string;
      sessionId?: string;
      saveTranscript?: boolean;
    };

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { error: "message is required" },
        { status: 400 }
      );
    }

    // Optional: verify session belongs to this user
    let ownedSessionId: string | null = null;
    let shouldSave = Boolean(saveTranscript);
    if (sessionId && typeof sessionId === "string" && sessionId.trim()) {
      const callSession = await prisma.callSession.findFirst({
        where: { id: sessionId.trim(), userId },
        select: { id: true, saveTranscript: true, model: true, language: true },
      });
      if (!callSession) {
        return NextResponse.json({ error: "Session not found" }, { status: 404 });
      }
      ownedSessionId = callSession.id;
      // Prefer explicit body flag; fall back to session setting
      if (body.saveTranscript === undefined) {
        shouldSave = callSession.saveTranscript;
      }
    }

    const langCode =
      typeof language === "string" && language.trim() ? language.trim() : "en";
    const langName = languageDisplayName(langCode);
    const systemPrompt = `You are a helpful, concise interview assistant. Always reply in ${langName} (language code: ${langCode}). Match the user if they switch languages, but prefer ${langName}.`;

    const apiMessages: ChatMessage[] = [
      { role: "system", content: systemPrompt },
    ];

    if (Array.isArray(priorMessages)) {
      for (const m of priorMessages) {
        if (
          m &&
          typeof m.role === "string" &&
          typeof m.content === "string" &&
          (m.role === "user" || m.role === "assistant")
        ) {
          apiMessages.push({ role: m.role, content: m.content });
        }
      }
    }

    // Ensure the latest user message is last (desktop may already include it in messages)
    const last = apiMessages[apiMessages.length - 1];
    if (!(last && last.role === "user" && last.content === message.trim())) {
      apiMessages.push({ role: "user", content: message.trim() });
    }

    const chatModel =
      (typeof model === "string" && model.trim()) || DEFAULT_CHAT_MODEL;

    const aicreditsRes = await fetch(`${AICREDITS_BASE}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: chatModel,
        messages: apiMessages,
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!aicreditsRes.ok) {
      const errText = await aicreditsRes.text().catch(() => "");
      console.error("AICredits error:", aicreditsRes.status, errText);
      return NextResponse.json(
        { error: `Upstream AI error (${aicreditsRes.status})` },
        { status: 502 }
      );
    }

    const data = (await aicreditsRes.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const reply =
      data.choices?.[0]?.message?.content?.trim() ||
      "";

    // Persist transcripts server-side when we have a valid owned session
    if (ownedSessionId && shouldSave) {
      try {
        await prisma.callTranscript.createMany({
          data: [
            {
              sessionId: ownedSessionId,
              role: "user",
              content: message.trim(),
            },
            {
              sessionId: ownedSessionId,
              role: "assistant",
              content: reply || "(empty)",
            },
          ],
        });
      } catch (e) {
        console.error("Failed to save transcripts:", e);
        // Non-fatal — still return the reply
      }
    }

    return NextResponse.json({ reply, model: chatModel });
  } catch (err) {
    console.error("POST /api/chat:", err);
    return NextResponse.json(
      { error: "Failed to process chat" },
      { status: 500 }
    );
  }
}
