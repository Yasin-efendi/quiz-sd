# 🎓 Quiz SD

Aplikasi kuis pembelajaran interaktif untuk latihan Ujian Sekolah Dasar, dibangun dengan **Next.js 16 (App Router)**, **TypeScript**, **Supabase**, dan **Auth.js**.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=flat&logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38BDF8?style=flat&logo=tailwindcss)
![Vitest](https://img.shields.io/badge/Tested_with-Vitest-6E9F18?style=flat&logo=vitest)
![License](https://img.shields.io/badge/License-MIT-green?style=flat)

---

## ✨ Fitur Utama

### 🎓 Untuk Siswa
- ✅ Dashboard mata pelajaran & pertemuan dengan tampilan Accordion
- ✅ Kuis interaktif dengan navigasi soal bebas (maju & mundur)
- ✅ Dukungan soal bergambar
- ✅ Halaman hasil dengan skor, nilai persentase, dan pembahasan per soal
- ✅ Token JWT unik per sesi kuis (berlaku 7 hari)
- ✅ Responsive design — mobile & desktop friendly

### 🛠️ Untuk Admin
- ✅ Login aman dengan Auth.js (JWT session)
- ✅ Proteksi route `/admin/*` via `proxy.ts`
- ✅ CRUD lengkap: Pelajaran → Pertemuan → Bank Soal
- ✅ Dashboard statistik: total soal, pelajaran, pertemuan, attempt
- ✅ Riwayat pengerjaan kuis seluruh siswa
- ✅ Validasi input server-side menggunakan Zod

### ⚙️ Teknis
- ✅ Next.js 16 `async params` pattern (`await params`)
- ✅ Supabase Row Level Security (RLS) — data terlindungi
- ✅ API Routes terstruktur dengan error handling konsisten
- ✅ 17 unit test dengan Vitest (token, validasi, utils)
- ✅ shadcn/ui component library

---

## 🚀 Tech Stack

| Kategori | Teknologi |
|---|---|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript 5.x |
| **UI** | shadcn/ui + Tailwind CSS v4 |
| **Database** | Supabase (PostgreSQL) |
| **Auth** | Auth.js v5 (NextAuth) — Credentials Provider |
| **Validasi** | Zod |
| **Token** | JSON Web Token (jsonwebtoken) |
| **Testing** | Vitest + React Testing Library |

---

## 📦 Instalasi & Setup

### Prerequisites
- Node.js 18+
- npm
- Akun Supabase (gratis di [supabase.com](https://supabase.com))

### 1. Clone & Install

```bash
git clone https://github.com/username/quiz-sd.git
cd quiz-sd
npm install
```

### 2. Konfigurasi Environment

Buat file `.env.local` di root proyek:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...

# Auth.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=isi_dengan_random_string_panjang

# Admin credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

Generate `NEXTAUTH_SECRET` dengan perintah:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Setup Database Supabase

Buka **SQL Editor** di dashboard Supabase, jalankan dua query berikut secara berurutan:

**Migration** — membuat 4 tabel:

```sql
CREATE TABLE subjects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
-- (dan tabel meetings, questions, quiz_attempts)
```

> Lihat file lengkap di `supabase/migration.sql` dan `supabase/seed.sql`

### 4. Jalankan Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

---

## 🔐 Akun Admin Default

| Username | Password |
|---|---|
| `admin` | `admin123` |

> ⚠️ Ganti kredensial ini di `.env.local` sebelum digunakan di lingkungan produksi.

Akses panel admin: [http://localhost:3000/admin](http://localhost:3000/admin)

---

## 🗺️ Struktur Halaman

### Halaman Publik

| Halaman | URL | Keterangan |
|---|---|---|
| Beranda | `/` | Daftar pelajaran & pertemuan |
| Kuis | `/quiz/[slug]` | Input nama → kerjakan soal |
| Hasil | `/result/[token]` | Skor + pembahasan lengkap |

### Halaman Admin (Login Required)

| Halaman | URL | Keterangan |
|---|---|---|
| Login | `/admin/login` | Form autentikasi admin |
| Dashboard | `/admin` | Statistik & 5 attempt terbaru |
| Pelajaran | `/admin/subjects` | CRUD mata pelajaran |
| Pertemuan | `/admin/meetings` | CRUD pertemuan |
| Bank Soal | `/admin/questions` | CRUD soal + filter |
| Riwayat | `/admin/attempts` | Semua riwayat kuis siswa |

---

## 🔌 API Reference

### Public Endpoints

| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/api/quiz` | Semua pelajaran beserta pertemuannya |
| `GET` | `/api/quiz/[slug]` | Soal berdasarkan slug pertemuan |
| `POST` | `/api/quiz/[slug]/submit` | Submit jawaban → dapat token JWT |
| `GET` | `/api/result/[token]` | Hasil kuis berdasarkan token |

### Admin Endpoints (Auth Required)

| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET/POST` | `/api/admin/subjects` | List & tambah pelajaran |
| `PUT/DELETE` | `/api/admin/subjects/[id]` | Edit & hapus pelajaran |
| `GET/POST` | `/api/admin/meetings` | List & tambah pertemuan |
| `PUT/DELETE` | `/api/admin/meetings/[id]` | Edit & hapus pertemuan |
| `GET/POST` | `/api/admin/questions` | List & tambah soal |
| `PUT/DELETE` | `/api/admin/questions/[id]` | Edit & hapus soal |

---

## 📁 Struktur Proyek

```
quiz-sd/
├── app/
│   ├── admin/
│   │   ├── (protected)/           # Route group — butuh login
│   │   │   ├── layout.tsx         # Layout + navbar admin
│   │   │   ├── page.tsx           # Dashboard statistik
│   │   │   ├── subjects/          # CRUD pelajaran
│   │   │   ├── meetings/          # CRUD pertemuan
│   │   │   ├── questions/         # Bank soal + tambah + edit
│   │   │   └── attempts/          # Riwayat kuis
│   │   └── login/page.tsx         # Halaman login
│   ├── api/
│   │   ├── auth/[...nextauth]/    # Auth.js handler
│   │   ├── quiz/                  # Endpoint kuis publik
│   │   ├── result/[token]/        # Endpoint hasil kuis
│   │   └── admin/                 # Endpoint CRUD admin
│   ├── quiz/[slug]/page.tsx       # Halaman kuis siswa
│   ├── result/[token]/page.tsx    # Halaman hasil siswa
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── admin/
│   │   └── DeleteButton.tsx       # Client component hapus soal
│   ├── quiz/
│   │   ├── QuestionCard.tsx       # Tampilan soal + opsi
│   │   ├── QuizNavigation.tsx     # Navigasi + progress
│   │   └── ResultDisplay.tsx      # Tampilan hasil + pembahasan
│   └── ui/                        # shadcn/ui components
├── lib/
│   ├── supabase/
│   │   ├── client.ts              # Supabase browser client
│   │   └── server.ts              # Supabase admin client
│   ├── validations/               # Zod schemas
│   │   ├── quiz.ts
│   │   ├── subject.ts
│   │   ├── meeting.ts
│   │   └── question.ts
│   ├── auth.ts                    # Auth.js config
│   ├── token.ts                   # JWT create & verify
│   └── utils.ts                   # Helper functions
├── tests/
│   ├── setup.ts
│   ├── quiz-flow.test.ts          # Test utils kuis
│   ├── token.test.ts              # Test JWT token
│   └── validations.test.ts        # Test Zod schema
├── types/
│   └── next-auth.d.ts             # Type extension session
├── proxy.ts                       # Route protection middleware
├── .env.local                     # Environment variables
└── vitest.config.ts
```

---

## 🧪 Testing

Jalankan seluruh test:

```bash
npx vitest run
```

Hasil yang diharapkan:

```
✓ tests/quiz-flow.test.ts   (5 tests)
✓ tests/token.test.ts       (4 tests)
✓ tests/validations.test.ts (8 tests)

Test Files  3 passed
Tests      17 passed
```

### Cakupan Test

| File | Yang Diuji |
|---|---|
| `quiz-flow.test.ts` | `calculateScore`, `getScoreMessage`, `generateSlug` |
| `token.test.ts` | Buat token, decode token valid, tolak token palsu |
| `validations.test.ts` | Zod schema quiz, subject, question |

---

## ⚠️ Catatan Penting

### Next.js 16 — async params

```ts
// ✅ Benar: params wajib di-await di Next.js 16
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
}
```

### Supabase RLS

Semua tabel menggunakan Row Level Security:
- **Public** (`anon`) → hanya bisa `SELECT` tabel `subjects`, `meetings`, `questions`
- **Public** → bisa `INSERT` ke `quiz_attempts` (submit kuis)
- **Service Role** → akses penuh untuk operasi admin

### proxy.ts vs middleware.ts

Di Next.js 16, `middleware.ts` telah diganti menjadi `proxy.ts`. Jika Anda melihat warning `middleware deprecated`, rename file tersebut ke `proxy.ts`.

---

## 🛠️ Troubleshooting

| Masalah | Solusi |
|---|---|
| `Invalid path specified in request URL` | Pastikan `NEXT_PUBLIC_SUPABASE_URL` tidak mengandung `/rest/v1/` di akhir |
| Redirect loop di `/admin/login` | Pastikan halaman login berada di luar route group `(protected)` |
| `Event handlers cannot be passed to Client Component` | Tambahkan `'use client'` atau pisahkan ke file komponen tersendiri |
| `Property 'errors' does not exist on ZodError` | Ganti `.errors` dengan `.issues` (Zod versi terbaru) |
| Test tidak ditemukan | Pastikan folder bernama `tests/` (dengan s) dan file `setup.ts` ada di dalamnya |

### Reset cache Next.js

```bash
rm -rf .next
npm run dev
```

---

## 🤝 Kontribusi

1. Fork repository ini
2. Buat branch fitur baru: `git checkout -b fitur/nama-fitur`
3. Commit perubahan: `git commit -m 'feat: deskripsi fitur'`
4. Push ke branch: `git push origin fitur/nama-fitur`
5. Buat Pull Request

---

## 📄 License

Dibagikan di bawah lisensi [MIT](LICENSE). Bebas digunakan, dimodifikasi, dan didistribusikan untuk tujuan edukasi.

---

> 🎯 **Dibuat dengan ❤️ untuk mendukung pembelajaran digital siswa SD Indonesia.**
> *Next.js 16 • TypeScript • Supabase • Auth.js • shadcn/ui • Vitest*