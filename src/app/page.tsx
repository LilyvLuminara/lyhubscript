import Link from "next/link";
import { adminDb } from "@/lib/firebaseAdmin";
import type { ScriptDoc } from "@/lib/types";
import ScriptCard from "@/components/ScriptCard";
import TerminalHero from "@/components/TerminalHero";

async function getStats() {
  try {
    const snap = await adminDb
      .collection("scripts")
      .where("published", "==", true)
      .get();
    const scripts = snap.docs.map((d) => d.data() as ScriptDoc);
    const trending = [...scripts].sort((a, b) => b.upvotes - a.upvotes).slice(0, 6);
    const latest = [...scripts].sort((a, b) => b.createdAt - a.createdAt).slice(0, 6);
    return { total: scripts.length, trending, latest };
  } catch (err) {
    console.error("HOME STATS ERROR:", err);
    return { total: 0, trending: [] as ScriptDoc[], latest: [] as ScriptDoc[] };
  }
}

export default async function HomePage() {
  const { total, trending, latest } = await getStats();

  return (
    <div>
      <section className="max-w-6xl mx-auto px-4 pt-16 pb-20 text-center">
        <p className="font-mono text-xs text-ash uppercase tracking-[0.2em] mb-4">
          Script hub — terverifikasi komunitas
        </p>
        <h1 className="font-mono text-4xl md:text-5xl font-bold tracking-tight mb-8">
          Satu baris kode.
          <br />
          Semua game.
        </h1>
        <TerminalHero scriptCount={total} />
        <div className="flex items-center justify-center gap-4 mt-10">
          <Link
            href="/explore"
            className="border border-paper px-6 py-2.5 font-mono text-sm hover:bg-paper hover:text-ink transition-colors"
          >
            jelajahi skrip
          </Link>
          <Link
            href="/upload"
            className="border border-line px-6 py-2.5 font-mono text-sm text-ash hover:border-paper hover:text-paper transition-colors"
          >
            upload skrip →
          </Link>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-10 border-t border-line">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-mono text-sm uppercase tracking-wider text-ash">
            Trending sekarang
          </h2>
          <Link href="/explore?sort=popular" className="font-mono text-xs text-ash hover:text-paper">
            lihat semua →
          </Link>
        </div>
        {trending.length === 0 ? (
          <p className="font-mono text-sm text-ash">Belum ada skrip. Jadilah yang pertama upload.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {trending.map((s) => (
              <ScriptCard key={s.id} script={s} />
            ))}
          </div>
        )}
      </section>

      <section className="max-w-6xl mx-auto px-4 py-10 border-t border-line pb-20">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-mono text-sm uppercase tracking-wider text-ash">Terbaru</h2>
          <Link href="/explore?sort=newest" className="font-mono text-xs text-ash hover:text-paper">
            lihat semua →
          </Link>
        </div>
        {latest.length === 0 ? (
          <p className="font-mono text-sm text-ash">—</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {latest.map((s) => (
              <ScriptCard key={s.id} script={s} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
