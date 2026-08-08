"use client";

import { useState } from "react";
import { useAuth } from "./AuthProvider";

export default function ReportButton({ scriptId }: { scriptId: string }) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<"patched" | "malware" | "misleading" | "other">(
    "patched"
  );
  const [details, setDetails] = useState("");
  const [sent, setSent] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) {
      window.location.href = "/login";
      return;
    }
    const token = await user.getIdToken();
    await fetch("/api/report", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ scriptId, reason, details }),
    });
    setSent(true);
    setTimeout(() => {
      setOpen(false);
      setSent(false);
      setDetails("");
    }, 1200);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="font-mono text-xs text-ash border border-line px-3 py-1.5 hover:border-paper hover:text-paper"
      >
        ⚑ laporkan
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="border border-line bg-void w-full max-w-sm p-5">
            <h4 className="font-mono text-sm mb-4">Laporkan skrip ini</h4>
            {sent ? (
              <p className="font-mono text-sm text-smoke">Laporan terkirim. Terima kasih.</p>
            ) : (
              <form onSubmit={submit} className="space-y-3">
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value as any)}
                  className="w-full bg-ink border border-line px-2 py-1.5 font-mono text-sm"
                >
                  <option value="patched">Sudah patched / tidak berfungsi</option>
                  <option value="malware">Berisi backdoor / logger / stealer</option>
                  <option value="misleading">Deskripsi menyesatkan</option>
                  <option value="other">Lainnya</option>
                </select>
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Detail tambahan (opsional)"
                  rows={3}
                  className="w-full bg-ink border border-line px-2 py-1.5 font-mono text-sm outline-none focus:border-paper"
                />
                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="font-mono text-xs px-3 py-1.5 text-ash"
                  >
                    batal
                  </button>
                  <button
                    type="submit"
                    className="font-mono text-xs border border-paper px-3 py-1.5 hover:bg-paper hover:text-ink"
                  >
                    kirim laporan
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
