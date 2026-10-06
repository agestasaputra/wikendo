# 🗓️ Weekend Planner — Dokumentasi Project Nuxt

> Quiz 30 detik → 5 rekomendasi weekend Jabodetabek + Quiz makan 20 detik → 5 tenant mall.
> Stack: **Nuxt 4 + Vue 3 + TypeScript + Tailwind + Supabase + Hermes-combo (LLM)** — hosting **Vercel, cost $0/bulan**.

Dokumen ini adalah panduan utama buat folder `app/`.
Ditulis buat **pemula**: tiap bagian menjelaskan **apa itu, kenapa ada, dan gimana cara pakainya**.

> **Buat AI assistant** (Cursor, Copilot, dsb) yang bantu develop: baca **`AGENTS.md`**
> (instruksi tegas: konvensi kode, pola nambah fitur, larangan) — bukan README ini.
> **Buat unit testing**: `npm run test` (Vitest, `tests/quiz-logic.test.ts`, 12 test buat
> fungsi pure di `utils/quiz-logic.ts`). Logic baru yang pure → taruh di sana + tambah test.

---

## Daftar Isi

1. [Gambaran Besar](#1-gambaran-besar)
2. [Tech Stack](#2-tech-stack)
3. [Struktur Folder](#3-struktur-folder)
4. [Setup & Instalasi](#4-setup--instalasi)
5. [Environment Variables](#5-environment-variables)
6. [Pages (Halaman)](#6-pages-halaman)
7. [Server API (Backend)](#7-server-api-backend)
8. [Types (Kontrak Data)](#8-types-kontrak-data)
9. [Styling (Tailwind)](#9-styling-tailwind)
10. [Lint & Code Style (ESLint)](#10-lint--code-style-eslint)
11. [Perintah NPM](#11-perintah-npm)
12. [Alur Data End-to-End](#12-alur-data-end-to-end)
13. [Quota & Batasan](#13-quota--batasan)
14. [Deploy ke Vercel](#14-deploy-ke-vercel)
15. [Troubleshooting (Masalah Umum)](#15-troubleshooting-masalah-umum)
16. [FAQ](#16-faq)

---

## 1. Gambaran Besar

**Weekend Planner** menjawab satu masalah: *decision fatigue* — bingung mau ngapain tiap weekend.

Ada **2 mode yang dipisah total** (hasilnya tidak pernah dicampur):

| Mode | Route | Input | Output | Quota |
|------|-------|-------|--------|-------|
| 🗺️ **Plan** (tempat) | `/quiz` → `/result` | 5 pertanyaan (~30 detik) | 5 rekomendasi **tempat** | Anon 1x (cookie; login 2x target produksi) |
| 🍜 **Mall** (makan) | `/makan` → `/result-makan` | 4 pertanyaan (~20 detik) | 5 rekomendasi **tenant F&B** | Anon 2x (cookie; login 5x target produksi) |

Plus 1 halaman direktori (tanpa login, tanpa quota, tanpa LLM):

| Halaman | Route | Fungsi |
|---------|-------|--------|
| 🏬 Direktori mall | `/mall/:slug` | List semua tenant 1 mall + search & filter + banner ke `/makan?mall=...` |

**Kenapa monolit (1 repo)?**
Backend = Nuxt Server Routes + Supabase. Tidak ada repo backend terpisah karena Supabase sudah jadi backend (Auth + Postgres + RLS), dan server Nuxt hanya lapisan tipis: jaga secret, enforce quota, panggil LLM. Split baru dipertimbangkan kalau: ada client ke-2 non-web, >10rb req/hari, atau tim >3 orang. (Lihat `docs/02-ADR.md`.)

---

## 2. Tech Stack

| Lapisan | Teknologi | Versi | Fungsi |
|---------|-----------|-------|--------|
| Framework | **Nuxt** | ^4.5.2 (stable) | SSR + routing + server API dalam 1 framework |
| UI | **Vue** + **Vue Router** | ^3.5 / ^4.5 | Komponen reaktif + navigasi halaman |
| Bahasa | **TypeScript** | ^5.6 | Type safety — salah ketik field ketahuan sebelum runtime |
| Styling | **Tailwind CSS** via `@nuxtjs/tailwindcss` | 6.14.0 | Utility-first CSS, tanpa tulis CSS manual |
| Database + Auth | **Supabase** (`@supabase/supabase-js`) | 2.117.2 | Postgres + Auth + Row Level Security |
| LLM | **Hermes-combo via 9Router** | — | Ranking Top 5 + alasan 1 kalimat (lihat `server/utils/llm.ts`) |
| Lint | **ESLint 9** + `@nuxt/eslint` | ^9 / 1.17.0 | Jaga konsistensi kode (`npm run lint`) |
| Hosting | **Vercel Hobby** | — | 1 project = frontend + serverless backend |
| Analytics | **GA4** | — | Event: quiz_started, quiz_completed, quota_exhausted, dll |

**Prasyarat di laptop:** Node.js ≥ 18 (cek: `node -v; npm -v`).

---

## 3. Struktur Folder

Lokasi project Nuxt: **`weekend-planner/app/`** (bukan root repo — root dipakai buat `docs/`, `data/`, `design/`).

```text
app/
├── app.vue                  # Layout global: header + <NuxtPage/> + footer
├── nuxt.config.ts           # Konfigurasi Nuxt: modules, runtimeConfig, head/SEO
├── eslint.config.mjs        # Konfigurasi ESLint (basis @nuxt/eslint)
├── tailwind.config.ts       # Token warna brand (primary cyan, accent orange)
├── package.json             # Dependencies + scripts npm
├── .env.example             # Template env (copy jadi .env, JANGAN commit .env asli)
├── .gitignore               # node_modules, .nuxt, .output, .env
│
├── pages/                   # FILE-BASED ROUTING: nama file = URL otomatis
│   ├── index.vue            #        → GET /
│   ├── quiz.vue             #        → GET /quiz        (quiz tempat, 5Q)
│   ├── result.vue           #        → GET /result      (hasil tempat)
│   ├── makan.vue            #        → GET /makan       (quiz makan, 4Q)
│   ├── result-makan.vue     #        → GET /result-makan (hasil tenant)
│   └── mall/
│       └── [slug].vue       #        → GET /mall/:slug  (direktori, cth /mall/grand-indonesia)
│
├── server/                  # BACKEND — hanya jalan di server, secret aman di sini
│   ├── api/
│   │   ├── tempat/
│   │   │   └── recommend.post.ts        # POST /api/tempat/recommend
│   │   ├── makan/
│   │   │   └── recommend.post.ts        # POST /api/makan/recommend
│   │   └── malls/
│   │       ├── index.get.ts             # GET  /api/malls
│   │       └── [slug]/
│   │           └── tenants.get.ts       # GET  /api/malls/:slug/tenants
│   └── utils/
│       ├── db.ts            # supabaseAdmin() — client Supabase pakai service key
│       └── llm.ts           # callLLM(), generateTempat(), rankTenants()
│
└── types/
    └── index.ts             # Interface TS: input quiz & bentuk rekomendasi
```

**Aturan penamaan server routes (penting buat pemula):**
`recommend.post.ts` = hanya terima HTTP POST. `index.get.ts` / `tenants.get.ts` = hanya terima HTTP GET.
Salah method → Nuxt balas 405 otomatis.

---

## 4. Setup & Instalasi

Langkah dari nol sampai jalan di laptop (5–10 menit):

```bash
# 1. Masuk folder app
cd weekend-planner/app

# 2. Install dependencies (sekali aja, ~3 menit)
npm install

# 3. Siapkan environment
cp .env.example .env
# → lalu isi nilai asli di .env (lihat Bab 5)

# 4. Jalankan dev server
npm run dev
# → buka http://localhost:3000
```

**Coba alur utama:**

1. `http://localhost:3000/` — landing, klik 🗺️ atau 🍜
2. `http://localhost:3000/quiz` — jawab 5Q → redirect `/result`
3. `http://localhost:3000/makan` — jawab 4Q → redirect `/result-makan`
4. `http://localhost:3000/mall/grand-indonesia` — direktori (butuh DBSupabase terisi)
5. `http://localhost:3000/makan?mall=grand-indonesia` — Q1 mall ke-skip otomatis (pre-fill dari direktori)

> Catatan: `/result`, `/result-makan`, dan `/mall/:slug` butuh Supabase + Hermes-combo hidup.
> Tanpa itu, halaman quiz tetap bisa dibuka, tapi generate rekomendasi akan error (lihat Bab 15).

---

## 5. Environment Variables

Copy `.env.example` → `.env`, isi nilai asli. **File `.env` tidak boleh di-commit** (sudah ada di `.gitignore`).

| Variable | Contoh | Dipakai di | Keterangan |
|----------|--------|------------|------------|
| `NUXT_PUBLIC_SUPABASE_URL` | `https://xxx.supabase.co` | Client + server | URL project Supabase. Prefix `NUXT_PUBLIC_` = boleh dibaca browser |
| `NUXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJxxx…` | Client | Anon key (aman di browser, dibatasi RLS) |
| `SUPABASE_SERVICE_KEY` | `eyJxxx…service_role` | Server SAJA (`server/utils/db.ts`) | Service-role key — **RAHASIA, jangan pernah ke client** |
| `HERMES_API_URL` | `http://127.0.0.1:20128` | Server SAJA (`server/utils/llm.ts`) | Endpoint 9Router lokal; di Vercel ganti URL prod |
| `HERMES_API_KEY` | `sk-…` | Server SAJA | API key Hermes — **RAHASIA** |
| `NUXT_PUBLIC_GA_ID` | `G-XXXXXXX` | Client | Google Analytics ID |

**Cara baca di kode (Nuxt runtimeConfig):**

```ts
// Di server (boleh akses secret):
const config = useRuntimeConfig()
config.hermesApiKey         // ✅ rahasia, hanya server
config.supabaseServiceKey   // ✅ rahasia, hanya server

// Di browser/client (hanya yang public):
config.public.supabaseUrl   // ✅ boleh
config.public.supabaseAnonKey
```

Mapping env → runtimeConfig didefinisikan di `nuxt.config.ts`.

---

## 6. Pages (Halaman)

Semua di `pages/`. **Nama file = URL otomatis** (file-based routing, tidak ada config router manual).

### `pages/index.vue` → `/` (Landing, SSR)

Hero "Bingung Weekend Mau Kemana?" + **2 CTA**: 🗺️ Cari Tempat (`/quiz`) dan 🍜 Lagi di Mall (`/makan`).
Halaman statis, cocok untuk SSR + SEO.

### `pages/quiz.vue` → `/quiz` (Quiz Tempat — 5 pertanyaan, ~30 detik)

- Konsep: **1 layar 1 pertanyaan** + progress bar + tombol Kembali.
- State lokal: `step` (index pertanyaan), `answers` (reactive object), `q` & `progress` (computed).
- Pertanyaan: `mood` → `companion` → `budget` → `location` → `time`.
- Selesai → `router.push({ path: '/result', query: { ...answers } })` — jawaban dikirim via **query string**.
- Tidak ada fetch di sini — quiz murni kumpulin jawaban di browser.

### `pages/result.vue` → `/result` (Hasil Tempat)

```ts
const { data, pending, error } = await useFetch('/api/tempat/recommend', {
  method: 'POST',
  body: route.query   // jawaban quiz dari URL
})
```

- 3 state UI: `pending` (loading ✨) → `error` (kotak merah) → `data` (5 kartu `#1–#5`: nama, kategori, reason 💡, estimasi cost, best time).
- Prinsip yang sama dipakai `result-makan.vue`.

### `pages/makan.vue` → `/makan` (Quiz Makan — 4 pertanyaan, ~20 detik)

- Q1 `mall_slug` (wajib: 5 mall V1) → Q2 `mission` → Q3 `budget_tier` → Q4 `companion` + **toggle Halal-only & Kids-friendly**.
- **Pre-fill:** kalau dibuka dari direktori (`/makan?mall=grand-indonesia`), Q1 di-skip otomatis:

```ts
const startStep = (route.query.mall && questions[0].options.some(o => o.value === route.query.mall)) ? 1 : 0
```

- Selesai → redirect `/result-makan` dengan jawaban + `halal_only` + `kids_friendly` di query string.

### `pages/result-makan.vue` → `/result-makan` (Hasil Tenant)

- POST jawaban ke `/api/makan/recommend`, render 5 kartu tenant: badge `[#N]`, `[✅ Halal / ⚠️ Non-halal]`, `[🔥 Hype]`, reason 💡, tombol **📍 Maps** (link Google Maps + info lantai).
- Prinsip "result tidak dicampur": halaman ini **hanya** render tenant, tidak ada tempat wisata.

### `pages/mall/[slug].vue` → `/mall/:slug` (Direktori — tanpa login/quota/LLM)

- `[slug].vue` = **dynamic route**: 1 file melayani `/mall/grand-indonesia`, `/mall/central-park`, dll (`route.params.slug`).
- Fetch: `useFetch('/api/malls/${slug}/tenants')` + search box client-side (`keyword` + `filtered` computed).
- Banner gradient di atas mengarah ke `/makan?mall=${slug}` (jembatan direktori → quiz).
- `TenantItem` didefinisikan lokal di file ini (bentuk ringkas buat list; bentuk lengkap ada di `TenantRecommendation`).

### `app.vue` (Layout global)

Header (logo + link 🍜 Makan + 🏬 Mall) + `<NuxtPage />` (tempat render tiap page) + footer.
Mau tambah navbar/footer global? Edit file ini, bukan tiap page.

---

## 7. Server API (Backend)

Semua di `server/`. **Kode di sini tidak pernah dikirim ke browser** — tempat aman buat secret & quota.

### `server/utils/db.ts` — Koneksi Supabase (admin)

```ts
export function supabaseAdmin() {
  // singleton: 1 client dipakai ulang (hemat koneksi)
  // pakai config.public.supabaseUrl + config.supabaseServiceKey
}
```

Dipakai semua endpoint yang baca/tulis DB. Service key **bypass RLS** — jadi validasi input & quota harus dilakukan di handler sebelum query.

### `server/utils/llm.ts` — Client LLM (Hermes-combo)

| Fungsi | Input | Output |
|--------|-------|--------|
| `callLLM(system, user)` | 2 string prompt | string (raw JSON dari LLM) |
| `generateTempat(input: QuizTempatInput)` | jawaban quiz tempat | `TempatRecommendation[]` (5 item) |
| `rankTenants(input, candidates: TenantRow[])` | preferensi + ≤30 kandidat dari Supabase | `RankResult[]` (5 item: nama + reason) |

Prinsip hemat: **filter di Supabase dulu (gratis) → LLM cuma ranking + 1 kalimat alasan**.
Prompt system memaksa LLM balas **JSON valid saja** (tanpa disclaimer) supaya bisa `JSON.parse` langsung.
Timeout 15 detik, `max_tokens: 2000`, model `hermes-combo`.

### `POST /api/tempat/recommend` — Generate tempat

File: `server/api/tempat/recommend.post.ts`

1. Baca body + siapkan `session_id` (cookie 30 hari).
2. Cek quota anon: cookie `quota_used === '1'` → 403 `LOGIN_REQUIRED`.
3. `generateTempat(body)` → simpan ke tabel `generations` (`quiz_input.type: 'tempat'`) → set `quota_used=1`.
4. Balas `{ recommendations, quota_remaining: 0 }`.

### `POST /api/makan/recommend` — Generate tenant

File: `server/api/makan/recommend.post.ts`

1. Baca body (`QuizMakanInput`) + cek cookie `makan_quota_used >= 2` → 403 `MAKAN_QUOTA_EXCEEDED`.
2. Cari `mall_id` dari `mall_slug` → query `tenants` (`is_open=true` + filter budget/halal/kids, limit 30).
3. Kosong → 404 ("Tidak ada tenant cocok. Coba ubah filter.").
4. `rankTenants(body, candidates)` → gabung data tenant + `reason` LLM + `maps_url` Google Maps → simpan `generations` (`type: 'makan'`) → quota +1.
5. Balas `{ recommendations, quota_remaining }`.

### `GET /api/malls` — List mall

File: `server/api/malls/index.get.ts`. Balas semua mall aktif (`is_active=true`, urut nama). Tanpa login/quota/LLM.

### `GET /api/malls/:slug/tenants` — List tenant 1 mall + filter

File: `server/api/malls/[slug]/tenants.get.ts`.
Query params: `?halal=true` `?budget=hemat|menengah|leluasa` `?kids=true` `?search=kopi` `?mission=nongkrong_lama`.
Filter kolom dikerjakan di SQL Supabase; filter `mission` (array) di-memory setelah fetch. Tanpa login/quota/LLM.

---

## 8. Types (Kontrak Data)

File: `types/index.ts` — **satu-satunya sumber kebenaran bentuk data**. Kalau nambah field, ubah di sini dulu, baru di page/server yang pakai.

| Interface | Dipakai di | Isi |
|-----------|------------|-----|
| `QuizTempatInput` | `quiz.vue` → `POST /api/tempat/recommend` | mood, companion, budget, location, time? |
| `QuizMakanInput` | `makan.vue` → `POST /api/makan/recommend` | mall_slug, mission, budget_tier, companion, halal_only?, kids_friendly? |
| `TempatRecommendation` | `result.vue` | name, category, reason, estimated_cost, location_area, best_time, confidence |
| `TenantRecommendation` | `result-makan.vue` | name, category, lantai, halal, budget_tier, price_range, kids_friendly, hype_tiktok, reason, maps_url |
| `TenantRow` | server makan/malls | Bentuk mentah 1 baris tabel `tenants` (+ mission?, mall_id?, is_open?) |
| `RankResult` | `rankTenants()` | name + reason (output ranking LLM) |
| `LLMChatResponse` | `callLLM()` | choices[0].message.content |

---

## 9. Styling (Tailwind)

- Provider: `@nuxtjs/tailwindcss` (terdaftar di `modules` dalam `nuxt.config.ts`).
- Token brand di `tailwind.config.ts`: `primary` cyan `#0891b2`, `accent` orange `#f97316`.
- Pola yang dipakai: utility classes langsung di template (`bg-orange-500`, `rounded-2xl`, `max-w-2xl`), gradient hero (`bg-gradient-to-br from-cyan-600`), badge (`rounded-full`), kartu (`bg-white rounded-2xl shadow-sm border p-5`).
- Pemula: tidak perlu tulis file CSS — cukup kombinasikan utility classes. Kalau butuh warna/ukuran baru, tambah dulu ke `tailwind.config.ts` biar konsisten.

---

## 10. Lint & Code Style (ESLint)

- Config: `eslint.config.mjs` memakai `withNuxt()` dari `@nuxt/eslint` (aturannya ngikut best practice Nuxt/Vue/TS otomatis) + modul `@nuxt/eslint` terdaftar di `nuxt.config.ts`.
- Perintah:

```bash
npm run lint       # cek saja (dipakai di CI)
npm run lint:fix   # cek + perbaiki otomatis yang bisa (urutan atribut Vue, dst)
```

- Aturan yang pernah kena di project ini (biar tidak diulang):
  - `@typescript-eslint/no-explicit-any` → **jangan pakai `any`**; pakai interface dari `types/` (`TenantRow`, `RankResult`, dll).
  - `@typescript-eslint/no-unused-vars` → hapus parameter/variabel yang tidak dipakai (atau prefix `_`).
  - `vue/attributes-order` + `vue/html-self-closing` → warning, bisa auto-fix via `lint:fix`.

---

## 11. Perintah NPM

| Perintah | Fungsi | Kapan dipakai |
|----------|--------|---------------|
| `npm install` | Install dependencies | Sekali di awal / tiap pull yang ubah `package.json` |
| `npm run dev` | Dev server + hot reload | Kerja harian → `http://localhost:3000` |
| `npm run build` | Build production | Sebelum deploy / verifikasi tidak ada error |
| `npm run preview` | Jalankan hasil build lokal | Cek hasil `build` persis seperti di server |
| `npm run generate` | Pre-render statis | Kalau butuh output statis (jarang dipakai di MVP ini) |
| `npm run lint` | Cek ESLint | Sebelum commit |
| `npm run lint:fix` | Perbaiki lint otomatis | Kalau `lint` merah yang bisa auto-fix |
| `npm run test` | Jalankan unit test (Vitest, 12 test) | **Wajib hijau** sebelum klaim beres |
| `npm run test:watch` | Test watch mode (jalan ulang tiap save) | Saat nulis kode + test bareng |
| `npx nuxi --version` | Cek versi Nuxt | Diagnosa (`nuxi` = CLI resmi Nuxt) |

---

## 12. Alur Data End-to-End

**Mode Plan (tempat):**

```text
[quiz.vue] jawab 5Q (browser only)
   │  router.push /result?mood=..&companion=..&...
   ▼
[result.vue] useFetch POST /api/tempat/recommend (body = query)
   │  ┌─ cek cookie quota_used → 403 kalau habis
   │  ├─ generateTempat() → callLLM(hermes-combo) → 5 tempat
   │  └─ INSERT generations {type:'tempat'} + set cookie
   ▼
render 5 kartu tempat
```

**Mode Mall (makan):**

```text
[makan.vue] jawab 4Q + toggle halal/kids (browser only)
   │  router.push /result-makan?mall_slug=..&mission=..&...
   ▼
[result-makan.vue] useFetch POST /api/makan/recommend
   │  ┌─ cek cookie makan_quota_used → 403 kalau habis
   │  ├─ Supabase: mall_slug → mall_id → filter tenants (GRATIS, limit 30)
   │  ├─ rankTenants() → callLLM ranking Top 5 + reason
   │  └─ gabung data tenant + maps_url → INSERT generations {type:'makan'}
   ▼
render 5 kartu tenant + tombol Maps
```

**Direktori (tanpa LLM):**

```text
[mall/[slug].vue] → GET /api/malls/:slug/tenants?halal&budget&...
   └─ Supabase langsung → list tenant → search client-side
```

---

## 13. Quota & Batasan

| Aturan | Implementasi sekarang | Target produksi (lihat `docs/04-Database-Schema.md`) |
|--------|----------------------|------------------------------------------------------|
| Tempat 2x/hari | Cookie `quota_used` (anon 1x → login) | Tabel `user_quota`, reset 00:00 WIB, enforce di DB |
| Makan 5x/hari (terpisah) | Cookie `makan_quota_used` (max 2 untuk anon) | Tabel `mall_search_quota`, reset 00:00 WIB |
| Result tidak campur | Page & endpoint terpisah total | Sama — kontrak tidak berubah |
| Timeout LLM | 15 detik (`server/utils/llm.ts`) | Sama |

> Cookie = solusi sementara buat MVP. Sebelum launch, pindahkan ke quota DB biar tidak bisa di-bypass dengan hapus cookie.

---

## 14. Deploy ke Vercel

1. Push folder ini ke GitHub (atau set root directory = `app/` kalau monorepo).
2. Di Vercel: **New Project → import repo → Framework: Nuxt.js** (auto-detect).
3. Isi **Environment Variables** (lihat Bab 5 — nilai PROD, bukan lokal).
4. Deploy. Setiap push ke `main` = deploy otomatis + preview URL per PR.
5. Cek: `/` → `/quiz` → `/result`, `/makan` → `/result-makan`, `/mall/grand-indonesia`.

---

## 15. Troubleshooting (Masalah Umum)

| Gejala | Penyebab paling mungkin | Cara cek / fix |
|--------|------------------------|----------------|
| `npm run dev` error `ECONNREFUSED` / halaman result 500 | `HERMES_API_URL` salah / 9Router tidak jalan | `curl http://127.0.0.1:20128/v1/models` — harus balas JSON, bukan refused |
| Result 403 `LOGIN_REQUIRED` / `MAKAN_QUOTA_EXCEEDED` | Quota cookie habis (normal, bukan bug) | Buka incognito / hapus cookie / login untuk jatah lebih |
| Direktori `/mall/...` kosong | Tabel `malls`/`tenants` di Supabase belum di-seed | Import `data/tenants-seed.csv` (200 rows) ke Supabase |
| `useFetch` 404 di `/mall/:slug` | Slug salah (cek: `grand-indonesia`, `central-park`, `kota-kasablanka`, `pondok-indah-mall`, `aeon-bsd`) | Samakan dengan kolom `slug` di tabel `malls` |
| `npm run lint` merah `no-explicit-any` | Ada tipe `any` di kode baru | Ganti dengan interface dari `types/index.ts` |
| Build lolos tapi page blank | `NUXT_PUBLIC_*` belum diisi di `.env` / Vercel env | Cek `runtimeConfig.public` di `nuxt.config.ts` vs env yang ada |
| `nuxt prepare` / TS error setelah pull | `node_modules` basi | `rm -rf node_modules .nuxt && npm install` |

---

## 16. FAQ

**Q: Project Nuxt-nya ada di mana?**
A: Di `weekend-planner/app/`. Root repo (`docs/`, `data/`, `design/`) sengaja di luar biar dokumentasi, seed CSV, dan prototype tidak kecampur kode.

**Q: Kenapa tidak ada backend terpisah (mis. Express/FastAPI)?**
A: Keputusan sadar (ADR): Supabase sudah jadi backend (DB+Auth), server Nuxt cuma lapisan tipis (secret, quota, LLM). Bikin repo backend sendiri = +8–12 jam tanpa nilai user. Split hanya kalau ada trigger: client ke-2 non-web, >10rb req/hari, atau tim >3 orang.

**Q: Kenapa quiz tempat dan quiz makan dipisah?**
A: Beda momen butuh (planning di rumah vs lapar di mall), beda quota, dan hasil tidak boleh campur (keputusan owner, Addendum v1.1 LOCKED). Satu quiz campuran bikin bingung + decision fatigue balik lagi.

**Q: LLM dipakai buat apa aja? Biar hemat gimana?**
A: Cuma 2 hal: generate 5 tempat + ranking 5 tenant. Daftar kandidat selalu dari Supabase dulu (gratis), LLM tidak pernah browsing/list dari nol.

**Q: Mau nambah mall ke-6, langkahnya apa?**
A: (1) Tambah row di tabel `malls`; (2) tambah tenants di `tenants-seed.csv` + import; (3) tambah 1 option di `questions[0]` dalam `pages/makan.vue`; (4) tambah 1 entry di `mallName` dalam `pages/mall/[slug].vue`. Tidak perlu endpoint baru.

**Q: Mau nambah halaman baru?**
A: Bikin 1 file di `pages/nama.vue` → otomatis jadi route `/nama`. Kalau dinamis: `pages/x/[id].vue` → `/x/apapun`.

**Q: Mau nambah endpoint API baru?**
A: Bikin file di `server/api/...` ikut pola nama (`*.get.ts` / `*.post.ts`), pakai `supabaseAdmin()` dari `server/utils/db.ts` buat DB dan `defineEventHandler` + `createError` buat handler.

---

*Terakhir diverifikasi: Nuxt 4.5.2 · `npm run lint` clean · `npm run build` EXIT:0. Kalau ada yang tidak sesuai dengan kode, kode yang menang — lalu update dokumen ini.*
