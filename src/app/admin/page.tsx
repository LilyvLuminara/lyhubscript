"use client";

import { useEffect, useState } from "react";
import AdminGate from "@/components/AdminGate";
import { useAuth } from "@/components/AuthProvider";

interface Stats {
  totalScripts: number;
  pending: number;
  totalUsers: number;
  openReports: number;
  totalViews: number;
  totalCopies: number;
}

export default function AdminOverviewPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const token = await user.getIdToken();
      const headers = { Authorization: `Bearer ${token}` };
      const [publicRes, pendingRes, reportsRes, usersRes] = await Promise.all([
        fetch("/api/scripts?status=all&access=all"),
        fetch("/api/admin/scripts", { headers }),
        fetch("/api/admin/reports", { headers }),
        fetch("/api/admin/users", { headers }),
      ]);
      const publicScripts = (await publicRes.json()).scripts || [];
      const pending = (await pendingRes.json()).scripts || [];
      const reports = (await reportsRes.json()).reports || [];
      const users = (await usersRes.json()).users || [];
      setStats({
        totalScripts: publicScripts.length,
        pending: pending.length,
        totalUsers: users.length,
        openReports: reports.filter((r: any) => r.status === "open").length,
        totalViews: publicScripts.reduce((s: number, x: any) => s + (x.views || 0), 0),
        totalCopies: publicScripts.reduce((s: number, x: any) => s + (x.copies || 0), 0),
      });
    })();
  }, [user]);

  return (
    <AdminGate>
      <h1 className="font-mono text-2xl font-bold mb-8">Overview</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 font-mono text-sm">
        <div className="border border-line p-4">
          <p className="text-ash text-xs uppercase mb-1">Total Skrip Publik</p>
          <p className="text-2xl font-bold">{stats?.totalScripts ?? "—"}</p>
        </div>
        <div className="border border-line p-4">
          <p className="text-ash text-xs uppercase mb-1">Antrean Moderasi</p>
          <p className="text-2xl font-bold">{stats?.pending ?? "—"}</p>
        </div>
        <div className="border border-line p-4">
          <p className="text-ash text-xs uppercase mb-1">Laporan Terbuka</p>
          <p className="text-2xl font-bold">{stats?.openReports ?? "—"}</p>
        </div>
        <div className="border border-line p-4">
          <p className="text-ash text-xs uppercase mb-1">Total Pengguna</p>
          <p className="text-2xl font-bold">{stats?.totalUsers ?? "—"}</p>
        </div>
        <div className="border border-line p-4">
          <p className="text-ash text-xs uppercase mb-1">Total Views</p>
          <p className="text-2xl font-bold">{stats?.totalViews ?? "—"}</p>
        </div>
        <div className="border border-line p-4">
          <p className="text-ash text-xs uppercase mb-1">Total Copy Code</p>
          <p className="text-2xl font-bold">{stats?.totalCopies ?? "—"}</p>
        </div>
      </div>
      <p className="font-mono text-xs text-ash mt-8">
        Untuk antrean moderasi dan laporan, cek menu di samping.
      </p>
    </AdminGate>
  );
}
