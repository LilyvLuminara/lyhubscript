"use client";

import { useState } from "react";
import Link from "next/link";
import type { ScriptDoc } from "@/lib/types";
import CodeBlock from "@/components/CodeBlock";
import VoteButtons from "@/components/VoteButtons";
import ReportButton from "@/components/ReportButton";
import CommentSection from "@/components/CommentSection";
import { StatusPill, AccessPill, ScopePill } from "@/components/StatusBadge";
import { useAuth } from "@/components/AuthProvider";
import { timeAgo, formatNumber } from "@/lib/utils";

export default function ScriptDetailClient({ script }: { script: ScriptDoc }) {
  const { user } = useAuth();
  const [showVersions, setShowVersions] = useState(false);
  const [activeCode, setActiveCode] = useState(script.code);
  const myVote = user ? script.voters?.[user.uid] : undefined;

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || (typeof window !== "undefined" ? window.location.origin : "");
  const rawUrl = `${siteUrl}/api/raw/${script.id}`;

  async function trackCopy() {
    fetch(`/api/scripts/${script.id}`, { method: "PATCH" }).catch(() => {});
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <StatusPill status={script.status} />
          <AccessPill access={script.access} />
          <ScopePill scope={script.scope} />
        </div>
        <h1 className="font-mono text-3xl font-bold mb-2">{script.title}</h1>
        <p className="text-smoke mb-3">{script.description}</p>
        <div className="flex items-center gap-4 font-mono text-xs text-ash">
          <Link href={`/games/${script.gameSlug}`} className="hover:text-paper">
            🎮 {script.game}
          </Link>
          <span>oleh {script.authorName}</span>
          <span>{formatNumber(script.views)} views</span>
          <span>diperbarui {timeAgo(script.updatedAt)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <VoteButtons
          scriptId={script.id}
          initialUp={script.upvotes}
          initialDown={script.downvotes}
          initialVote={myVote}
        />
        <div className="flex items-center gap-2">
          {script.versions?.length > 1 && (
            <button
              onClick={() => setShowVersions((v) => !v)}
              className="font-mono text-xs text-ash border border-line px-3 py-1.5 hover:border-paper hover:text-paper"
            >
              🕓 {script.versions.length} versi
            </button>
          )}
          <ReportButton scriptId={script.id} />
        </div>
      </div>

      {showVersions && (
        <div className="border border-line mb-4 font-mono text-xs">
          {[...script.versions].reverse().map((v) => (
            <button
              key={v.version}
              onClick={() => setActiveCode(v.code)}
              className="flex w-full items-center justify-between px-3 py-2 hover:bg-void border-b border-line last:border-b-0 text-left"
            >
              <span>
                v{v.version} — {v.changelog || "tidak ada catatan"}
              </span>
              <span className="text-ash">{timeAgo(v.createdAt)}</span>
            </button>
          ))}
        </div>
      )}

      <CodeBlock code={activeCode} onCopy={trackCopy} />

      <div className="mt-4 border border-line p-3">
        <p className="font-mono text-xs text-ash mb-1">Raw script URL (untuk executor)</p>
        <code className="font-mono text-xs text-smoke break-all">
          loadstring(game:HttpGet("{rawUrl}"))()
        </code>
      </div>

      {script.access === "key" && script.keyLink && (
        <div className="mt-3 border border-line p-3 font-mono text-xs">
          <span className="text-ash">Key system: </span>
          <a href={script.keyLink} target="_blank" className="underline hover:text-smoke">
            {script.keyLink}
          </a>
        </div>
      )}

      <CommentSection scriptId={script.id} />
    </div>
  );
}
