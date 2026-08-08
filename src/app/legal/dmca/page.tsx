export default function DmcaPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16 font-mono text-sm leading-relaxed">
      <h1 className="text-2xl font-bold mb-6">DMCA / Kebijakan Take-down</h1>
      <div className="space-y-4 text-smoke">
        <p>
          Jika kamu adalah pemilik hak cipta dan yakin konten di Lyhubscript melanggar hakmu,
          kirimkan permintaan take-down melalui halaman kontak dengan menyertakan:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Identifikasi konten yang diklaim melanggar (link/ID skrip)</li>
          <li>Bukti kepemilikan hak atas konten tersebut</li>
          <li>Informasi kontak yang bisa dihubungi kembali</li>
          <li>Pernyataan bahwa klaim dibuat dengan niat baik</li>
        </ul>
        <p>
          Konten yang dilaporkan akan ditinjau tim moderasi dan dapat dihapus sementara selagi
          proses verifikasi berjalan.
        </p>
      </div>
    </div>
  );
}
