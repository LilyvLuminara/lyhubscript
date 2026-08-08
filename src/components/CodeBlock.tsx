"use client";

import { useState } from "react";

const LUA_KEYWORDS =
  /\b(local|function|end|if|then|else|elseif|for|while|do|return|true|false|nil|and|or|not|repeat|until|break|in)\b/g;

function highlight(code: string): string {
  let escaped = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // comments
  escaped = escaped.replace(
    /(--\[\[[\s\S]*?\]\]|--.*$)/gm,
    '<span class="text-ash italic">$1</span>'
  );
  // strings
  escaped = escaped.replace(
    /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g,
    '<span class="text-smoke">$1</span>'
  );
  // keywords
  escaped = escaped.replace(LUA_KEYWORDS, '<span class="text-paper font-semibold">$1</span>');
  // numbers
  escaped = escaped.replace(/\b(\d+(\.\d+)?)\b/g, '<span class="text-smoke">$1</span>');

  return escaped;
}

export default function CodeBlock({
  code,
  onCopy,
}: {
  code: string;
  onCopy?: () => void;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    onCopy?.();
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="terminal-frame">
      <div className="flex items-center justify-between px-4 py-2 border-b border-line relative z-10">
        <span className="font-mono text-xs text-ash">script.lua</span>
        <button
          onClick={handleCopy}
          className="font-mono text-xs border border-line px-3 py-1 hover:border-paper transition-colors"
        >
          {copied ? "✓ tersalin" : "⧉ copy code"}
        </button>
      </div>
      <pre className="code-scroll overflow-x-auto p-4 text-sm leading-relaxed relative z-10 max-h-[480px]">
        <code
          className="font-mono"
          dangerouslySetInnerHTML={{ __html: highlight(code) }}
        />
      </pre>
    </div>
  );
}
