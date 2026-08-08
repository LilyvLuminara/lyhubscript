import { NextRequest } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import type { ScriptDoc } from "@/lib/types";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const snap = await adminDb.collection("scripts").doc(params.id).get();
  if (!snap.exists || !(snap.data() as ScriptDoc).published) {
    return new Response("-- script not found or unpublished", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
  const data = snap.data() as ScriptDoc;

  adminDb
    .collection("scripts")
    .doc(params.id)
    .update({ copies: (data.copies || 0) + 1 })
    .catch(() => {});

  return new Response(data.code, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=60",
    },
  });
}
