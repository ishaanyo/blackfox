/** Client-side knowledge helpers — uploads go to Vercel Blob via API. */

import { uploadToBlob } from "@/lib/blobUpload";

export type KnowledgeItem = {
  id: string;
  name: string;
  kind: "uploaded" | "created" | "scraped";
  fileType?: string;
  size?: number;
  content?: string;
  fileUrl?: string | null;
  dataUrl?: string;
  createdAt: string;
};

const RESUMES_KEY = "blackfox_resumes";
const DOCS_KEY = "blackfox_documents";

function read(key: string): KnowledgeItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    return JSON.parse(raw) as KnowledgeItem[];
  } catch {
    return [];
  }
}

function write(key: string, items: KnowledgeItem[]) {
  if (typeof window === "undefined") return;
  const slim = items.map(({ dataUrl: _d, ...rest }) => rest);
  localStorage.setItem(key, JSON.stringify(slim));
  window.dispatchEvent(new CustomEvent("blackfox-knowledge-changed", { detail: { key } }));
}

export function getResumes(): KnowledgeItem[] {
  return read(RESUMES_KEY);
}

export function getDocuments(): KnowledgeItem[] {
  return read(DOCS_KEY);
}

export function addResume(
  item: Omit<KnowledgeItem, "id" | "createdAt"> & { id?: string }
): KnowledgeItem {
  const full: KnowledgeItem = {
    ...item,
    id: item.id || `resume-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
  };
  const { dataUrl: _d, ...meta } = full;
  write(RESUMES_KEY, [meta as KnowledgeItem, ...getResumes()]);
  return full;
}

export function addDocument(
  item: Omit<KnowledgeItem, "id" | "createdAt"> & { id?: string }
): KnowledgeItem {
  const full: KnowledgeItem = {
    ...item,
    id: item.id || `doc-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
  };
  const { dataUrl: _d, ...meta } = full;
  write(DOCS_KEY, [meta as KnowledgeItem, ...getDocuments()]);
  return full;
}

/** Upload resume to Vercel Blob + keep a local cache entry for the session picker. */
export async function addResumeFromFile(file: File): Promise<KnowledgeItem> {
  const result = await uploadToBlob(file, "resume");
  const item = addResume({
    id: result.id,
    name: result.name,
    kind: "uploaded",
    fileType: result.fileType,
    size: result.size,
    fileUrl: result.url,
  });
  return item;
}

/** Upload document to Vercel Blob + keep a local cache entry for the session picker. */
export async function addDocumentFromFile(file: File): Promise<KnowledgeItem> {
  const result = await uploadToBlob(file, "document");
  const item = addDocument({
    id: result.id,
    name: result.name,
    kind: "uploaded",
    fileType: result.fileType,
    size: result.size,
    fileUrl: result.url,
  });
  return item;
}

export function removeResume(id: string) {
  write(
    RESUMES_KEY,
    getResumes().filter((r) => r.id !== id)
  );
}

export function removeDocument(id: string) {
  write(
    DOCS_KEY,
    getDocuments().filter((d) => d.id !== id)
  );
}

export function formatBytes(bytes?: number) {
  if (bytes == null) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatDate(iso: string) {
  const d = new Date(iso);
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

export function fileExtLabel(name: string, mime?: string) {
  const ext = name.split(".").pop()?.toUpperCase();
  if (ext && ext.length <= 5) return ext;
  if (mime?.includes("pdf")) return "PDF";
  if (mime?.includes("text")) return "TXT";
  return "FILE";
}

export async function downloadItem(item: KnowledgeItem) {
  if (item.fileUrl) {
    window.open(item.fileUrl, "_blank");
    return;
  }
  if (item.content) {
    const textBlob = new Blob([item.content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(textBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = item.name.endsWith(".txt") ? item.name : `${item.name}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    return;
  }
  alert("File is not available for download. Re-upload it from Documents or CVs & Resumes.");
}
