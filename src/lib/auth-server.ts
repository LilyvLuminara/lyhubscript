import { NextRequest } from "next/server";
import { adminAuth, adminDb } from "./firebaseAdmin";
import type { UserProfile } from "./types";

export interface AuthResult {
  uid: string;
  profile: UserProfile | null;
}

export async function requireAuth(req: NextRequest): Promise<AuthResult | null> {
  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) return null;
  try {
    const decoded = await adminAuth.verifyIdToken(token);
    const snap = await adminDb.collection("users").doc(decoded.uid).get();
    const profile = snap.exists ? (snap.data() as UserProfile) : null;
    if (profile?.banned) return null;
    return { uid: decoded.uid, profile };
  } catch {
    return null;
  }
}

export async function requireAdmin(req: NextRequest): Promise<AuthResult | null> {
  const result = await requireAuth(req);
  if (!result || !result.profile) return null;
  if (result.profile.role !== "admin" && result.profile.role !== "moderator") return null;
  return result;
}
