import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { requireAdmin } from "@/lib/auth-server";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAdmin(req);
  if (!auth) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const { action } = await req.json(); // "approve" | "reject" | "unpublish"
  const ref = adminDb.collection("scripts").doc(params.id);
  const snap = await ref.get();
  if (!snap.exists) return NextResponse.json({ error: "not_found" }, { status: 404 });

  if (action === "approve") {
    await ref.update({ published: true, flagged: false });
  } else if (action === "reject" || action === "unpublish") {
    await ref.update({ published: false });
  } else {
    return NextResponse.json({ error: "invalid_action" }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAdmin(req);
  if (!auth) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  await adminDb.collection("scripts").doc(params.id).delete();
  return NextResponse.json({ ok: true });
}
