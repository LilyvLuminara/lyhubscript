"use client";

import { useState } from "react";
import { useAuth } from "./AuthProvider";
import { auth } from "@/lib/firebase";

export default function VoteButtons({
  scriptId,
  initialUp,
  initialDown,
  initialVote,
}: {
  scriptId: string;
  initialUp: number;
  initialDown: number;
  initialVote?: 1 | -1 | 0;
}) {
  const { user } = useAuth();
  const [up, setUp] = useState(initialUp);
  const [down, setDown] = useState(initialDown);
  const [myVote, setMyVote] = useState<1 | -1 | 0>(initialVote || 0);
  const [busy, setBusy] = useState(false);

  async function vote(direction: 1 | -1) {
    if (!user) {
      window.location.href = "/login";
      return;
    }
    if (busy) return;
    setBusy(true);
    const next = myVote === direction ? 0 : direction;
    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/vote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ scriptId, direction: next }),
      });
      if (res.ok) {
        const data = await res.json();
        setUp(data.upvotes);
        setDown(data.downvotes);
        setMyVote(next);
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex items-center gap-1 font-mono text-sm">
      <button
        onClick={() => vote(1)}
        className={`border px-3 py-1.5 ${
          myVote === 1 ? "bg-paper text-ink border-paper" : "border-line hover:border-paper"
        }`}
      >
        ▲ {up}
      </button>
      <button
        onClick={() => vote(-1)}
        className={`border px-3 py-1.5 ${
          myVote === -1 ? "bg-paper text-ink border-paper" : "border-line hover:border-paper"
        }`}
      >
        ▼ {down}
      </button>
    </div>
  );
}
