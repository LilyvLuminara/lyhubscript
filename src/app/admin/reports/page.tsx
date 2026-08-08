"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminGate from "@/components/AdminGate";
import { useAuth } from "@/components/AuthProvider";
import type { ReportDoc } from "@/lib/types";
import { timeAgo } from "@/lib/utils";

const reasonLabel: Record<string, string> = {
  patched: "Sudah patched",
  malware: "Backdoor/logger/stealer",
  misleading: "Deskripsi menyesatkan",
  other: "Lainnya",
};

export default function AdminReportsPage() {
  const { user } = useAuth();
  const [reports, setReports] = useState<ReportDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"open" | "all">("open");

  async function load() {
    if (!user) return;
    setLoading(true);
    const token = await user.getIdToken();
    const res = await fetch("/api/admin/reports", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setReports(data.reports || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [user]);

  async function act(id: string, status: "resolved" | "dismissed") {
    if (!user) return;
    const token = await user.getIdToken();
    await fetch(`/api/admin/reports/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    });
    load();
  }

  const visible = filter === "open" ? reports.filter((r) => r.status === "open") : reports;

  return (
    <AdminGate>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-mono text-2xl font-bold">Laporan</h1>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          className="bg-void border border-line px-2 py-1.5 font-mono text-sm"
        >
          <option value="open">Terbuka</option>
          <option value="all">Semua</option>
        </select>
      </div>

      {loading ? (
        <p className="font-mono text-sm text-ash">memuat...</p>
      ) : visible.length === 0 ? (
        <p className="font-mono text-sm text-ash">Tidak ada laporan.</p>
      ) : (
        <div className="space-y-3">
          {visible.map((r) => (
            <div key={r.id} className="border border-line p-4">
              <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                <Link
                  href={`/scripts/${r.scriptId}`}
                  className="font-mono text-sm font-semibold hover:underline"
                >
                  {r.scriptTitle}
                </Link>
                <span className="font-mono text-xs text-ash">{timeAgo(r.createdAt)}</span>
              </div>
              <p className="font-mono text-xs text-smoke mb-1">
                {reasonLabel[r.reason] || r.reason} — dilaporkan oleh {r.reporterName}
              </p>
              {r.details && <p className="text-sm text-smoke mb-3">{r.details}</p>}
              <p className="font-mono text-xs text-ash mb-3">status: {r.status}</p>

              {r.status === "open" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => act(r.id, "resolved")}
                    className="font-mono text-xs border border-paper px-3 py-1.5 hover:bg-paper hover:text-ink"
                  >
                    ✓ tindak lanjuti
                  </button>
                  <button
                    onClick={() => act(r.id, "dismissed")}
                    className="font-mono text-xs border border-line px-3 py-1.5 text-ash hover:border-paper hover:text-paper"
                  >
                    ✕ tolak laporan
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </AdminGate>
  );
}
