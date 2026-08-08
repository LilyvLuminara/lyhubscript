import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { slugify } from "@/lib/utils";
import type { ScriptDoc } from "@/lib/types";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const game = searchParams.get("game");
  const status = searchParams.get("status") || "all";

  try {
    let query = adminDb.collection("scripts").where("published", "==", true) as any;
    if (game) query = query.where("gameSlug", "==", slugify(game));
    const snap = await query.get();
    let scripts = snap.docs.map((d: any) => d.data() as ScriptDoc);
    if (status !== "all") scripts = scripts.filter((s) => s.status === status);

    // Minimal shape for external executor hubs.
    const result = scripts.map((s) => ({
      id: s.id,
      title: s.title,
      game: s.game,
      status: s.status,
      access: s.access,
      rawUrl: `${process.env.NEXT_PUBLIC_SITE_URL || ""}/api/raw/${s.id}`,
    }));

    return NextResponse.json({ scripts: result });
  } catch {
    return NextResponse.json({ scripts: [] });
  }
}
