export type ScriptStatus = "working" | "patched" | "unverified";
export type ScriptAccess = "free" | "key" | "paid";
export type ScriptScope = "universal" | "game-specific";

export interface ScriptVersion {
  version: number;
  code: string;
  changelog: string;
  createdAt: number;
}

export interface ScriptDoc {
  id: string;
  rawToken: string;
  title: string;
  description: string;
  game: string;
  gameSlug: string;
  code: string; // current/latest code
  versions: ScriptVersion[];
  status: ScriptStatus;
  access: ScriptAccess;
  scope: ScriptScope;
  keyLink?: string;
  authorId: string;
  authorName: string;
  views: number;
  copies: number;
  upvotes: number;
  downvotes: number;
  voters: Record<string, 1 | -1>; // uid -> vote
  commentCount: number;
  createdAt: number;
  updatedAt: number;
  published: boolean; // false while in moderation queue
  flagged: boolean;
}

export interface CommentDoc {
  id: string;
  scriptId: string;
  authorId: string;
  authorName: string;
  text: string;
  createdAt: number;
}

export interface ReportDoc {
  id: string;
  scriptId: string;
  scriptTitle: string;
  reporterId: string;
  reporterName: string;
  reason: "patched" | "malware" | "misleading" | "other";
  details: string;
  status: "open" | "resolved" | "dismissed";
  createdAt: number;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  role: "user" | "moderator" | "admin";
  banned: boolean;
  muted: boolean;
  reputation: number;
  createdAt: number;
}
