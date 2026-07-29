"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { uploadToBlob, downloadFromBlob } from "@/lib/blobUpload";

type ResumeRow = {
  id: string;
  name: string;
  fileUrl: string | null;
  content: string | null;
  createdAt: string;
  source?: "uploaded" | "created";
  size?: number;
  fileType?: string;
};

type Filter = "all" | "uploaded" | "created";

function formatDate(iso: string) {
  const d = new Date(iso);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

function formatBytes(bytes?: number) {
  if (bytes == null) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ResumesPage() {
  const [items, setItems] = useState<ResumeRow[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [createOpen, setCreateOpen] = useState(false);
  const [createName, setCreateName] = useState("");
  const [createContent, setCreateContent] = useState("");
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/resumes");
      if (res.status === 401) {
        setItems([]);
        setError("Sign in to manage resumes stored in Vercel Blob.");
        return;
      }
      if (!res.ok) throw new Error("Failed to load resumes");
      const data = await res.json();
      setItems(
        (data.resumes || []).map((r: ResumeRow) => ({
          ...r,
          source: r.fileUrl ? "uploaded" : "created",
        }))
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = items.filter((item) => {
    if (filter === "uploaded" && item.source !== "uploaded") return false;
    if (filter === "created" && item.source !== "created") return false;
    if (search) return item.name.toLowerCase().includes(search.toLowerCase());
    return true;
  });

  const handleUpload = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    setError("");
    try {
      for (const file of Array.from(files)) {
        await uploadToBlob(file, "resume");
      }
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleCreate = async () => {
    if (!createName.trim()) return;
    setUploading(true);
    setError("");
    try {
      const blob = new Blob([createContent], { type: "text/plain" });
      const file = new File([blob], `${createName.trim()}.txt`, { type: "text/plain" });
      await uploadToBlob(file, "resume");
      setCreateOpen(false);
      setCreateName("");
      setCreateContent("");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Create failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (item: ResumeRow) => {
    setMenuOpenId(null);
    try {
      await fetch("/api/blob/server-upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: item.fileUrl, id: item.id, kind: "resume" }),
      });
      await load();
    } catch {
      setError("Delete failed");
    }
  };

  return (
    <div className="flex-1 min-w-0 bg-[#fafafa]">
      <header className="h-14 border-b border-slate-200 bg-white px-6 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2 min-w-0">
          <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <div>
            <h1 className="text-sm font-semibold text-slate-900 leading-tight">CVs & Resumes</h1>
            <p className="text-[11px] text-slate-400 leading-tight">
              Create or upload resumes to personalize AI answers.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCreateOpen(true)}
            className="inline-flex items-center gap-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-sm font-semibold px-3.5 py-2 rounded-lg transition"
          >
            + Create Resume
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary-dark disabled:opacity-60 text-white text-sm font-semibold px-3.5 py-2 rounded-lg shadow-sm transition"
          >
            {uploading ? "Uploading…" : "Upload Resume"}
          </button>
          <input
            ref={fileRef}
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.txt,.md"
            className="hidden"
            onChange={(e) => handleUpload(e.target.files)}
          />
        </div>
      </header>

      <div className="p-6">
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-100 text-red-700 text-sm px-3 py-2">
            {error}
          </div>
        )}

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1 border-b border-slate-200">
            {(
              [
                { key: "all", label: "All" },
                { key: "uploaded", label: "Uploaded" },
                { key: "created", label: "Created" },
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
            {filtered.length} Resume{filtered.length === 1 ? "" : "s"}
          </span>
        </div>

        <div className="flex items-center gap-3 mb-5">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search CVs or resumes"
              className="w-full pl-3 pr-3 py-2 border border-slate-200 rounded-xl text-sm bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {loading ? (
          <p className="text-center text-sm text-slate-500 py-16">Loading…</p>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-semibold text-slate-800 mb-1">No resumes yet</p>
            <p className="text-sm text-slate-500 mb-4 max-w-sm mx-auto">
              Upload a resume — files are stored in Vercel Blob (not on this device).
            </p>
            <button
              onClick={() => fileRef.current?.click()}
              className="inline-flex items-center gap-1.5 bg-slate-900 text-white text-sm font-semibold px-4 py-2.5 rounded-lg"
            >
              Upload Resume
            </button>
          </div>
        ) : (
          <div className={view === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" : "space-y-3"}>
            {filtered.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-slate-200 rounded-2xl p-4 hover:shadow-md transition group relative"
              >
                <div className="flex items-start justify-between mb-1 relative">
                  <span className="text-[10px] font-semibold text-slate-400">
                    {formatDate(item.createdAt)}
                  </span>
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpenId(menuOpenId === item.id ? null : item.id);
                      }}
                      className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </button>
                    {menuOpenId === item.id && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setMenuOpenId(null)} />
                        <div className="absolute right-0 top-full mt-1 z-20 w-40 bg-white border border-slate-200 rounded-xl shadow-lg py-1">
                          <button
                            onClick={() => {
                              if (item.fileUrl) downloadFromBlob(item.fileUrl);
                              setMenuOpenId(null);
                            }}
                            className="w-full flex items-center justify-between px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                          >
                            Download
                          </button>
                          <button
                            onClick={() => handleDelete(item)}
                            className="w-full flex items-center justify-between px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <h3 className="font-semibold text-slate-900 text-sm mb-3 truncate">{item.name}</h3>
                <div className="rounded-xl bg-blue-50 border border-blue-100 px-3 py-4 mb-3 min-h-[72px] flex items-end">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-100 text-[10px] font-medium text-blue-700">
                    {item.source === "uploaded" ? "Uploaded" : "Created"} · Blob
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {item.fileType || "FILE"}
                  {item.size != null ? ` · ${formatBytes(item.size)}` : ""}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {createOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setCreateOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-5 space-y-4">
            <h2 className="text-lg font-bold">Create Resume</h2>
            <input
              value={createName}
              onChange={(e) => setCreateName(e.target.value)}
              placeholder="Resume name"
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm"
            />
            <textarea
              value={createContent}
              onChange={(e) => setCreateContent(e.target.value)}
              rows={6}
              placeholder="Paste resume text..."
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm resize-y"
            />
            <div className="flex gap-2">
              <button onClick={() => setCreateOpen(false)} className="flex-1 py-2.5 rounded-xl border text-sm font-semibold">
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={uploading}
                className="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold disabled:opacity-60"
              >
                {uploading ? "Saving…" : "Save to Blob"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
