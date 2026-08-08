import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { requireAuth } from "@/lib/auth-server";
import type { ScriptDoc } from "@/lib/types";

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (!auth) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { scriptId, direction } = await req.json(); // direction: 1, -1, or 0
  if (![1, -1, 0].includes(direction)) {
    return NextResponse.json({ error: "invalid_direction" }, { status: 400 });
  }

  const ref = adminDb.collection("scripts").doc(scriptId);
  const snap = await ref.get();
  if (!snap.exists) return NextResponse.json({ error: "not_found" }, { status: 404 });
  const data = snap.data() as ScriptDoc;

  const voters = { ...(data.voters || {}) };
  const prev = voters[auth.uid];
  let upvotes = data.upvotes || 0;
  let downvotes = data.downvotes || 0;

  if (prev === 1) upvotes--;
  if (prev === -1) downvotes--;

  if (direction === 0) {
    delete voters[auth.uid];
  } else {
    voters[auth.uid] = direction;
    if (direction === 1) upvotes++;
    if (direction === -1) downvotes++;
  }

  await ref.update({ voters, upvotes, downvotes });
  return NextResponse.json({ upvotes, downvotes });
}
