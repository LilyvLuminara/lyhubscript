import { adminDb } from "@/lib/firebaseAdmin";
import { notFound } from "next/navigation";
import type { ScriptDoc } from "@/lib/types";
import ScriptDetailClient from "./ScriptDetailClient";

async function getScript(id: string): Promise<ScriptDoc | null> {
  const snap = await adminDb.collection("scripts").doc(id).get();
  if (!snap.exists) return null;
  const data = snap.data() as ScriptDoc;
  if (!data.published) return null;
  // fire-and-forget view increment
  adminDb
    .collection("scripts")
    .doc(id)
    .update({ views: (data.views || 0) + 1 })
    .catch(() => {});
  return { ...data, id: snap.id };
}

export default async function ScriptDetailPage({ params }: { params: { id: string } }) {
  const script = await getScript(params.id);
  if (!script) notFound();
  return <ScriptDetailClient script={script} />;
}
