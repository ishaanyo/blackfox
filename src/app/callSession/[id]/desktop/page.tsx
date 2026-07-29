"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";

/** Custom protocol registered by the Windows desktop app */
const PROTOCOL = "blackfox";

export default function DesktopLaunchPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = (params?.id as string) || "";
  const [tried, setTried] = useState(false);

  const deepLink = `${PROTOCOL}://session/${sessionId}`;

  const openDesktopApp = useCallback(() => {
    // Trigger OS protocol handler (browser shows "Open ?" dialog)
    window.location.href = deepLink;
    setTried(true);
  }, [deepLink]);

  // Auto-try once on mount (like Parakeet)
  useEffect(() => {
    if (!sessionId) return;
    const t = setTimeout(() => openDesktopApp(), 400);
    return () => clearTimeout(t);
  }, [sessionId, openDesktopApp]);

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md text-center space-y-8">
        <div className="flex items-center justify-center gap-2">
          <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-bold text-lg">
            B
          </div>
          <span className="text-xl font-bold text-slate-900">
            Blackfox<span className="text-green-600">AI</span>
          </span>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
          Click &quot;Open&quot; in the dialog shown by your browser. If you don&apos;t see
          the dialog, click &quot;Open in Desktop App&quot; below.
        </p>

        <button
          onClick={openDesktopApp}
          className="inline-flex items-center justify-center gap-2 w-full max-w-xs mx-auto border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-sm font-semibold py-3 px-4 rounded-xl transition"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          Open in Desktop App
        </button>

        {tried && (
          <p className="text-xs text-slate-400">
            If nothing opened, install the desktop app below.
          </p>
        )}

        <div className="border-t border-slate-200 pt-6 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left space-y-3">
            <p className="text-sm font-semibold text-slate-800">
              Don&apos;t have the desktop app yet?
            </p>
            <p className="text-xs text-slate-500">
              Download it to run BlackfoxAI privately during your calls.
            </p>
            <a
              href="/downloads/BlackfoxAI-Setup.exe"
              className="flex items-center justify-center gap-2 w-full bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold py-3 rounded-xl transition"
            >
              Download for Windows
            </a>
            <p className="text-center text-xs text-slate-400">
              Need it for{" "}
              <span className="underline cursor-not-allowed opacity-60">macOS</span>?
            </p>
          </div>
        </div>

        <button
          onClick={() => router.push("/dashboard")}
          className="text-sm text-slate-500 hover:text-slate-800 transition"
        >
          ← Back to dashboard
        </button>

        <p className="text-[10px] text-slate-300 break-all font-mono">{deepLink}</p>
      </div>
    </div>
  );
}
