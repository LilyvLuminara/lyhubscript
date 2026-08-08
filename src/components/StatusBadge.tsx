import type { ScriptStatus, ScriptAccess, ScriptScope } from "@/lib/types";

export function StatusPill({ status }: { status: ScriptStatus }) {
  const label =
    status === "working" ? "WORKING" : status === "patched" ? "PATCHED" : "BELUM DIVERIFIKASI";
  const style =
    status === "working"
      ? "bg-paper text-ink border-paper"
      : status === "patched"
      ? "bg-transparent text-ash border-ash line-through"
      : "bg-transparent text-smoke border-line";
  return (
    <span
      className={`inline-flex items-center gap-1 border px-2 py-0.5 text-[11px] font-mono tracking-wide ${style}`}
    >
      {label}
    </span>
  );
}

export function AccessPill({ access }: { access: ScriptAccess }) {
  const label = access === "free" ? "FREE" : access === "key" ? "KEY SYSTEM" : "PAID";
  return (
    <span className="inline-flex items-center border border-line px-2 py-0.5 text-[11px] font-mono text-smoke">
      {label}
    </span>
  );
}

export function ScopePill({ scope }: { scope: ScriptScope }) {
  const label = scope === "universal" ? "UNIVERSAL" : "GAME-SPECIFIC";
  return (
    <span className="inline-flex items-center border border-line px-2 py-0.5 text-[11px] font-mono text-smoke">
      {label}
    </span>
  );
}
