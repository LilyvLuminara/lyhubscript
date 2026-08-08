import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { requireAdmin } from "@/lib/auth-server";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAdmin(req);
  if (!auth) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const body = await req.json();
  const update: Record<string, any> = {};

  // Only admins (not moderators) can change roles.
  if (typeof body.role === "string" && auth.profile?.role === "admin") {
    if (!["user", "moderator", "admin"].includes(body.role)) {
      return NextResponse.json({ error: "invalid_role" }, { status: 400 });
    }
    update.role = body.role;
  }
  if (typeof body.banned === "boolean") update.banned = body.banned;
  if (typeof body.muted === "boolean") update.muted = body.muted;

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "nothing_to_update" }, { status: 400 });
  }

  await adminDb.collection("users").doc(params.id).update(update);
  return NextResponse.json({ ok: true });
}
