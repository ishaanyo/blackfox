"use client";

import { useEffect, useState, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

type SessionRow = {
  id: string;
  company?: string | null;
  role?: string | null;
  status?: string;
  createdAt?: string;
};

const PROTOCOL = "blackfox";

function DesktopLinkInner() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login?callbackUrl=/desktop-link");
      return;
    }
    if (status !== "authenticated") return;

    (async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/sessions");
        if (!res.ok) throw new Error("Failed to load sessions");
        const data = await res.json();
        setSessions(data.sessions || []);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error");
      } finally {
        setLoading(false);
      }
    })();
  }, [status, router]);

  // Optional: ?connect=1 auto-fires login-only connect once
  useEffect(() => {
    if (status !== "authenticated" || loading) return;
    if (searchParams.get("connect") === "1") {
      void connectDesktopOnly();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, loading, searchParams]);

  async function fetchDesktopToken(): Promise<string | null> {
    const res = await fetch("/api/desktop-token", { method: "POST" });
    if (!res.ok) return null;
    const data = await res.json();
    return data.token as string;
  }

  /** Login only — no session required */
  async function connectDesktopOnly() {
    setConnecting(true);
    setError("");
    try {
      const token = await fetchDesktopToken();
      if (!token) {
        setError("Could not issue desktop token");
        return;
      }
      window.location.href = `${PROTOCOL}://auth?token=${encodeURIComponent(token)}`;
    } catch {
      setError("Connect failed");
    } finally {
      setConnecting(false);
    }
  }

  /** Open a specific session (attach token for desktop API) */
  async function openInDesktop(id: string) {
    setConnecting(true);
    try {
      const token = await fetchDesktopToken();
      const q = token ? `?token=${encodeURIComponent(token)}` : "";
      window.location.href = `${PROTOCOL}://session/${id}${q}`;
    } finally {
      setConnecting(false);
    }
  }

  if (status === "loading" || (status === "authenticated" && loading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5]">
        <p className="text-sm text-slate-500">Loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-lg font-bold text-slate-900">Open in Desktop App</h1>
          <p className="text-sm text-slate-500 mt-1">
            Signed in as {session?.user?.email}. Connect the desktop or pick a
            session.
          </p>
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <button
          type="button"
          disabled={connecting}
          onClick={() => void connectDesktopOnly()}
          className="w-full border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-sm font-semibold py-3 rounded-xl disabled:opacity-60"
        >
          {connecting ? "Connecting…" : "Connect Desktop (login only)"}
        </button>

        {sessions.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-5 text-center space-y-3">
            <p className="text-sm text-slate-600">No sessions yet.</p>
            <Link
              href="/dashboard"
              className="inline-block text-sm font-semibold text-green-700 hover:underline"
            >
              Create a session on the dashboard →
            </Link>
          </div>
        ) : (
          <ul className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-100 overflow-hidden">
            {sessions.map((s) => (
              <li
                key={s.id}
                className="flex items-center justify-between gap-3 px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">
                    {s.company || s.role || "Untitled"}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">{s.id}</p>
                </div>
                <button
                  type="button"
                  disabled={connecting}
                  onClick={() => void openInDesktop(s.id)}
                  className="shrink-0 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3 py-2 rounded-lg disabled:opacity-60"
                >
                  Open Desktop
                </button>
              </li>
            ))}
          </ul>
        )}

        <p className="text-center">
          <Link
            href="/dashboard"
            className="text-sm text-slate-500 hover:text-slate-800"
          >
            ← Back to dashboard
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function DesktopLinkPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5]">
          <p className="text-sm text-slate-500">Loading…</p>
        </div>
      }
    >
      <DesktopLinkInner />
    </Suspense>
  );
}
