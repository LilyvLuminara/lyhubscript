export const dynamic = "force-dynamic";
import Link from "next/link";
import { adminDb } from "@/lib/firebaseAdmin";
import type { ScriptDoc } from "@/lib/types";

async function getGameCounts() {
  try {
    const snap = await adminDb.collection("scripts").where("published", "==", true).get();
    const counts: Record<string, { game: string; slug: string; count: number }> = {};
    snap.docs.forEach((d) => {
      const s = d.data() as ScriptDoc;
      if (!counts[s.gameSlug]) counts[s.gameSlug] = { game: s.game, slug: s.gameSlug, count: 0 };
      counts[s.gameSlug].count++;
    });
    return Object.values(counts).sort((a, b) => b.count - a.count);
  } catch {
    return [];
  }
}

export default async function GamesPage() {
  const games = await getGameCounts();
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="font-mono text-2xl font-bold mb-1">Game</h1>
      <p className="font-mono text-sm text-ash mb-8">
        Jelajahi skrip berdasarkan game Roblox.
      </p>

      {games.length === 0 ? (
        <p className="font-mono text-sm text-ash">Belum ada game dengan skrip terdaftar.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {games.map((g) => (
            <Link
              key={g.slug}
              href={`/games/${g.slug}`}
              className="border border-line hover:border-paper p-4 text-center"
            >
              <p className="font-mono text-sm font-semibold">{g.game}</p>
              <p className="font-mono text-xs text-ash mt-1">{g.count} skrip</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
