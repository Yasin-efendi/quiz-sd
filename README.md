# Quiz SD

Aplikasi kuis pembelajaran untuk Sekolah Dasar berbasis Next.js 16 + Supabase.

## Fitur

- Kuis interaktif dengan navigasi soal bebas
- Halaman hasil dengan skor dan pembahasan lengkap
- Panel admin untuk manajemen pelajaran, pertemuan, dan soal
- Riwayat pengerjaan kuis siswa
- Token JWT untuk hasil kuis (berlaku 7 hari)

## Tech Stack

- **Framework**: Next.js 16 (App Router) + TypeScript
- **UI**: shadcn/ui + Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Auth**: Auth.js (NextAuth) v5 beta
- **Validasi**: Zod
- **Testing**: Vitest

## Instalasi

### 1. Clone & Install

\`\`\`bash
git clone <url-repo-anda>
cd quiz-sd
npm install
\`\`\`

### 2. Buat file .env.local

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=isi_dengan_random_string_panjang
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
\`\`\`

Untuk generate NEXTAUTH_SECRET:
\`\`\`bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
\`\`\`

### 3. Setup Supabase

Buka SQL Editor di dashboard Supabase, jalankan dua file berikut secara berurutan:

- `supabase/migration.sql` — membuat tabel
- `supabase/seed.sql` — mengisi data awal

### 4. Jalankan Development Server

\`\`\`bash
npm run dev
\`\`\`

Buka [http://localhost:3000](http://localhost:3000)

## Akun Admin Default

| Username | Password |
|---|---|
| admin | admin123 |

Akses panel admin di [http://localhost:3000/admin](http://localhost:3000/admin)

## Struktur Halaman

| Halaman | URL |
|---|---|
| Daftar kuis | `/` |
| Halaman kuis | `/quiz/[slug]` |
| Halaman hasil | `/result/[token]` |
| Login admin | `/admin/login` |
| Dashboard admin | `/admin` |
| Manajemen pelajaran | `/admin/subjects` |
| Manajemen pertemuan | `/admin/meetings` |
| Bank soal | `/admin/questions` |
| Riwayat attempt | `/admin/attempts` |

## Menjalankan Test

\`\`\`bash
npx vitest run
\`\`\`

## Struktur Folder

\`\`\`
quiz-sd/
├── app/
│   ├── admin/
│   │   ├── (protected)/   # halaman admin (butuh login)
│   │   └── login/
│   ├── api/               # API routes
│   ├── quiz/[slug]/       # halaman kuis
│   └── result/[token]/    # halaman hasil
├── components/
│   ├── admin/
│   ├── quiz/
│   └── ui/                # shadcn/ui components
├── lib/
│   ├── supabase/
│   ├── validations/
│   ├── auth.ts
│   ├── token.ts
│   └── utils.ts
└── tests/
\`\`\`
\`\`\`