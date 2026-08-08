import Link from "next/link";

export default function UploadSuccessPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center">
      <p className="font-mono text-xs text-ash uppercase tracking-wider mb-3">
        Terkirim
      </p>
      <h1 className="font-mono text-2xl font-bold mb-4">Skrip masuk antrean moderasi</h1>
      <p className="font-mono text-sm text-smoke mb-8">
        Tim moderator akan meninjau skrip kamu sebelum tampil publik di katalog. Kamu bisa
        memantau statusnya di halaman profil.
      </p>
      <div className="flex gap-3 justify-center">
        <Link
          href="/explore"
          className="border border-paper px-5 py-2 font-mono text-sm hover:bg-paper hover:text-ink"
        >
          jelajahi skrip lain
        </Link>
        <Link
          href="/upload"
          className="border border-line px-5 py-2 font-mono text-sm text-ash hover:border-paper hover:text-paper"
        >
          upload lagi
        </Link>
      </div>
    </div>
  );
}
