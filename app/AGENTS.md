# AGENTS.md — Weekend Planner (Nuxt App)

> File ini buat **AI assistant** (Cursor, Copilot, Claude, Hermes) yang bantu develop.
> Baca file ini dulu sebelum ubah kode apa pun. Bahasa: Indonesia santai, instruksi tegas.

---

## 1. Project Ini Apa

**Weekend Planner** — quiz → rekomendasi weekend Jabodetabek. Lokasi kode: `weekend-planner/app/`
(root repo ada `docs/`, `data/`, `design/` — jangan taruh kode Nuxt di sana).

**2 mode yang DIPISAH TOTAL (hasil tidak pernah dicampur):**

| Mode | Pages | API | Quota (cookie, MVP) | Target produksi |
|------|-------|-----|---------------------|-----------------|
| 🗺️ Tempat | `/quiz` → `/result` | `POST /api/tempat/recommend` | `quota_used` 1x anon | 2x/hari login, tabel `user_quota` |
| 🍜 Makan | `/makan` → `/result-makan` | `POST /api/makan/recommend` | `makan_quota_used` 2x anon | 5x/hari login, tabel `mall_search_quota` |
| 🏬 Direktori | `/mall/:slug` | `GET /api/malls`, `GET /api/malls/:slug/tenants` | tanpa quota/login/LLM | sama |

Keputusan arsitektur lengkap: `../docs/02-ADR.md`. User journey: `../docs/03-User-Journey.md`.

---

## 2. Stack (jangan ganti tanpa diskusi)

Nuxt **4.5.2** + Vue 3.5 + TS 5.6 + Tailwind 6.14 + supabase-js 2.117.2 + ESLint 9 + Vitest 5 + happy-dom.
Node ≥ 18. Deploy: Vercel (root directory = `app/`).

---

## 3. Perintah

```bash
npm run dev        # kerja harian → http://localhost:3000
npm run test       # vitest run (WAJIB hijau sebelum klaim beres)
npm run lint       # eslint (WAJIB clean, 0 error)
npm run lint:fix   # auto-fix yang bisa
npm run build      # verifikasi production (WAJIB EXIT:0 sebelum PR)
```

Urutan verifikasi setiap ubah kode: `test` → `lint` → `build`.

---

## 4. Struktur & Aturan File

```text
app/
├── pages/                  # FILE-BASED ROUTING — nama file = URL, jangan bikin router manual
│   ├── index.vue           # /
│   ├── quiz.vue            # /quiz (5Q tempat) — state lokal step/answers, redirect /result?query
│   ├── result.vue          # /result — useFetch POST /api/tempat/recommend, 3 state pending/error/data
│   ├── makan.vue           # /makan (4Q + toggle halal/kids + pre-fill ?mall=)
│   ├── result-makan.vue    # /result-makan — kartu tenant + tombol Maps
│   └── mall/[slug].vue     # /mall/:slug — direktori, search client-side
├── server/api/             # BACKEND — secret & quota HANYA di sini, tidak pernah ke browser
│   ├── tempat/recommend.post.ts   # *.post.ts = POST only (405 otomatis kalau salah method)
│   ├── makan/recommend.post.ts
│   └── malls/index.get.ts + [slug]/tenants.get.ts   # *.get.ts = GET only
├── server/utils/
│   ├── db.ts               # supabaseAdmin() singleton (service key, bypass RLS)
│   └── llm.ts              # callLLM() + generateTempat() + rankTenants() — timeout 15 dtk
├── utils/
│   └── quiz-logic.ts       # FUNGSI PURE (progressPercent, isLastStep, getMakanStartStep,
│                           # filterTenantsByKeyword, buildMapsUrl) — dipakai pages + server,
│                           # di-test di tests/. Nambah logic baru? Taruh sini kalau pure.
├── types/index.ts          # KONTRAK DATA — ubah interface di sini DULU sebelum pages/server
├── tests/quiz-logic.test.ts# Unit test vitest (12 test). Nambah fungsi pure → nambah test.
└── nuxt.config.ts          # runtimeConfig: secret (server) vs public.* (boleh ke browser)
```

**Import path:**

- Dari `pages/*.vue`: `~/utils/quiz-logic`, `~/types`
- Dari `server/api/makan/*.ts`: `../../../utils/quiz-logic` (3 level — `~/` tidak selalu resolve di server, pakai relatif)
- Dari `server/api/tempat/*.ts`: `../../utils/llm`, `../../utils/db`
- Dari `server/api/malls/*.ts`: `../../utils/db`, `../../../utils/db` sesuai kedalaman

---

## 5. Konvensi Kode (wajib)

1. **Types dulu.** Nambah field? Edit `types/index.ts` dulu, baru pages/server. Jangan pakai `any`
   (ESLint `no-explicit-any` akan merah) — pakai `TenantRow`, `RankResult`, `LLMChatResponse`, dll.
2. **Logic pure → `utils/quiz-logic.ts` + test.** Jangan duplikat rumus di tiap page.
   Fungsi di sini dilarang baca route/cookie/DB (pure: input → output).
