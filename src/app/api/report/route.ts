import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { requireAuth } from "@/lib/auth-server";
import { nanoid } from "nanoid";
import type { ReportDoc, ScriptDoc } from "@/lib/types";

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (!auth) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { scriptId, reason, details } = await req.json();
  if (!scriptId || !reason) {
    return NextResponse.json({ error: "field_required" }, { status: 400 });
  }

  const scriptSnap = await adminDb.collection("scripts").doc(scriptId).get();
  if (!scriptSnap.exists) return NextResponse.json({ error: "not_found" }, { status: 404 });
  const script = scriptSnap.data() as ScriptDoc;

  const id = nanoid(8);
  const report: ReportDoc = {
    id,
    scriptId,
    scriptTitle: script.title,
    reporterId: auth.uid,
    reporterName: auth.profile?.displayName || "anonim",
    reason,
    details: details || "",
    status: "open",
    createdAt: Date.now(),
  };

  await adminDb.collection("reports").doc(id).set(report);
  await adminDb.collection("scripts").doc(scriptId).update({ flagged: true });

  return NextResponse.json({ ok: true });
}
