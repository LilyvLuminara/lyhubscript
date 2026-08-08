import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center">
      <p className="font-mono text-5xl font-bold mb-4">404</p>
      <p className="font-mono text-sm text-ash mb-8">
        [ERROR] Halaman atau skrip yang kamu cari tidak ditemukan / belum dipublikasikan.
      </p>
      <Link
        href="/explore"
        className="border border-paper px-5 py-2 font-mono text-sm hover:bg-paper hover:text-ink"
      >
        kembali ke katalog
      </Link>
    </div>
  );
}
