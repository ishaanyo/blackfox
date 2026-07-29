"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Logo } from "../Icons";

const workspaceLinks = [
  {
    href: "/dashboard",
    label: "Call Sessions",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
      </svg>
    ),
  },
  {
    href: "/dashboard/resumes",
    label: "CVs & Resumes",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    href: "/dashboard/documents",
    label: "Documents",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  },
];

const supportLinks = [
  {
    href: "/dashboard/tutorials",
    label: "Tutorials",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    href: "/dashboard/support",
    label: "Support Chat",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
];

function getInitials(name?: string | null, email?: string | null) {
  if (name?.trim()) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }
  if (email) return email.slice(0, 2).toUpperCase();
  return "?";
}

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const userName = session?.user?.name || "User";
  const userEmail = session?.user?.email || "";
  const initials = getInitials(session?.user?.name, session?.user?.email);

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);

  return (
    <aside className="w-56 shrink-0 border-r border-slate-200 bg-white flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="h-14 flex items-center gap-2 px-4 border-b border-slate-100">
        <Logo className="w-7 h-7" />
        <span className="font-bold text-slate-900 text-sm">
          Blackfox<span className="text-primary">AI</span>
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        <div>
          <p className="px-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Workspace
          </p>
          <ul className="space-y-0.5">
            {workspaceLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium transition ${
                    isActive(link.href)
                      ? "bg-slate-100 text-slate-900"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="px-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Support
          </p>
          <ul className="space-y-0.5">
            {supportLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium transition ${
                    isActive(link.href)
                      ? "bg-slate-100 text-slate-900"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Bottom section */}
      <div className="px-3 pb-3 space-y-3 border-t border-slate-100 pt-3">
        {/* Free Plan card */}
        <div className="rounded-xl border border-slate-200 p-3 bg-slate-50/50">
          <div className="flex items-center justify-between mb-1">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-green-700">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
              </svg>
              Free Plan
            </span>
            <button className="text-slate-400 hover:text-slate-600">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
          </div>
          <p className="text-[11px] text-slate-500 leading-snug mb-2.5">
            Start a 10 min free session or buy credits for full-length calls.
          </p>
          <button className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold py-2 rounded-lg transition">
            Upgrade
          </button>
        </div>

        <button className="flex items-center gap-2 w-full px-2.5 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Open Desktop App
        </button>

        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-2 w-full px-2.5 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Log Out
        </button>

        {/* User — from session */}
        <div className="flex items-center gap-2.5 px-2 py-2 border-t border-slate-100 pt-3">
          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-900 truncate">
              {userName}
            </p>
            {userEmail && (
              <p className="text-[10px] text-slate-400 truncate">
                {userEmail}
              </p>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
