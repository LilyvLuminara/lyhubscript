"use client";

import { useEffect, useState } from "react";
import AdminGate from "@/components/AdminGate";
import { useAuth } from "@/components/AuthProvider";
import { StatusPill } from "@/components/StatusBadge";
import type { ScriptDoc } from "@/lib/types";
import { timeAgo } from "@/lib/utils";

export default function AdminScriptsPage() {
  const { user } = useAuth();
  const [scripts, setScripts] = useState<ScriptDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  async function load() {
    if (!user) return;
    setLoading(true);
    const token = await user.getIdToken();
    const res = await fetch("/api/admin/scripts", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setScripts(data.scripts || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [user]);

  async function act(id: string, action: "approve" | "reject") {
    if (!user) return;
    const token = await user.getIdToken();
    await fetch(`/api/admin/scripts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ action }),
    });
    load();
  }

  return (
    <AdminGate>
      <h1 className="font-mono text-2xl font-bold mb-1">Antrean Skrip</h1>
      <p className="font-mono text-sm text-ash mb-6">
        Tinjau skrip sebelum tampil publik di katalog.
      </p>

      {loading ? (
        <p className="font-mono text-sm text-ash">memuat...</p>
      ) : scripts.length === 0 ? (
        <p className="font-mono text-sm text-ash">Antrean kosong. Semua sudah ditinjau.</p>
      ) : (
        <div className="space-y-3">
          {scripts.map((s) => (
            <div key={s.id} className="border border-line p-4">
              <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                <div>
                  <StatusPill status={s.status} />
                  <span className="font-mono text-sm font-semibold ml-2">{s.title}</span>
                </div>
                <span className="font-mono text-xs text-ash">{timeAgo(s.createdAt)}</span>
              </div>
              <p className="font-mono text-xs text-ash mb-2">
                {s.game} — oleh {s.authorName}
              </p>
              <p className="text-sm text-smoke mb-3">{s.description}</p>

              <button
                onClick={() => setExpanded(expanded === s.id ? null : s.id)}
                className="font-mono text-xs text-ash underline mb-3"
              >
                {expanded === s.id ? "sembunyikan kode" : "lihat kode"}
              </button>
              {expanded === s.id && (
                <pre className="code-scroll overflow-x-auto bg-void border border-line p-3 text-xs font-mono mb-3 max-h-64">
                  {s.code}
                </pre>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => act(s.id, "approve")}
                  className="font-mono text-xs border border-paper px-3 py-1.5 hover:bg-paper hover:text-ink"
                >
                  ✓ setujui
                </button>
                <button
                  onClick={() => act(s.id, "reject")}
                  className="font-mono text-xs border border-line px-3 py-1.5 text-ash hover:border-paper hover:text-paper"
                >
                  ✕ tolak
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminGate>
  );
}
