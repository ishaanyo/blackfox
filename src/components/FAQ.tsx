"use client";

import { useState } from "react";

const faqs = [
  "What languages does BlackfoxAI support?",
  "Can BlackfoxAI listen in one language and respond in another?",
  "Does BlackfoxAI have keyboard shortcuts?",
  "Does BlackfoxAI support coding calls?",
  "Can I use headphones during the call?",
  "Can I provide extra context to BlackfoxAI during the call?",
  "Does BlackfoxAI have a mobile app?",
  "Can I use the mobile version on a laptop?",
  "Can I use BlackfoxAI on both desktop and mobile at the same time?",
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-16 px-4 sm:px-6 bg-white">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-2">
          Frequently Asked Questions
        </h2>
        <p className="text-center text-slate-500 text-sm mb-10">Support</p>

        <div className="space-y-2">
          {faqs.map((q, i) => (
            <div
              key={i}
              className="border border-border rounded-xl overflow-hidden"
            >
              <button
                className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-medium text-slate-800 hover:bg-slate-50 transition"
                onClick={() => setOpen(open === i ? null : i)}
              >
                {q}
                <svg
                  className={`w-5 h-5 text-slate-400 transition-transform ${
                    open === i ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {open === i && (
                <div className="px-5 pb-4 text-sm text-slate-600 leading-relaxed border-t border-border pt-3">
                  BlackfoxAI supports a wide range of languages and platforms.
                  For the most up-to-date details, please check the dashboard or
                  contact support.
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
