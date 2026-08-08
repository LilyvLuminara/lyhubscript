import { adminDb } from "@/lib/firebaseAdmin";
import type { ScriptDoc } from "@/lib/types";
import ScriptCard from "@/components/ScriptCard";

async function getScriptsForGame(slug: string) {
  try {
    const snap = await adminDb
      .collection("scripts")
      .where("published", "==", true)
      .where("gameSlug", "==", slug)
      .get();
    return snap.docs.map((d) => d.data() as ScriptDoc).sort((a, b) => b.upvotes - a.upvotes);
  } catch {
    return [];
  }
}

export default async function GameDetailPage({ params }: { params: { slug: string } }) {
  const scripts = await getScriptsForGame(params.slug);
  const gameName = scripts[0]?.game || params.slug.replace(/-/g, " ");

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="font-mono text-2xl font-bold mb-1 capitalize">{gameName}</h1>
      <p className="font-mono text-sm text-ash mb-8">{scripts.length} skrip tersedia</p>

      {scripts.length === 0 ? (
        <p className="font-mono text-sm text-ash">Belum ada skrip untuk game ini.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {scripts.map((s) => (
            <ScriptCard key={s.id} script={s} />
          ))}
        </div>
      )}
    </div>
  );
}
