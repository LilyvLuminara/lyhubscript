"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

export default function UploadPage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    description: "",
    game: "",
    code: "",
    status: "unverified",
    access: "free",
    scope: "game-specific",
    keyLink: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (loading) return <div className="p-10 font-mono text-ash">memuat...</div>;

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <p className="font-mono text-sm text-ash mb-4">
          Kamu harus masuk dulu untuk mengunggah skrip.
        </p>
        <a
          href="/login"
          className="border border-paper px-5 py-2 font-mono text-sm hover:bg-paper hover:text-ink"
        >
          masuk
        </a>
      </div>
    );
  }

  if (profile?.banned) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center font-mono text-sm text-ash">
        Akun kamu diblokir dan tidak dapat mengunggah skrip.
      </div>
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.title || !form.game || !form.code) {
      setError("Judul, game, dan kode skrip wajib diisi.");
      return;
    }
    setSubmitting(true);
    try {
      const token = await user!.getIdToken();
      const res = await fetch("/api/scripts", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Gagal mengunggah skrip.");
        return;
      }
      const data = await res.json();
      router.push(`/upload/success?id=${data.id}`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="font-mono text-2xl font-bold mb-1">Upload Skrip</h1>
      <p className="font-mono text-sm text-ash mb-8">
        Skrip akan masuk antrean moderasi sebelum tampil publik.
      </p>

      {error && (
        <div className="border border-line p-3 mb-4 font-mono text-sm text-smoke">{error}</div>
      )}

      <form onSubmit={submit} className="space-y-5 font-mono text-sm">
        <div>
          <label className="block text-ash text-xs uppercase tracking-wider mb-1">Judul</label>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full bg-void border border-line px-3 py-2 outline-none focus:border-paper"
          />
        </div>
        <div>
          <label className="block text-ash text-xs uppercase tracking-wider mb-1">
            Nama Game
          </label>
          <input
            value={form.game}
            onChange={(e) => setForm({ ...form, game: e.target.value })}
            placeholder="Blox Fruits"
            className="w-full bg-void border border-line px-3 py-2 outline-none focus:border-paper"
          />
        </div>
        <div>
          <label className="block text-ash text-xs uppercase tracking-wider mb-1">
            Deskripsi
          </label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            className="w-full bg-void border border-line px-3 py-2 outline-none focus:border-paper"
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-ash text-xs uppercase tracking-wider mb-1">
              Status
            </label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full bg-void border border-line px-2 py-2"
            >
              <option value="unverified">Belum diverifikasi</option>
              <option value="working">Working</option>
              <option value="patched">Patched</option>
            </select>
          </div>
          <div>
            <label className="block text-ash text-xs uppercase tracking-wider mb-1">Akses</label>
            <select
              value={form.access}
              onChange={(e) => setForm({ ...form, access: e.target.value })}
              className="w-full bg-void border border-line px-2 py-2"
            >
              <option value="free">Free</option>
              <option value="key">Key System</option>
              <option value="paid">Paid</option>
            </select>
          </div>
          <div>
            <label className="block text-ash text-xs uppercase tracking-wider mb-1">Lingkup</label>
            <select
              value={form.scope}
              onChange={(e) => setForm({ ...form, scope: e.target.value })}
              className="w-full bg-void border border-line px-2 py-2"
            >
              <option value="game-specific">Game-specific</option>
              <option value="universal">Universal</option>
            </select>
          </div>
        </div>

        {form.access === "key" && (
          <div>
            <label className="block text-ash text-xs uppercase tracking-wider mb-1">
              Link Key System
            </label>
            <input
              value={form.keyLink}
              onChange={(e) => setForm({ ...form, keyLink: e.target.value })}
              className="w-full bg-void border border-line px-3 py-2 outline-none focus:border-paper"
            />
          </div>
        )}

        <div>
          <label className="block text-ash text-xs uppercase tracking-wider mb-1">
            Kode Lua/LuaU
          </label>
          <textarea
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value })}
            rows={12}
            placeholder="-- tempel kode skrip kamu di sini"
            className="w-full bg-void border border-line px-3 py-2 outline-none focus:border-paper font-mono"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="border border-paper px-6 py-2.5 hover:bg-paper hover:text-ink transition-colors disabled:opacity-40"
        >
          {submitting ? "mengirim..." : "kirim untuk moderasi"}
        </button>
      </form>
    </div>
  );
}
