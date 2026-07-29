"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/Icons";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email: email.trim(), password }),
      });
      const data = await res.json();

      if (res.status === 409) {
        setError("Account already exists. Please sign in.");
        return;
      }
      if (!res.ok) {
        setError(data.error || "Signup failed");
        return;
      }

      const login = await signIn("credentials", {
        email: email.trim(),
        password,
        redirect: false,
        callbackUrl: "/dashboard",
      });

      if (login?.error) {
        setError("Account created — please sign in.");
        router.push("/login");
        return;
      }
      if (login?.ok) {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setLoading(true);
    await signIn("google", { callbackUrl: "/dashboard" });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-white px-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl p-8">
        <div className="flex flex-col items-center mb-8">
          <Logo className="w-12 h-12 mb-3" />
          <h1 className="text-2xl font-bold text-slate-900">
            Create your Blackfox<span className="text-primary">AI</span> account
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Start practicing interviews with AI
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-100 text-red-700 text-sm px-3 py-2">
            {error}
            {error.includes("already exists") && (
              <>
                {" "}
                <Link href="/login" className="font-semibold underline">
                  Go to login
                </Link>
              </>
            )}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              placeholder="At least 6 characters"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-dark disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl transition"
          >
            {loading ? "Creating account…" : "Sign up with Email"}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-2 text-slate-400">or</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGoogle}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-50 text-slate-800 font-semibold py-2.5 rounded-xl transition disabled:opacity-60"
        >
          Continue with Google
        </button>

        <p className="text-center text-sm text-slate-500 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-primary font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
