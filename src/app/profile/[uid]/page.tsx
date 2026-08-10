export const dynamic = "force-dynamic";
import { adminDb } from "@/lib/firebaseAdmin";
import { notFound } from "next/navigation";
import type { ScriptDoc, UserProfile } from "@/lib/types";
import ScriptCard from "@/components/ScriptCard";
import { formatNumber } from "@/lib/utils";

async function getProfileData(uid: string) {
  const userSnap = await adminDb.collection("users").doc(uid).get();
  if (!userSnap.exists) return null;
  const profile = userSnap.data() as UserProfile;
  const scriptsSnap = await adminDb
    .collection("scripts")
    .where("authorId", "==", uid)
    .where("published", "==", true)
    .get();
  const scripts = scriptsSnap.docs.map((d) => d.data() as ScriptDoc);
  const totalDownloads = scripts.reduce((sum, s) => sum + (s.copies || 0), 0);
  return { profile, scripts, totalDownloads };
}

export default async function ProfilePage({ params }: { params: { uid: string } }) {
  const data = await getProfileData(params.uid);
  if (!data) notFound();
  const { profile, scripts, totalDownloads } = data;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between border border-line p-6 mb-8 flex-wrap gap-4">
        <div>
          <h1 className="font-mono text-2xl font-bold mb-1">{profile.displayName}</h1>
          <p className="font-mono text-xs text-ash uppercase tracking-wider">
            {profile.role === "admin"
              ? "Administrator"
              : profile.role === "moderator"
              ? "Moderator"
              : "Kreator"}
          </p>
        </div>
        <div className="flex gap-6 font-mono text-sm">
          <div className="text-center">
            <p className="text-xl font-bold">{scripts.length}</p>
            <p className="text-ash text-xs">skrip</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold">{formatNumber(totalDownloads)}</p>
            <p className="text-ash text-xs">copy total</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold">{profile.reputation}</p>
            <p className="text-ash text-xs">reputasi</p>
          </div>
        </div>
      </div>

      <h2 className="font-mono text-sm uppercase tracking-wider text-ash mb-4">
        Skrip yang diunggah
      </h2>
      {scripts.length === 0 ? (
        <p className="font-mono text-sm text-ash">Belum ada skrip publik.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {scripts.map((s) => (
            <ScriptCard key={s.id} script={s} />
          ))}
        </div>
      )}
    </div>
  );
}
