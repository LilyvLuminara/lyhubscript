"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ScriptCard from "@/components/ScriptCard";
import Filters, { FilterState } from "@/components/Filters";
import type { ScriptDoc } from "@/lib/types";

function ExploreInner() {
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") || "");
  const [filters, setFilters] = useState<FilterState>({
    status: "all",
    access: "all",
    sort: params.get("sort") || "newest",
  });
  const [scripts, setScripts] = useState<ScriptDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    const qs = new URLSearchParams({
      q,
      status: filters.status,
      access: filters.access,
      sort: filters.sort,
    });
    fetch(`/api/scripts?${qs.toString()}`, { signal: controller.signal })
      .then((r) => r.json())
      .then((data) => setScripts(data.scripts || []))
      .catch(() => {})
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [q, filters]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-6">
        <h1 className="font-mono text-2xl font-bold mb-1">Jelajah Skrip</h1>
        <p className="font-mono text-sm text-ash">{scripts.length} skrip ditemukan</p>
      </div>

      <div className="mb-6">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="cari nama skrip, game, atau developer..."
          className="w-full bg-void border border-line px-4 py-2.5 font-mono text-sm outline-none focus:border-paper"
        />
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <Filters value={filters} onChange={setFilters} />
        <div className="flex-1">
          {loading ? (
            <p className="font-mono text-sm text-ash">memuat...</p>
          ) : scripts.length === 0 ? (
            <p className="font-mono text-sm text-ash">Tidak ada skrip yang cocok.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {scripts.map((s) => (
                <ScriptCard key={s.id} script={s} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="p-10 font-mono text-ash">memuat...</div>}>
      <ExploreInner />
    </Suspense>
  );
}
