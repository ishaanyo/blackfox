"use client";

import { useState, useEffect, useCallback } from "react";
import CreateSessionModal, { type SessionForm } from "./CreateSessionModal";

type Session = {
  id: string;
  date: string;
  title: string;
  subtitle: string;
  status: "ready" | "ended";
  duration?: string;
  tags: ("Interview" | "Transcript")[];
  company?: string;
  jobDescription?: string;
  role?: string;
  model?: string;
  language?: string;
  autoAnswer?: boolean;
  saveTranscript?: boolean;
  type?: "interview" | "regular";
};

type Filter = "all" | "active" | "ended";

function mapApiSession(s: {
  id: string;
  createdAt: string;
  company?: string | null;
  role?: string | null;
  jobDescription?: string | null;
  status: string;
  durationSeconds?: number | null;
  isFreeSession?: boolean;
  model?: string | null;
  language?: string | null;
  autoAnswer?: boolean;
  saveTranscript?: boolean;
  type?: string;
}): Session {
  const created = new Date(s.createdAt);
  const months = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
  const dateStr = `${months[created.getMonth()]} ${created.getDate()}, ${created.getFullYear()}`;
  const status = s.status === "READY" || s.status === "ACTIVE" ? "ready" : "ended";
  let duration: string | undefined;
  if (s.durationSeconds) {
    const mins = Math.max(1, Math.round(s.durationSeconds / 60));
    duration = `${mins} min` + (s.isFreeSession ? " · Free Session" : "");
  }
  return {
    id: s.id,
    date: dateStr,
    title: s.company || s.role || "Untitled",
    subtitle: s.role || (s.jobDescription ? s.jobDescription.slice(0, 40) : "") || "",
    status,
    duration,
    tags: ["Interview", "Transcript"],
    company: s.company || "",
    jobDescription: s.jobDescription || "",
    role: s.role || "",
  };
}

