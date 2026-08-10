import { NextRequest } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { obfuscateLuaSource } from "@/lib/obfuscate";
import type { ScriptDoc } from "@/lib/types";

const DECOY_VIDEO_URL = process.env.DECOY_VIDEO_URL || "";

function decoyPage(): Response {
  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Lyhubscript</title>
<style>
  html, body { margin: 0; height: 100%; background: #000; display: flex; align-items: center; justify-content: center; }
  video { max-width: 100%; max-height: 100%; }
</style>
</head>
<body>
  ${
    DECOY_VIDEO_URL
      ? `<video src="${DECOY_VIDEO_URL}" autoplay loop muted playsinline controls></video>`
      : `<p style="color:#666;font-family:monospace">nothing to see here</p>`
  }
</body>
</html>`;
  return new Response(html, {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const userAgent = req.headers.get("user-agent") || "";
  const isLikelyRoblox = /roblox/i.test(userAgent);

  if (!isLikelyRoblox) {
    return decoyPage();
  }

  const token = params.id;
  const snap = await adminDb.collection("scripts").where("rawToken", "==", token).limit(1).get();

  if (snap.empty) {
    return decoyPage();
  }

  const doc = snap.docs[0];
  const data = doc.data() as ScriptDoc;

  if (!data.published) {
    return decoyPage();
  }

  doc.ref.update({ copies: (data.copies || 0) + 1 }).catch(() => {});

  return new Response(obfuscateLuaSource(data.code), {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}