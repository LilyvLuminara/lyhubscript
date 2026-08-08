const endpoints = [
  {
    method: "GET",
    path: "/api/scripts",
    desc: "Daftar skrip publik. Query: q, status, access, sort, game.",
    example: "/api/scripts?game=blox-fruits&status=working",
  },
  {
    method: "GET",
    path: "/api/scripts/:id",
    desc: "Detail satu skrip beserta metadata dan riwayat versi.",
    example: "/api/scripts/9f3a2c",
  },
  {
    method: "GET",
    path: "/api/fetch",
    desc: "Alias pencarian skrip berdasarkan game, dioptimalkan untuk hub eksternal.",
    example: "/api/fetch?game=blox-fruits",
  },
  {
    method: "GET",
    path: "/api/raw/:id",
    desc: "Mengembalikan kode Lua/LuaU sebagai plain text — untuk dipanggil langsung dari executor.",
    example: "/api/raw/9f3a2c",
  },
];

export default function ApiDocsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 font-mono text-sm">
      <h1 className="text-2xl font-bold mb-2">API Docs</h1>
      <p className="text-ash mb-10">
        API publik Lyhubscript bersifat read-only dan tidak memerlukan API key untuk endpoint
        GET. Semua respons dalam format JSON kecuali <code>/api/raw/:id</code>.
      </p>

      <div className="border border-line mb-10">
        <p className="px-4 py-2 border-b border-line text-ash text-xs uppercase">
          Contoh penggunaan di executor
        </p>
        <pre className="p-4 text-smoke overflow-x-auto">
{`loadstring(game:HttpGet("https://lyhubscript.com/api/raw/9f3a2c"))()`}
        </pre>
      </div>

      <div className="space-y-6">
        {endpoints.map((e) => (
          <div key={e.path} className="border border-line p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="border border-paper px-2 py-0.5 text-xs">{e.method}</span>
              <code className="text-paper">{e.path}</code>
            </div>
            <p className="text-smoke mb-2">{e.desc}</p>
            <p className="text-ash text-xs">contoh: {e.example}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
