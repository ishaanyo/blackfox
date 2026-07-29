"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { uploadToBlob, downloadFromBlob } from "@/lib/blobUpload";

type DocRow = {
  id: string;
  name: string;
  fileUrl: string | null;
  content: string | null;
  createdAt: string;
  source?: "uploaded" | "created" | "scraped";
};

type Filter = "all" | "uploaded" | "scraped" | "created";

function formatDate(iso: string) {
  const d = new Date(iso);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

export default function DocumentsPage() {
  const [items, setItems] = useState<DocRow[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [scrapeOpen, setScrapeOpen] = useState(false);
  const [createName, setCreateName] = useState("");
  const [createContent, setCreateContent] = useState("");
  const [scrapeUrl, setScrapeUrl] = useState("");
  const [scrapeName, setScrapeName] = useState("");
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/documents");
      if (res.status === 401) {
        setItems([]);
        setError("Sign in to manage documents stored in Vercel Blob.");
        return;
      }
      if (!res.ok) throw new Error("Failed to load documents");
      const data = await res.json();
      setItems(
        (data.documents || []).map((d: DocRow) => ({
          ...d,
          source: d.fileUrl ? "uploaded" : "created",
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
    if (filter === "scraped" && item.source !== "scraped") return false;
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
        await uploadToBlob(file, "document");
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
    try {
      const blob = new Blob([createContent], { type: "text/plain" });
      const file = new File([blob], `${createName.trim()}.txt`, { type: "text/plain" });
      await uploadToBlob(file, "document");
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

  const handleScrape = async () => {
    if (!scrapeUrl.trim()) return;
    setUploading(true);
    try {
      const name =
        scrapeName.trim() ||
        (() => {
          try {
            return new URL(scrapeUrl).hostname;
          } catch {
            return scrapeUrl.slice(0, 40);
          }
        })();
      const text = `Source URL: ${scrapeUrl.trim()}\n\n(Full scrape can be added later.)`;
      const file = new File([text], `${name}.txt`, { type: "text/plain" });
      await uploadToBlob(file, "document");
      setScrapeOpen(false);
      setScrapeUrl("");
      setScrapeName("");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Scrape save failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (item: DocRow) => {
    setMenuOpenId(null);
    await fetch("/api/blob/server-upload", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: item.fileUrl, id: item.id, kind: "document" }),
    });
    await load();
  };

  return (
    <div className="flex-1 min-w-0 bg-[#fafafa]">
      <header className="h-14 border-b border-slate-200 bg-white px-6 flex items-center justify-between sticky top-0 z-10">
        <div>
          <h1 className="text-sm font-semibold text-slate-900">Documents</h1>
          <p className="text-[11px] text-slate-400">Add documents for more relevant AI answers.</p>
        </div>
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-1.5 bg-primary text-white text-sm font-semibold px-3.5 py-2 rounded-lg disabled:opacity-60"
        >
          {uploading ? "Uploading…" : "+ Add Document"}
        </button>
        <input
          ref={fileRef}
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.txt,.md,.csv"
          className="hidden"
          onChange={(e) => handleUpload(e.target.files)}
        />
      </header>

      <div className="p-6">
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-100 text-red-700 text-sm px-3 py-2">
            {error}
          </div>
        )}

        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-1 border-b border-slate-200">
            {(
              [
                { key: "all", label: "All" },
                { key: "uploaded", label: "Uploaded" },
                { key: "scraped", label: "Scraped" },
                { key: "created", label: "Created" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`px-3 py-2 text-sm font-medium border-b-2 -mb-px ${
                  filter === tab.key ? "border-slate-900 text-slate-900" : "border-transparent text-slate-500"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <span className="text-xs text-slate-400">{filtered.length} Documents</span>
        </div>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by documents"
          className="w-full max-w-md mb-5 border border-slate-200 rounded-xl px-3 py-2 text-sm"
        />

        {loading ? (
          <p className="text-center text-sm text-slate-500 py-16">Loading…</p>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-semibold text-slate-800 mb-1">No documents added yet</p>
            <p className="text-sm text-slate-500 mb-6 max-w-md mx-auto">
              Upload documents — stored in Vercel Blob, metadata in your database.
            </p>
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={() => fileRef.current?.click()}
                className="bg-slate-900 text-white text-sm font-semibold px-5 py-2.5 rounded-lg min-w-[180px]"
              >
                Upload Document
              </button>
              <button
                onClick={() => setScrapeOpen(true)}
                className="border border-slate-200 text-sm font-semibold px-5 py-2.5 rounded-lg min-w-[180px]"
              >
                Scrape from URL
              </button>
              <button
                onClick={() => setCreateOpen(true)}
                className="border border-slate-200 text-sm font-semibold px-5 py-2.5 rounded-lg min-w-[180px]"
              >
                Create Document
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((item) => (
              <div key={item.id} className="bg-white border border-slate-200 rounded-2xl p-4 relative group">
                <div className="flex justify-between mb-1">
                  <span className="text-[10px] font-semibold text-slate-400">{formatDate(item.createdAt)}</span>
                  <div className="relative">
                    <button
                      onClick={() => setMenuOpenId(menuOpenId === item.id ? null : item.id)}
                      className="p-1 text-slate-400 hover:text-slate-600"
                    >
                      ⋮
                    </button>
                    {menuOpenId === item.id && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setMenuOpenId(null)} />
                        <div className="absolute right-0 z-20 w-36 bg-white border rounded-xl shadow-lg py-1">
                          <button
                            className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50"
                            onClick={() => {
                              if (item.fileUrl) downloadFromBlob(item.fileUrl);
                              setMenuOpenId(null);
                            }}
                          >
                            Download
                          </button>
                          <button
                            className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                            onClick={() => handleDelete(item)}
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <h3 className="font-semibold text-sm mb-3 truncate">{item.name}</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">Blob · {item.source}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {createOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setCreateOpen(false)} />
          <div className="relative bg-white rounded-2xl p-5 w-full max-w-md space-y-3">
            <h2 className="font-bold text-lg">Create Document</h2>
            <input value={createName} onChange={(e) => setCreateName(e.target.value)} placeholder="Name" className="w-full border rounded-xl px-3 py-2 text-sm" />
            <textarea value={createContent} onChange={(e) => setCreateContent(e.target.value)} rows={5} className="w-full border rounded-xl px-3 py-2 text-sm" />
            <div className="flex gap-2">
              <button onClick={() => setCreateOpen(false)} className="flex-1 border rounded-xl py-2 text-sm font-semibold">Cancel</button>
              <button onClick={handleCreate} className="flex-1 bg-primary text-white rounded-xl py-2 text-sm font-semibold">Save to Blob</button>
            </div>
          </div>
        </div>
      )}

      {scrapeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setScrapeOpen(false)} />
          <div className="relative bg-white rounded-2xl p-5 w-full max-w-md space-y-3">
            <h2 className="font-bold text-lg">Scrape from URL</h2>
            <input value={scrapeUrl} onChange={(e) => setScrapeUrl(e.target.value)} placeholder="https://..." className="w-full border rounded-xl px-3 py-2 text-sm" />
            <input value={scrapeName} onChange={(e) => setScrapeName(e.target.value)} placeholder="Optional name" className="w-full border rounded-xl px-3 py-2 text-sm" />
            <div className="flex gap-2">
              <button onClick={() => setScrapeOpen(false)} className="flex-1 border rounded-xl py-2 text-sm font-semibold">Cancel</button>
              <button onClick={handleScrape} className="flex-1 bg-slate-900 text-white rounded-xl py-2 text-sm font-semibold">Save to Blob</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
