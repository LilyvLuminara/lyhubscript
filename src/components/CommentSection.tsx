"use client";

import { useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";
import type { CommentDoc } from "@/lib/types";
import { timeAgo } from "@/lib/utils";

export default function CommentSection({ scriptId }: { scriptId: string }) {
  const { user, profile } = useAuth();
  const [comments, setComments] = useState<CommentDoc[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch(`/api/comments?scriptId=${scriptId}`);
    const data = await res.json();
    setComments(data.comments || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [scriptId]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) {
      window.location.href = "/login";
      return;
    }
    if (!text.trim() || profile?.muted) return;
    setSending(true);
    const token = await user.getIdToken();
    await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ scriptId, text }),
    });
    setText("");
    setSending(false);
    load();
  }

  return (
    <div className="mt-8">
      <h3 className="font-mono text-sm text-ash uppercase tracking-wider mb-3">
        Diskusi ({comments.length})
      </h3>
      <form onSubmit={submit} className="mb-6">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={
            profile?.muted
              ? "Akun kamu dibisukan dan tidak bisa berkomentar."
              : "Apakah skrip ini masih bekerja untukmu?"
          }
          disabled={!!profile?.muted}
          rows={3}
          className="w-full bg-void border border-line px-3 py-2 text-sm font-mono outline-none focus:border-paper disabled:opacity-40"
        />
        <button
          type="submit"
          disabled={sending || !!profile?.muted}
          className="mt-2 border border-paper px-4 py-1.5 font-mono text-sm hover:bg-paper hover:text-ink transition-colors disabled:opacity-40"
        >
          kirim komentar
        </button>
      </form>

      {loading ? (
        <p className="text-ash font-mono text-sm">memuat...</p>
      ) : comments.length === 0 ? (
        <p className="text-ash font-mono text-sm">Belum ada komentar. Jadilah yang pertama.</p>
      ) : (
        <ul className="space-y-4">
          {comments.map((c) => (
            <li key={c.id} className="border-b border-line pb-3">
              <div className="flex items-center justify-between text-xs font-mono text-ash mb-1">
                <span className="text-smoke">{c.authorName}</span>
                <span>{timeAgo(c.createdAt)}</span>
              </div>
              <p className="text-sm">{c.text}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
