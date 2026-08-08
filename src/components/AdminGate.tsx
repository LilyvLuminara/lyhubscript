"use client";

import { ReactNode } from "react";
import { useAuth } from "@/components/AuthProvider";
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminGate({ children }: { children: ReactNode }) {
  const { profile, loading } = useAuth();

  if (loading) return <div className="p-10 font-mono text-ash">memuat...</div>;

  if (!profile || (profile.role !== "admin" && profile.role !== "moderator")) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center font-mono text-sm text-ash">
        Kamu tidak memiliki akses ke halaman ini.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col md:flex-row gap-8">
      <AdminSidebar />
      <div className="flex-1">{children}</div>
    </div>
  );
}
