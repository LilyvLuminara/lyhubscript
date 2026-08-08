export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16 font-mono text-sm leading-relaxed">
      <h1 className="text-2xl font-bold mb-6">Kebijakan Privasi</h1>
      <div className="space-y-4 text-smoke">
        <p>
          Kami menyimpan data akun (nama, email, foto profil) yang diberikan saat pendaftaran
          melalui email/password atau Google Sign-In, disimpan di Firebase Authentication dan
          Firestore.
        </p>
        <p>
          Data aktivitas seperti skrip yang diunggah, komentar, dan vote disimpan untuk
          menjalankan fitur platform dan ditampilkan secara publik sesuai konteksnya.
        </p>
        <p>
          Kami tidak menjual data pengguna ke pihak ketiga. Data dapat dibagikan jika diwajibkan
          oleh hukum yang berlaku.
        </p>
        <p>
          Kamu dapat meminta penghapusan akun dan data terkait melalui halaman kontak.
        </p>
      </div>
    </div>
  );
}
