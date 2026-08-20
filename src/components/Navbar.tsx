"use client";

import { useState } from "react";
import { Logo, ArrowRight } from "./Icons";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const downloadUrl =
    "https://raw.githubusercontent.com/ishaanyo/blackfox/main/blackfox.exe";

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <a
          href="/"
          className="flex items-center gap-2 font-bold text-lg text-slate-900"
        >
          <Logo className="w-8 h-8" />
          Blackfox<span className="text-primary">AI</span>
        </a>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <a href="#features" className="hover:text-primary transition">
            Features
          </a>
          <a href="#reviews" className="hover:text-primary transition">
            Reviews
          </a>
          <a href="#privacy" className="hover:text-primary transition">
            Privacy
          </a>
          <a href="#pricing" className="hover:text-primary transition">
            Pricing
          </a>
          <a href="#desktop" className="hover:text-primary transition">
            Desktop App
          </a>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <a
            href="/dashboard"
            className="text-sm font-medium text-slate-600 hover:text-primary transition"
          >
            Dashboard
          </a>

          {/* Download button */}
          <a
            href={downloadUrl}
            download="blackfoxai.exe"
            className="inline-flex items-center gap-1.5 border border-slate-300 hover:border-primary text-slate-700 hover:text-primary text-sm font-semibold px-4 py-2 rounded-full transition"
          >
            Download
          </a>

          <a
            href="/dashboard"
            className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary-dark text-white text-sm font-semibold px-4 py-2 rounded-full transition shadow-sm shadow-green-200"
          >
            Get Started
            <ArrowRight />
          </a>
        </div>

        <button
          className="md:hidden p-2 rounded-lg hover:bg-slate-100"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {mobileOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-white px-4 py-4 space-y-3">
          {["Features", "Reviews", "Privacy", "Pricing", "Desktop App"].map(
            (item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(" ", "")}`}
                className="block text-sm font-medium text-slate-700 hover:text-primary"
                onClick={() => setMobileOpen(false)}
              >
                {item}
              </a>
            )
          )}

          <a
            href={downloadUrl}
            download="blackfoxai.exe"
            className="block w-full text-center border border-slate-300 text-slate-700 font-semibold py-2.5 rounded-full"
            onClick={() => setMobileOpen(false)}
          >
            Download App
          </a>

          <a
            href="/dashboard"
            className="block w-full text-center bg-primary text-white font-semibold py-2.5 rounded-full"
          >
            Get Started
          </a>
        </div>
      )}
    </header>
  );
}
