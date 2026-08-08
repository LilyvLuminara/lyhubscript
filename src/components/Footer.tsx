import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-line mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 font-mono text-sm">
        <div>
          <p className="text-ash mb-3 text-xs uppercase tracking-wider">Developer</p>
          <ul className="space-y-2">
            <li>
              <Link href="/docs/api" className="hover:text-ash">
                API Docs
              </Link>
            </li>
            <li>
              <Link href="/explore" className="hover:text-ash">
                Jelajah Skrip
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-ash mb-3 text-xs uppercase tracking-wider">Komunitas</p>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:text-ash">
                Discord
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-ash">
                Telegram
              </a>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-ash mb-3 text-xs uppercase tracking-wider">Legalitas</p>
          <ul className="space-y-2">
            <li>
              <Link href="/legal/tos" className="hover:text-ash">
                Ketentuan Layanan
              </Link>
            </li>
            <li>
              <Link href="/legal/privacy" className="hover:text-ash">
                Kebijakan Privasi
              </Link>
            </li>
            <li>
              <Link href="/legal/dmca" className="hover:text-ash">
                DMCA / Take-down
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-ash mb-3 text-xs uppercase tracking-wider">Kontak</p>
          <ul className="space-y-2">
            <li>
              <Link href="/legal/contact" className="hover:text-ash">
                Formulir Kontak
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line py-4 text-center text-xs font-mono text-ash">
        LYHUBSCRIPT © {new Date().getFullYear()} — dibuat untuk komunitas.
      </div>
    </footer>
  );
}
