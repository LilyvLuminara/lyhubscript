"use client";

import { useEffect, useState } from "react";

const LINE = `loadstring(game:HttpGet("https://lyhubscript.com/raw/9f3a2c"))()`;

export default function TerminalHero({ scriptCount }: { scriptCount: number }) {
  const [typed, setTyped] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setTyped(LINE.slice(0, i));
      if (i >= LINE.length) {
        clearInterval(interval);
        setTimeout(() => setDone(true), 400);
      }
    }, 28);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="terminal-frame max-w-2xl mx-auto">
      <div className="flex items-center gap-2 px-4 py-2 border-b border-line relative z-10">
        <span className="w-2.5 h-2.5 border border-ash" />
        <span className="w-2.5 h-2.5 border border-ash" />
        <span className="w-2.5 h-2.5 border border-ash" />
        <span className="font-mono text-xs text-ash ml-2">executor.exe</span>
      </div>
      <div className="p-6 font-mono text-sm relative z-10 min-h-[96px]">
        <span className="text-ash">{"> "}</span>
        <span className="text-paper">{typed}</span>
        {!done && <span className="blink-cursor" />}
        {done && (
          <p className="text-ash mt-3">
            [200 OK] script executed — <span className="text-paper">{scriptCount.toLocaleString("id-ID")}</span>{" "}
            skrip tersedia di database
          </p>
        )}
      </div>
    </div>
  );
}
