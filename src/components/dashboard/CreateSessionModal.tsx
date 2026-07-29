"use client";

import { useState, useEffect, useRef } from "react";
import {
  getResumes,
  getDocuments,
  addResumeFromFile,
  addDocumentFromFile,
  type KnowledgeItem,
} from "@/lib/knowledgeStore";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreate?: (data: SessionForm) => void;
  onUpdate?: (id: string, data: SessionForm) => void;
  /** When set, modal is in edit mode and prefilled */
  initialData?: Partial<SessionForm> & { id?: string };
  mode?: "create" | "edit";
};

export type SessionForm = {
  type: "interview" | "regular";
  company: string;
  jobDescription: string;
  model: string;
  language: string;
  autoAnswer: boolean;
  saveTranscript: boolean;
  selectedResumes: KnowledgeItem[];
  selectedDocuments: KnowledgeItem[];
  extraContext: string;
};

export default function CreateSessionModal({
  open,
  onClose,
  onCreate,
  onUpdate,
  initialData,
  mode = "create",
}: Props) {
  const isEdit = mode === "edit";
  const [type, setType] = useState<"interview" | "regular">("interview");
  const [company, setCompany] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [model, setModel] = useState("GPT-5.5");
  const [language, setLanguage] = useState("English");
  const [autoAnswer, setAutoAnswer] = useState(true);
  const [saveTranscript, setSaveTranscript] = useState(true);
  const [selectedResumes, setSelectedResumes] = useState<KnowledgeItem[]>([]);
  const [selectedDocuments, setSelectedDocuments] = useState<KnowledgeItem[]>([]);
  const [extraContext, setExtraContext] = useState("");
  const [showExtraContext, setShowExtraContext] = useState(false);
  const [resumePicker, setResumePicker] = useState(false);
  const [docPicker, setDocPicker] = useState(false);
  const [resumes, setResumes] = useState<KnowledgeItem[]>([]);
  const [documents, setDocuments] = useState<KnowledgeItem[]>([]);
  const resumeFileRef = useRef<HTMLInputElement>(null);
  const docFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setType(initialData?.type || "interview");
      setCompany(initialData?.company || "");
      setJobDescription(initialData?.jobDescription || "");
      setModel(initialData?.model || "GPT-5.5");
      setLanguage(initialData?.language || "English");
      setAutoAnswer(initialData?.autoAnswer ?? true);
      setSaveTranscript(initialData?.saveTranscript ?? true);
      setSelectedResumes(initialData?.selectedResumes || []);
      setSelectedDocuments(initialData?.selectedDocuments || []);
      setExtraContext(initialData?.extraContext || "");
      setShowExtraContext(Boolean(initialData?.extraContext));
      setResumePicker(false);
      setDocPicker(false);
      setResumes(getResumes());
      setDocuments(getDocuments());
    }
  }, [open, initialData]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  const toggleResume = (item: KnowledgeItem) => {
    setSelectedResumes((prev) =>
      prev.some((r) => r.id === item.id)
        ? prev.filter((r) => r.id !== item.id)
        : [...prev, item]
    );
  };

  const toggleDoc = (item: KnowledgeItem) => {
    setSelectedDocuments((prev) =>
      prev.some((d) => d.id === item.id)
        ? prev.filter((d) => d.id !== item.id)
        : [...prev, item]
    );
  };

  const uploadResumeFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    for (const file of Array.from(files)) {
      const item = await addResumeFromFile(file);
      setResumes(getResumes());
      setSelectedResumes((prev) => [...prev, item]);
    }
    if (resumeFileRef.current) resumeFileRef.current.value = "";
  };

  const uploadDocFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    for (const file of Array.from(files)) {
      const item = await addDocumentFromFile(file);
      setDocuments(getDocuments());
      setSelectedDocuments((prev) => [...prev, item]);
    }
    if (docFileRef.current) docFileRef.current.value = "";
  };

  const handleSubmit = () => {
    const payload = {
      type,
      company,
      jobDescription,
      model,
      language,
      autoAnswer,
      saveTranscript,
      selectedResumes,
      selectedDocuments,
      extraContext,
    };
    if (isEdit && initialData?.id && onUpdate) {
      onUpdate(initialData.id, payload);
    } else {
      onCreate?.(payload);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <h2 className="text-lg font-bold text-slate-900">
            {isEdit ? "Edit Session" : "Create Session"}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-5 pb-5 space-y-5">
          {/* Session Type */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-slate-700">Session Type</label>
              <span className="text-xs text-slate-500">Video Tutorial</span>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setType("interview")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium border transition ${
                  type === "interview"
                    ? "bg-white border-slate-300 text-slate-900 shadow-sm"
                    : "bg-slate-50 border-transparent text-slate-500"
                }`}
              >
                Interview
              </button>
              <button
                type="button"
                onClick={() => setType("regular")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium border transition ${
                  type === "regular"
                    ? "bg-white border-slate-300 text-slate-900 shadow-sm"
                    : "bg-slate-50 border-transparent text-slate-500"
                }`}
              >
                Regular Call
              </button>
            </div>
          </div>

          {/* Company */}
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1.5 block">Company</label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. Microsoft"
              className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>

          {/* Job Description */}
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1.5 block">Job Description</label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={3}
              placeholder="Paste job description..."
              className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-y min-h-[80px]"
            />
          </div>

          {/* Context */}
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">Context</label>

            {/* Selected chips */}
            {(selectedResumes.length > 0 || selectedDocuments.length > 0) && (
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedResumes.map((r) => (
                  <span
                    key={r.id}
                    className="inline-flex items-center gap-1 pl-2.5 pr-1 py-1.5 rounded-full border border-slate-200 bg-slate-50 text-xs font-medium text-slate-700"
                  >
                    {r.name}
                    <button
                      type="button"
                      onClick={() => toggleResume(r)}
                      className="p-0.5 rounded-full hover:bg-slate-200 text-slate-400"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
                {selectedDocuments.map((d) => (
                  <span
                    key={d.id}
                    className="inline-flex items-center gap-1 pl-2.5 pr-1 py-1.5 rounded-full border border-slate-200 bg-slate-50 text-xs font-medium text-slate-700"
                  >
                    {d.name}
                    <button
                      type="button"
                      onClick={() => toggleDoc(d)}
                      className="p-0.5 rounded-full hover:bg-slate-200 text-slate-400"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setResumePicker((v) => !v);
                  setDocPicker(false);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition"
              >
                + Add Resume
              </button>
              <button
                type="button"
                onClick={() => {
                  setDocPicker((v) => !v);
                  setResumePicker(false);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-dashed border-slate-300 text-xs font-medium text-slate-500 hover:border-primary hover:text-primary transition"
              >
                + Add Documents
              </button>
              <button
                type="button"
                onClick={() => setShowExtraContext((v) => !v)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-dashed border-slate-300 text-xs font-medium text-slate-500 hover:border-primary hover:text-primary transition"
              >
                + Add Extra Context
              </button>
            </div>

            {/* Resume picker */}
            {resumePicker && (
              <div className="mt-2 border border-slate-200 rounded-xl p-3 space-y-2 bg-slate-50">
                <p className="text-xs font-medium text-slate-600">Select from your resumes</p>
                {resumes.length === 0 ? (
                  <p className="text-xs text-slate-400">No resumes yet — upload one below or on CVs & Resumes.</p>
                ) : (
                  <ul className="space-y-1 max-h-32 overflow-y-auto">
                    {resumes.map((r) => {
                      const on = selectedResumes.some((s) => s.id === r.id);
                      return (
                        <li key={r.id}>
                          <button
                            type="button"
                            onClick={() => toggleResume(r)}
                            className={`w-full text-left text-xs px-2 py-1.5 rounded-lg ${
                              on ? "bg-primary/10 text-primary font-medium" : "hover:bg-white text-slate-700"
                            }`}
                          >
                            {on ? "✓ " : ""}
                            {r.name}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
                <input
                  ref={resumeFileRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  className="hidden"
                  onChange={(e) => uploadResumeFiles(e.target.files)}
                />
                <button
                  type="button"
                  onClick={() => resumeFileRef.current?.click()}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  Upload new resume
                </button>
              </div>
            )}

            {/* Document picker */}
            {docPicker && (
              <div className="mt-2 border border-slate-200 rounded-xl p-3 space-y-2 bg-slate-50">
                <p className="text-xs font-medium text-slate-600">Select from your documents</p>
                {documents.length === 0 ? (
                  <p className="text-xs text-slate-400">No documents yet — upload one below or on Documents.</p>
                ) : (
                  <ul className="space-y-1 max-h-32 overflow-y-auto">
                    {documents.map((d) => {
                      const on = selectedDocuments.some((s) => s.id === d.id);
                      return (
                        <li key={d.id}>
                          <button
                            type="button"
                            onClick={() => toggleDoc(d)}
                            className={`w-full text-left text-xs px-2 py-1.5 rounded-lg ${
                              on ? "bg-primary/10 text-primary font-medium" : "hover:bg-white text-slate-700"
                            }`}
                          >
                            {on ? "✓ " : ""}
                            {d.name}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
                <input
                  ref={docFileRef}
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.txt,.md"
                  className="hidden"
                  onChange={(e) => uploadDocFiles(e.target.files)}
                />
                <button
                  type="button"
                  onClick={() => docFileRef.current?.click()}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  Upload new document
                </button>
              </div>
            )}

            {showExtraContext && (
              <textarea
                value={extraContext}
                onChange={(e) => setExtraContext(e.target.value)}
                rows={3}
                placeholder="Any extra notes for the AI..."
                className="mt-2 w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y"
              />
            )}
          </div>

          {/* Output Settings */}
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">Output Settings</label>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 text-xs font-medium text-slate-700">
                {model}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 text-xs font-medium text-slate-700">
                {language}
              </span>
            </div>
          </div>

          {/* Behavior */}
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">Behavior</label>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoAnswer}
                  onChange={(e) => setAutoAnswer(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-primary"
                />
                Auto Answer (Beta)
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={saveTranscript}
                  onChange={(e) => setSaveTranscript(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-primary"
                />
                Save Transcript
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold disabled:opacity-50"
            >
              {isEdit ? "Update Session" : "Create Session"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
