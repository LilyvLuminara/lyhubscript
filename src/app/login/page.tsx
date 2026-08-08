"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";

export default function LoginPage() {
  const { signInEmail, signInGoogle } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await signInEmail(email, password);
      router.push("/");
    } catch {
      setError("Email atau password salah.");
    } finally {
      setBusy(false);
    }
  }

  async function google() {
    setBusy(true);
    try {
      await signInGoogle();
      router.push("/");
    } catch {
      setError("Gagal masuk dengan Google.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto px-4 py-20">
      <h1 className="font-mono text-2xl font-bold mb-8 text-center">Masuk</h1>

      {error && <p className="font-mono text-xs text-ash mb-4 text-center">{error}</p>}

      <form onSubmit={submit} className="space-y-4 font-mono text-sm mb-6">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email"
          className="w-full bg-void border border-line px-3 py-2.5 outline-none focus:border-paper"
        />
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password"
          className="w-full bg-void border border-line px-3 py-2.5 outline-none focus:border-paper"
        />
        <button
          type="submit"
          disabled={busy}
          className="w-full border border-paper py-2.5 hover:bg-paper hover:text-ink transition-colors disabled:opacity-40"
        >
          masuk
        </button>
      </form>

      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-px bg-line" />
        <span className="font-mono text-xs text-ash">atau</span>
        <div className="flex-1 h-px bg-line" />
      </div>

      <button
        onClick={google}
        disabled={busy}
        className="w-full border border-line py-2.5 font-mono text-sm hover:border-paper transition-colors"
      >
        lanjutkan dengan Google
      </button>

      <p className="font-mono text-xs text-ash text-center mt-6">
        belum punya akun?{" "}
        <Link href="/register" className="text-paper underline">
          daftar
        </Link>
      </p>
    </div>
  );
}
