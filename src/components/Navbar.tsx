"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "./AuthProvider";

export default function Navbar() {
  const { user, profile, signOut } = useAuth();
  const router = useRouter();
  const [q, setQ] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    router.push(`/explore?q=${encodeURIComponent(q)}`);
  }

  return (
    <header className="border-b border-line sticky top-0 z-50 bg-ink/95 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center gap-6">
        <Link href="/" className="font-mono font-bold text-lg tracking-tight shrink-0">
          LYHUB<span className="text-ash">SCRIPT</span>
        </Link>

        <nav className="hidden md:flex items-center gap-5 text-sm font-mono text-smoke">
          <Link href="/" className="hover:text-paper">
            beranda
          </Link>
          <Link href="/explore" className="hover:text-paper">
            jelajah
          </Link>
          <Link href="/games" className="hover:text-paper">
            game
          </Link>
          <Link href="/upload" className="hover:text-paper">
            upload
          </Link>
        </nav>

        <form onSubmit={handleSearch} className="flex-1 max-w-md ml-auto">
          <div className="flex border border-line focus-within:border-paper">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="cari skrip, game, dev..."
              className="bg-transparent flex-1 px-3 py-2 text-sm font-mono outline-none placeholder:text-ash"
            />
            <button
              type="submit"
              className="px-3 text-ash hover:text-paper font-mono text-sm"
              aria-label="Cari"
            >
              →
            </button>
          </div>
        </form>

        <div className="relative shrink-0">
          {!user ? (
            <div className="flex items-center gap-3 font-mono text-sm">
              <Link href="/login" className="hover:text-ash">
                masuk
              </Link>
              <Link
                href="/register"
                className="border border-paper px-3 py-1.5 hover:bg-paper hover:text-ink transition-colors"
              >
                daftar
              </Link>
            </div>
          ) : (
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-2 font-mono text-sm border border-line px-3 py-1.5 hover:border-paper"
            >
              {profile?.displayName || "akun"}
              <span className="text-ash">▾</span>
            </button>
          )}

          {menuOpen && user && (
            <div className="absolute right-0 top-full mt-1 w-48 border border-line bg-void font-mono text-sm">
              <Link
                href={`/profile/${user.uid}`}
                className="block px-4 py-2 hover:bg-ink"
                onClick={() => setMenuOpen(false)}
              >
                profil saya
              </Link>
              <Link
                href="/upload"
                className="block px-4 py-2 hover:bg-ink"
                onClick={() => setMenuOpen(false)}
              >
                upload skrip
              </Link>
              {(profile?.role === "admin" || profile?.role === "moderator") && (
                <Link
                  href="/admin"
                  className="block px-4 py-2 hover:bg-ink text-smoke"
                  onClick={() => setMenuOpen(false)}
                >
                  admin panel
                </Link>
              )}
              <button
                onClick={() => {
                  signOut();
                  setMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 hover:bg-ink border-t border-line text-ash"
              >
                keluar
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
