import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { requireAuth } from "@/lib/auth-server";
import { nanoid } from "nanoid";
import type { CommentDoc } from "@/lib/types";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const scriptId = searchParams.get("scriptId");
  if (!scriptId) return NextResponse.json({ comments: [] });

  const snap = await adminDb
    .collection("comments")
    .where("scriptId", "==", scriptId)
    .get();
  const comments = snap.docs
    .map((d) => d.data() as CommentDoc)
    .sort((a, b) => b.createdAt - a.createdAt);

  return NextResponse.json({ comments });
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (!auth) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (auth.profile?.muted) {
    return NextResponse.json({ error: "akun kamu dibisukan" }, { status: 403 });
  }

  const { scriptId, text } = await req.json();
  if (!scriptId || !text?.trim()) {
    return NextResponse.json({ error: "field_required" }, { status: 400 });
  }

  const id = nanoid(8);
  const comment: CommentDoc = {
    id,
    scriptId,
    authorId: auth.uid,
    authorName: auth.profile?.displayName || "anonim",
    text: text.trim().slice(0, 1000),
    createdAt: Date.now(),
  };

  await adminDb.collection("comments").doc(id).set(comment);

  const scriptRef = adminDb.collection("scripts").doc(scriptId);
  const scriptSnap = await scriptRef.get();
  if (scriptSnap.exists) {
    const count = scriptSnap.data()?.commentCount || 0;
    await scriptRef.update({ commentCount: count + 1 });
  }

  return NextResponse.json({ ok: true, id });
}
