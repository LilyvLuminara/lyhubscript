import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { requireAdmin } from "@/lib/auth-server";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAdmin(req);
  if (!auth) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const { status } = await req.json(); // "resolved" | "dismissed"
  if (!["resolved", "dismissed"].includes(status)) {
    return NextResponse.json({ error: "invalid_status" }, { status: 400 });
  }

  await adminDb.collection("reports").doc(params.id).update({ status });
  return NextResponse.json({ ok: true });
}
