# Lyhubscript

Platform penyedia & penyimpan skrip Roblox (seperti ScriptBlox) — tema hitam-putih,
dibangun dengan **Next.js 14** + **Firebase** (Firestore, Auth, Storage), semua free tier.

## Fitur yang sudah jadi

- Beranda dengan hero "terminal" animasi, trending & terbaru
- Jelajah/Explore dengan search + filter (status, akses, urutan)
- Halaman per Game
- Detail skrip: syntax highlight monokrom, 1-click copy, riwayat versi, raw URL untuk `loadstring`, upvote/downvote, laporkan, komentar
- Upload skrip → masuk antrean moderasi
- Auth: Email/Password + Google Sign-In
- Profil kreator publik (portofolio skrip, total copy, reputasi)
- Admin panel: overview statistik, antrean moderasi skrip (approve/reject), laporan (resolve/dismiss), manajemen user (ban/mute/role)
- Public REST API read-only: `/api/scripts`, `/api/scripts/:id`, `/api/fetch`, `/api/raw/:id`
- Halaman legal: ToS, Privasi, DMCA/Take-down, Kontak

## 1. Setup Firebase (gratis — Spark plan)

1. Buka https://console.firebase.google.com → **Add project** → beri nama (mis. `lyhubscript`).
2. **Authentication** → tab *Sign-in method* → aktifkan **Email/Password** dan **Google**.
3. **Firestore Database** → *Create database* → pilih mode **production**, region terdekat (mis. `asia-southeast2`).
4. **Storage** → *Get started* (opsional, disiapkan untuk foto profil ke depannya).
5. Buka **Project settings (⚙) → General** → di bagian "Your apps" klik ikon web `</>` → daftarkan app → salin konfigurasi ke `.env.local` sebagai `NEXT_PUBLIC_FIREBASE_*`.
6. Masih di Project settings → tab **Service accounts** → *Generate new private key* → file JSON akan terunduh. Dari file itu, isi:
   - `FIREBASE_ADMIN_PROJECT_ID` = `project_id`
   - `FIREBASE_ADMIN_CLIENT_EMAIL` = `client_email`
   - `FIREBASE_ADMIN_PRIVATE_KEY` = `private_key` (biarkan tanda `\n` di dalam tanda kutip persis seperti di file JSON)
7. Deploy security rules (opsional tapi disarankan):
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase init firestore storage   # pilih project yang sudah dibuat, gunakan file rules yang sudah ada
   firebase deploy --only firestore:rules,storage:rules
   ```

Salin `.env.example` menjadi `.env.local` lalu isi semua variabel di atas.

## 2. Jalankan lokal

```bash
npm install
npm run dev
```

Buka http://localhost:3000

## 3. Jadikan diri kamu Admin

Setelah daftar akun pertama lewat website (Email atau Google), buka **Firebase Console → Firestore → koleksi `users`**, cari dokumen dengan `uid` kamu, lalu ubah field:

```
role: "admin"
```

Setelah itu menu **admin panel** akan muncul di dropdown akun (pojok kanan atas navbar).

## 4. Deploy gratis ke Vercel

1. Push folder ini ke repo GitHub.
2. Buka https://vercel.com → **Add New Project** → import repo tersebut.
3. Di step *Environment Variables*, masukkan semua variabel yang sama seperti di `.env.local` (termasuk `FIREBASE_ADMIN_PRIVATE_KEY` — tempel apa adanya termasuk `\n`).
4. Set `NEXT_PUBLIC_SITE_URL` ke domain Vercel kamu (mis. `https://lyhubscript.vercel.app`) — dipakai untuk generate raw script URL.
5. Deploy. Vercel free tier (Hobby) sudah cukup untuk seluruh API routes di project ini.

## Struktur folder penting

```
src/
  app/                 -> semua halaman (App Router) + API routes di app/api/*
  components/          -> UI components (Navbar, CodeBlock, VoteButtons, dst)
  lib/
    firebase.ts        -> Firebase client SDK (browser)
    firebaseAdmin.ts   -> Firebase Admin SDK (server, API routes)
    auth-server.ts     -> verifikasi token + cek role/ban di setiap API
    types.ts           -> semua TypeScript interface (ScriptDoc, dll)
firestore.rules         -> aturan keamanan Firestore
storage.rules           -> aturan keamanan Storage
```

## Catatan moderasi & keamanan

- Skrip baru otomatis **tidak publik** (`published: false`) sampai disetujui admin di `/admin/scripts`. Kalau mau lebih longgar (langsung tayang), ubah default `published` di `src/app/api/scripts/route.ts`.
- Verifikasi malware/backdoor pada kode yang diupload **tidak dilakukan otomatis** oleh sistem ini — itu proses manual yang perlu dilakukan admin/moderator saat meninjau di antrean. Pertimbangkan menambah code-scanning pihak ketiga kalau traffic sudah besar.
- Semua endpoint tulis (`POST/PATCH/PUT/DELETE`) memverifikasi Firebase ID token di server — jangan expose `FIREBASE_ADMIN_PRIVATE_KEY` ke client manapun.

## Pengembangan lanjutan yang bisa ditambahkan

- Notifikasi email saat skrip disetujui/ditolak
- Rate limiting di endpoint publik (`/api/raw/:id`, `/api/scripts`) misal via Vercel Edge Config / Upstash Redis (ada free tier)
- Halaman edit skrip untuk author (push versi baru lewat UI, bukan hanya lewat API)
- Discord OAuth (perlu Firebase custom auth provider atau NextAuth terpisah)
# lyhubscript
# lyhubscript
