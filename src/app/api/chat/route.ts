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

async function saveTranscripts(
  sessionId: string | null,
  shouldSave: boolean,
  userMessage: string,
  reply: string
) {
  if (!sessionId || !shouldSave) return;
  try {
    await prisma.callTranscript.createMany({
      data: [
        { sessionId, role: "user", content: userMessage },
        { sessionId, role: "assistant", content: reply || "(empty)" },
      ],
    });
  } catch (e) {
    console.error("Failed to save transcripts:", e);
  }
}

/**
 * POST /api/chat
 *
 * Body:
 * {
 *   message: string;
 *   messages?: { role, content }[];
 *   model?: string;
 *   language?: string;
 *   sessionId?: string;
 *   saveTranscript?: boolean;
 *   stream?: boolean;   // SSE when true
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
      stream = false,
    } = body as {
      message?: string;
      messages?: ChatMessage[];
      model?: string;
      language?: string;
      sessionId?: string;
      saveTranscript?: boolean;
      stream?: boolean;
    };

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { error: "message is required" },
        { status: 400 }
      );
    }

    let ownedSessionId: string | null = null;
    let shouldSave = Boolean(saveTranscript);
    if (sessionId && typeof sessionId === "string" && sessionId.trim()) {
      const callSession = await prisma.callSession.findFirst({
        where: { id: sessionId.trim(), userId },
        select: { id: true, saveTranscript: true },
      });
      if (!callSession) {
        return NextResponse.json({ error: "Session not found" }, { status: 404 });
      }
      ownedSessionId = callSession.id;
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

    const last = apiMessages[apiMessages.length - 1];
    if (!(last && last.role === "user" && last.content === message.trim())) {
      apiMessages.push({ role: "user", content: message.trim() });
    }

    const chatModel =
      (typeof model === "string" && model.trim()) || DEFAULT_CHAT_MODEL;

    const wantStream = Boolean(stream);

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
        stream: wantStream,
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

    // ── Streaming (SSE) ──
    if (wantStream && aicreditsRes.body) {
      const upstream = aicreditsRes.body;
      const decoder = new TextDecoder();
      let lineBuf = "";
      let fullReply = "";
      const userMsg = message.trim();
      const sessionForSave = ownedSessionId;
      const doSave = shouldSave;

      const streamOut = new ReadableStream<Uint8Array>({
        async start(controller) {
          const reader = upstream.getReader();
          const enc = new TextEncoder();
          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              lineBuf += decoder.decode(value, { stream: true });
              const lines = lineBuf.split("\n");
              lineBuf = lines.pop() || "";

              for (const rawLine of lines) {
                const line = rawLine.trim();
                if (!line.startsWith("data:")) continue;
                const payload = line.slice(5).trim();
                if (payload === "[DONE]") continue;
                try {
                  const json = JSON.parse(payload) as {
                    choices?: { delta?: { content?: string } }[];
                  };
                  const delta = json.choices?.[0]?.delta?.content;
                  if (delta) {
                    fullReply += delta;
                    // Re-emit OpenAI-style SSE chunk for desktop
                    controller.enqueue(
                      enc.encode(`data: ${JSON.stringify({ content: delta })}\n\n`)
                    );
                  }
                } catch {
                  // ignore malformed chunk
                }
              }
            }
            controller.enqueue(enc.encode("data: [DONE]\n\n"));
            controller.close();
          } catch (e) {
            console.error("stream error:", e);
            try {
              controller.error(e);
            } catch {
              /* already closed */
            }
          } finally {
            await saveTranscripts(sessionForSave, doSave, userMsg, fullReply);
          }
        },
      });

      return new Response(streamOut, {
        headers: {
          "Content-Type": "text/event-stream; charset=utf-8",
          "Cache-Control": "no-cache, no-transform",
          Connection: "keep-alive",
          "X-Accel-Buffering": "no",
        },
      });
    }

    // ── Non-streaming JSON ──
    const data = (await aicreditsRes.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const reply = data.choices?.[0]?.message?.content?.trim() || "";

    await saveTranscripts(ownedSessionId, shouldSave, message.trim(), reply);

    return NextResponse.json({ reply, model: chatModel });
  } catch (err) {
    console.error("POST /api/chat:", err);
    return NextResponse.json(
      { error: "Failed to process chat" },
      { status: 500 }
    );
  }
}
