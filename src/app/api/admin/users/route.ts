import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { requireAdmin } from "@/lib/auth-server";
import type { UserProfile } from "@/lib/types";

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const snap = await adminDb.collection("users").get();
  const users = snap.docs
    .map((d) => d.data() as UserProfile)
    .sort((a, b) => b.createdAt - a.createdAt);

  return NextResponse.json({ users });
}
