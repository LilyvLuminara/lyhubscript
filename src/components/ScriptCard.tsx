import Link from "next/link";
import type { ScriptDoc } from "@/lib/types";
import { StatusPill, AccessPill } from "./StatusBadge";
import { formatNumber, timeAgo, truncate } from "@/lib/utils";

export default function ScriptCard({ script }: { script: ScriptDoc }) {
  return (
    <Link
      href={`/scripts/${script.id}`}
      className="block border border-line hover:border-paper transition-colors p-4 group"
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <StatusPill status={script.status} />
        <AccessPill access={script.access} />
      </div>
      <h3 className="font-mono text-base font-semibold mb-1 group-hover:underline">
        {script.title}
      </h3>
      <p className="text-xs text-ash mb-3 font-mono">{script.game}</p>
      <p className="text-sm text-smoke mb-4">{truncate(script.description, 90)}</p>
      <div className="flex items-center justify-between text-xs font-mono text-ash">
        <span>{script.authorName}</span>
        <div className="flex items-center gap-3">
          <span>▲ {formatNumber(script.upvotes)}</span>
          <span>{formatNumber(script.views)} views</span>
          <span>{timeAgo(script.updatedAt)}</span>
        </div>
      </div>
    </Link>
  );
}
