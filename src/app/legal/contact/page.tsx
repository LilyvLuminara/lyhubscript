"use client";

import { useState } from "react";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    // Simple mailto fallback — replace with a real endpoint / Firestore write if desired.
    window.location.href = `mailto:contact@lyhubscript.com?subject=Kontak dari ${encodeURIComponent(
      form.name
    )}&body=${encodeURIComponent(form.message + "\n\nBalas ke: " + form.email)}`;
    setSent(true);
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="font-mono text-2xl font-bold mb-6">Formulir Kontak</h1>
      {sent && (
        <p className="font-mono text-xs text-ash mb-4">
          Klien email kamu akan terbuka untuk mengirim pesan.
        </p>
      )}
      <form onSubmit={submit} className="space-y-4 font-mono text-sm">
        <input
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="nama"
          className="w-full bg-void border border-line px-3 py-2.5 outline-none focus:border-paper"
        />
        <input
          required
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="email"
          className="w-full bg-void border border-line px-3 py-2.5 outline-none focus:border-paper"
        />
        <textarea
          required
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          rows={5}
          placeholder="pesan"
          className="w-full bg-void border border-line px-3 py-2.5 outline-none focus:border-paper"
        />
        <button
          type="submit"
          className="border border-paper px-6 py-2.5 hover:bg-paper hover:text-ink transition-colors"
        >
          kirim
        </button>
      </form>
    </div>
  );
}
