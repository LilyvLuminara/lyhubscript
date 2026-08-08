"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/scripts", label: "Antrean Skrip" },
  { href: "/admin/reports", label: "Laporan" },
  { href: "/admin/users", label: "Pengguna" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-full md:w-48 shrink-0 space-y-1 font-mono text-sm">
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className={`block px-3 py-2 border-l-2 ${
            pathname === l.href
              ? "border-paper text-paper"
              : "border-line text-ash hover:text-smoke"
          }`}
        >
          {l.label}
        </Link>
      ))}
    </aside>
  );
}
