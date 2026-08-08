import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { requireAuth } from "@/lib/auth-server";
import type { ScriptDoc } from "@/lib/types";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const snap = await adminDb.collection("scripts").doc(params.id).get();
  if (!snap.exists) return NextResponse.json({ error: "not_found" }, { status: 404 });
  const data = snap.data() as ScriptDoc;
  if (!data.published) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ script: data });
}

// Increment the "copies" counter when a user clicks copy code.
export async function PATCH(_req: NextRequest, { params }: { params: { id: string } }) {
  const ref = adminDb.collection("scripts").doc(params.id);
  const snap = await ref.get();
  if (!snap.exists) return NextResponse.json({ error: "not_found" }, { status: 404 });
  const data = snap.data() as ScriptDoc;
  await ref.update({ copies: (data.copies || 0) + 1 });
  return NextResponse.json({ ok: true });
}

// Author pushes a new version of their own script.
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAuth(req);
  if (!auth) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const ref = adminDb.collection("scripts").doc(params.id);
  const snap = await ref.get();
  if (!snap.exists) return NextResponse.json({ error: "not_found" }, { status: 404 });
  const data = snap.data() as ScriptDoc;

  if (data.authorId !== auth.uid && auth.profile?.role !== "admin") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const { code, changelog, status } = await req.json();
  if (!code) return NextResponse.json({ error: "code_required" }, { status: 400 });

  const nextVersion = (data.versions?.length || 0) + 1;
  const versions = [
    ...(data.versions || []),
    { version: nextVersion, code, changelog: changelog || "", createdAt: Date.now() },
  ];

  await ref.update({
    code,
    versions,
    status: status || data.status,
    updatedAt: Date.now(),
  });

  return NextResponse.json({ ok: true, version: nextVersion });
}