export default function CallSessions() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [editSession, setEditSession] = useState<Session | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [useApi, setUseApi] = useState(false);
  const [platformSessionId, setPlatformSessionId] = useState<string | null>(null);

  const loadSessions = useCallback(async () => {
    try {
      const res = await fetch("/api/sessions");
      if (res.status === 401) {
        setUseApi(false);
        setSessions([]);
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setUseApi(true);
        setSessions((data.sessions || []).map(mapApiSession));
      }
    } catch {
      setUseApi(false);
    }
  }, []);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  const filtered = sessions.filter((s) => {
    if (filter === "active" && s.status !== "ready") return false;
    if (filter === "ended" && s.status !== "ended") return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        s.title.toLowerCase().includes(q) ||
        s.subtitle.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCreate = async (data: SessionForm) => {
    if (useApi) {
      try {
        const res = await fetch("/api/sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: data.type === "regular" ? "REGULAR_CALL" : "INTERVIEW",
            company: data.company,
            jobDescription: data.jobDescription,
            model: data.model,
            language: data.language,
            autoAnswer: data.autoAnswer,
            saveTranscript: data.saveTranscript,
          }),
        });
        if (res.ok) {
          await loadSessions();
          return;
        }
      } catch {
        /* fall through to local */
      }
    }
    const now = new Date();
    const months = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
    const dateStr = `${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;
    const newSession: Session = {
      id: String(Date.now()),
      date: dateStr,
      title: data.company.replace(/\.\.\.$/, "") || "New Session",
      subtitle:
        data.jobDescription.slice(0, 40) +
        (data.jobDescription.length > 40 ? "..." : ""),
      status: "ready",
      tags: ["Interview", "Transcript"],
    };
    setSessions((prev) => [newSession, ...prev]);
  };

  const handleDeleteSession = async (id: string) => {
    setMenuOpenId(null);
    if (useApi) {
      try {
        const res = await fetch(`/api/sessions/${id}`, { method: "DELETE" });
        if (res.ok) {
          await loadSessions();
          return;
        }
      } catch { /* local */ }
    }
    setSessions((prev) => prev.filter((s) => s.id !== id));
  };

  const handleUpdate = async (id: string, data: SessionForm) => {
    if (useApi) {
      try {
        await fetch(`/api/sessions/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            company: data.company,
            role: data.jobDescription.slice(0, 80) || data.company,
            jobDescription: data.jobDescription,
            model: data.model,
            language: data.language,
            autoAnswer: data.autoAnswer,
            saveTranscript: data.saveTranscript,
          }),
        });
        await loadSessions();
        return;
      } catch { /* local */ }
    }
    setSessions((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              title: data.company || s.title,
              subtitle: data.jobDescription.slice(0, 40) || s.subtitle,
              company: data.company,
              jobDescription: data.jobDescription,
            }
          : s
      )
    );
  };

  const handleDesktopApp = () => {
    // Placeholder: open desktop app deep link / download page
    // Replace with your real protocol or URL when ready, e.g. blackfox://session/{id}
    if (platformSessionId) {
      window.open(`blackfox://session/${platformSessionId}`, "_self");
    }
    setPlatformSessionId(null);
  };

  return (
    <div className="flex-1 min-w-0 bg-[#fafafa]">
      <header className="h-14 border-b border-slate-200 bg-white px-6 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2 min-w-0">
          <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <div>
            <h1 className="text-sm font-semibold text-slate-900 leading-tight">
              Call Sessions
            </h1>
            <p className="text-[11px] text-slate-400 leading-tight">
              Prepare for calls and review past sessions.
            </p>
          </div>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary-dark text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-sm shadow-green-200 transition"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          Create Session
        </button>
      </header>

      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1 border-b border-slate-200">
            {(
              [
                { key: "all", label: "All" },
                { key: "active", label: "Active" },
                { key: "ended", label: "Ended" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`px-3 py-2 text-sm font-medium border-b-2 -mb-px transition ${
                  filter === tab.key
                    ? "border-slate-900 text-slate-900"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <span className="text-xs text-slate-400 font-medium">
            {filtered.length} Sessions
          </span>
        </div>

        <div className="flex items-center gap-3 mb-5">
          <div className="relative flex-1 max-w-md">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by role or company"
              className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-sm bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
            />
          </div>
          <button className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-white transition" title="Sort">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          </button>
          <div className="flex border border-slate-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setView("grid")}
              className={`p-2 transition ${view === "grid" ? "bg-white text-slate-800" : "text-slate-400 hover:text-slate-600"}`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setView("list")}
              className={`p-2 transition ${view === "list" ? "bg-white text-slate-800" : "text-slate-400 hover:text-slate-600"}`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-400 text-sm">
            No sessions found. Click &quot;Create Session&quot; to add one.
          </div>
        ) : (
          <div
            className={
              view === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                : "space-y-3"
            }
          >
            {filtered.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                menuOpen={menuOpenId === session.id}
                onMenuToggle={() =>
                  setMenuOpenId(menuOpenId === session.id ? null : session.id)
                }
                onEdit={() => {
                  setMenuOpenId(null);
                  setEditSession(session);
                }}
                onDelete={() => handleDeleteSession(session.id)}
                onStart={() => setPlatformSessionId(session.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Choose Platform — Desktop App only */}
      {platformSessionId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            onClick={() => setPlatformSessionId(null)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-5">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-base font-bold text-slate-900">Choose Platform</h2>
              <button
                onClick={() => setPlatformSessionId(null)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-sm text-slate-500 mb-4">
              How would you like to connect to your call session?
            </p>
            <button
              onClick={handleDesktopApp}
              className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold py-3 rounded-xl transition"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Desktop App
            </button>
          </div>
        </div>
      )}

      <CreateSessionModal
        open={Boolean(editSession)}
        mode="edit"
        initialData={
          editSession
            ? {
                id: editSession.id,
                type: editSession.type || "interview",
                company: editSession.company || editSession.title,
                jobDescription: editSession.jobDescription || editSession.subtitle,
                model: editSession.model || "GPT-5.5",
                language: editSession.language || "English",
                autoAnswer: editSession.autoAnswer ?? true,
                saveTranscript: editSession.saveTranscript ?? true,
                selectedResumes: [],
                selectedDocuments: [],
                extraContext: "",
              }
            : undefined
        }
        onClose={() => setEditSession(null)}
        onUpdate={handleUpdate}
      />

      <CreateSessionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={handleCreate}
      />
    </div>
  );
}

function SessionCard({
  session,
  menuOpen,
  onMenuToggle,
  onEdit,
  onDelete,
  onStart,
}: {
  session: Session;
  menuOpen: boolean;
  onMenuToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onStart: () => void;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 hover:shadow-md hover:border-slate-300 transition group relative">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          {session.date}
        </span>
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMenuToggle();
            }}
            className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
            aria-label="More"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={onMenuToggle} />
              <div className="absolute right-0 top-full mt-1 z-20 w-36 bg-white border border-slate-200 rounded-xl shadow-lg py-1 overflow-hidden">
                <button
                  onClick={onEdit}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  Edit
                  <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
                <button
                  onClick={onDelete}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Delete
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <h3 className="font-semibold text-slate-900 text-sm mb-0.5 truncate">
        {session.title}
      </h3>
      <p className="text-xs text-slate-500 mb-3 truncate">{session.subtitle}</p>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {session.tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200 text-[10px] font-medium text-slate-600"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          {session.status === "ready" ? (
            <>
              <p className="flex items-center gap-1.5 text-xs font-medium text-green-600">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                Ready to Start
              </p>
              <p className="text-[10px] text-slate-400">No usage yet</p>
            </>
          ) : (
            <>
              <p className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                Ended
              </p>
              <p className="text-[10px] text-slate-400">{session.duration}</p>
            </>
          )}
        </div>
        {session.status === "ready" ? (
          <button
            onClick={onStart}
            className="shrink-0 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition"
          >
            Start Session
          </button>
        ) : (
          <button className="shrink-0 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold px-3.5 py-2 rounded-lg transition">
            View Transcript
          </button>
        )}
      </div>
    </div>
  );
}
