import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { requireAuth } from "@/lib/auth-server";
import { slugify } from "@/lib/utils";
import { nanoid } from "nanoid";
import type { ScriptDoc } from "@/lib/types";


export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").toLowerCase();
  const status = searchParams.get("status") || "all";
  const access = searchParams.get("access") || "all";
  const game = searchParams.get("game");
  const sort = searchParams.get("sort") || "newest";

  try {
    let query = adminDb.collection("scripts").where("published", "==", true) as any;
    if (game) query = query.where("gameSlug", "==", slugify(game));

    const snap = await query.get();
    let scripts = snap.docs.map((d: any) => d.data() as ScriptDoc);

    if (status !== "all") scripts = scripts.filter((s) => s.status === status);
    if (access !== "all") scripts = scripts.filter((s) => s.access === access);
    if (q) {
      scripts = scripts.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.game.toLowerCase().includes(q) ||
          s.authorName.toLowerCase().includes(q)
      );
    }

    if (sort === "popular") scripts.sort((a, b) => b.upvotes - a.upvotes);
    else if (sort === "views") scripts.sort((a, b) => b.views - a.views);
    else scripts.sort((a, b) => b.createdAt - a.createdAt);

    return NextResponse.json({ scripts });
  } catch (err) {
    return NextResponse.json({ scripts: [], error: "query_failed" }, { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (!auth) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (auth.profile?.muted)
    return NextResponse.json({ error: "akun kamu dibisukan" }, { status: 403 });

  const body = await req.json();
  const { title, description, game, code, status, access, scope, keyLink } = body;

  if (!title || !game || !code) {
    return NextResponse.json({ error: "field wajib belum lengkap" }, { status: 400 });
  }

  const id = nanoid(8);
  const rawToken = nanoid(32);
  const now = Date.now();
  const doc: ScriptDoc = {
    id,
    rawToken,
    title,
    description: description || "",
    game,
    gameSlug: slugify(game),
    code,
    versions: [{ version: 1, code, changelog: "Rilis awal", createdAt: now }],
    status: status || "unverified",
    access: access || "free",
    scope: scope || "game-specific",
    keyLink: access === "key" ? keyLink : null,
    authorId: auth.uid,
    authorName: auth.profile?.displayName || "anonim",
    views: 0,
    copies: 0,
    upvotes: 0,
    downvotes: 0,
    voters: {},
    commentCount: 0,
    createdAt: now,
    updatedAt: now,
    published: false, // enters moderation queue; admin must approve via /admin/scripts
    flagged: false,
  };

  await adminDb.collection("scripts").doc(id).set(doc);
  return NextResponse.json({ id });
}