3. **Secret hanya di server.** `hermesApiKey`, `supabaseServiceKey` cuma via `useRuntimeConfig()`
   di `server/`. Tidak pernah import ke `pages/`. Client cuma boleh `config.public.*`.
4. **Quiz = state lokal + query string.** Pages quiz tidak fetch; kirim jawaban via
   `router.push({ path, query: {...answers} })`. Pages result baca `route.query` → POST ke API.
5. **Result tidak campur.** `result.vue` hanya tempat, `result-makan.vue` hanya tenant. Jangan gabung.
6. **LLM hemat.** Kandidat selalu dari Supabase dulu (gratis, limit 30) → LLM cuma ranking + 1 kalimat
   reason. Prompt system memaksa JSON valid (tanpa disclaimer) supaya `JSON.parse` langsung.
7. **Komentar header tiap file menjelaskan: APA + KENAPA + CONTOH.** Bahasa Indonesia, singkat.
   Fungsi pure wajib JSDoc 1 baris.

---

## 6. Cara Nambah Fitur (pola standar)

**Halaman baru `/promo`:** bikin `pages/promo.vue` → otomatis jadi route. Layout global (header/footer)
ada di `app.vue` — jangan duplikat di tiap page.

**Endpoint baru `POST /api/x`:** bikin `server/api/x.post.ts` pakai pola:
`defineEventHandler` + `readBody`/`getQuery` + `supabaseAdmin()` + `createError({statusCode})`.

**Mall ke-6:** (1) row baru di tabel `malls`; (2) tenants ke `data/tenants-seed.csv` + import;
(3) 1 option di `questions[0]` dalam `pages/makan.vue`; (4) 1 entry di `mallName`
dalam `pages/mall/[slug].vue`. Tidak perlu endpoint baru.

**Fungsi pure baru:** tulis test di `tests/` DULU (tonton MERAH) → implement di
`utils/quiz-logic.ts` (tonton HIJAU) → pakai di pages/server → `npm run test && npm run lint`.

---

## 7. Testing

- Runner: **Vitest 5** + happy-dom. Config: `vitest.config.ts` (`tests/**/*.test.ts`).
- Yang di-test sekarang: 5 fungsi pure di `utils/quiz-logic.ts` (12 test: progress, last-step,
  pre-fill valid/invalid, search case-insensitive/kosong/tidak-ketemu, Maps URL).
- API routes & pages BELUM ada test (butuh mock `useRuntimeConfig`/`$fetch`/Supabase) —
  jangan klaim coverage penuh. Kalau nambah: mock di level `callLLM`, bukan HTTP sungguhan.
- TDD: test gagal dulu (MERAH) → kode minimal (HIJAU) → refactor. Satu perilaku per test.

---

## 8. JANGAN (larangan keras)

- ❌ Jangan campur rekomendasi tempat + tenant di 1 halaman / 1 response API.
- ❌ Jangan pakai `any`, jangan commit `.env` (hanya `.env.example`), jangan expose service key ke client.
- ❌ Jangan bikin backend terpisah (Express/dll) — monolit Nuxt + Supabase keputusan ADR
  (split hanya jika: client ke-2 non-web, >10rb req/hari, atau tim >3).
- ❌ Jangan ubah quota cookie jadi DB tanpa migrasi `user_quota`/`mall_search_quota` (lihat `../docs/04-Database-Schema.md`).
- ❌ Jangan rename `mall_slug` values (`grand-indonesia`, `central-park`, `kota-kasablanka`,
  `pondok-indah-mall`, `aeon-bsd`) tanpa update `makan.vue` + `[slug].vue` + tabel `malls` sekaligus.

---

## 9. Env Vars (`.env`, lihat `.env.example`)

`NUXT_PUBLIC_SUPABASE_URL`, `NUXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_KEY` (rahasia),
`HERMES_API_URL` (default `http://127.0.0.1:20128`), `HERMES_API_KEY` (rahasia), `NUXT_PUBLIC_GA_ID`.
Mapping env → runtimeConfig ada di `nuxt.config.ts`.

---

## 10. Troubleshooting Cepat

| Gejala | Cek |
|--------|-----|
| Result 500 | 9Router hidup? `curl http://127.0.0.1:20128/v1/models` |
| Result 403 `LOGIN_REQUIRED` / `MAKAN_QUOTA_EXCEEDED` | Normal (quota habis) — incognito / hapus cookie |
| `/mall/:slug` kosong | Tabel `malls`/`tenants` belum di-seed (`../data/tenants-seed.csv`) |
| 404 mall | Slug harus persis 5 nilai di Bab 8 |
| Lint merah `no-explicit-any` | Ganti dengan interface dari `types/` |
| Page blank setelah build | `NUXT_PUBLIC_*` belum diisi di `.env` / Vercel env |

README manusia (16 bab, panduan setup + troubleshooting panjang): `README.md`.
Kalau kode dan dokumen beda, **kode yang menang** — lalu update dokumen ini + README.
