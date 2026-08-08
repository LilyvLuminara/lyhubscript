"use client";

import { useEffect, useState } from "react";
import AdminGate from "@/components/AdminGate";
import { useAuth } from "@/components/AuthProvider";
import type { UserProfile } from "@/lib/types";

export default function AdminUsersPage() {
  const { user, profile: myProfile } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  async function load() {
    if (!user) return;
    setLoading(true);
    const token = await user.getIdToken();
    const res = await fetch("/api/admin/users", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setUsers(data.users || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [user]);

  async function update(uid: string, patch: Record<string, any>) {
    if (!user) return;
    const token = await user.getIdToken();
    await fetch(`/api/admin/users/${uid}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(patch),
    });
    load();
  }

  const visible = users.filter(
    (u) =>
      u.displayName.toLowerCase().includes(q.toLowerCase()) ||
      u.email.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <AdminGate>
      <h1 className="font-mono text-2xl font-bold mb-6">Pengguna</h1>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="cari nama atau email..."
        className="w-full bg-void border border-line px-3 py-2 font-mono text-sm mb-6 outline-none focus:border-paper"
      />

      {loading ? (
        <p className="font-mono text-sm text-ash">memuat...</p>
      ) : (
        <div className="space-y-2 font-mono text-sm">
          {visible.map((u) => (
            <div
              key={u.uid}
              className="border border-line p-3 flex items-center justify-between flex-wrap gap-3"
            >
              <div>
                <p className="font-semibold">{u.displayName}</p>
                <p className="text-ash text-xs">
                  {u.email} — {u.role}
                  {u.banned && " — DIBLOKIR"}
                  {u.muted && " — DIBISUKAN"}
                </p>
              </div>
              <div className="flex gap-2">
                {myProfile?.role === "admin" && (
                  <select
                    value={u.role}
                    onChange={(e) => update(u.uid, { role: e.target.value })}
                    className="bg-ink border border-line px-2 py-1 text-xs"
                  >
                    <option value="user">user</option>
                    <option value="moderator">moderator</option>
                    <option value="admin">admin</option>
                  </select>
                )}
                <button
                  onClick={() => update(u.uid, { muted: !u.muted })}
                  className="border border-line px-2 py-1 text-xs hover:border-paper"
                >
                  {u.muted ? "buka bisu" : "bisukan"}
                </button>
                <button
                  onClick={() => update(u.uid, { banned: !u.banned })}
                  className="border border-line px-2 py-1 text-xs hover:border-paper"
                >
                  {u.banned ? "buka blokir" : "blokir"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminGate>
  );
}
