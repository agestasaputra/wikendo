# 08-PROGRESS.md — Board + Log Eksekusi Weekend Planner

> **Sumber tunggal jawaban "kita udah sampai mana?". File ini = board + log.**
> Aturan main (SOP permanen, dikunci 6 Okt 2026):
> 1. **BOARD (atas)** = posisi SEKARANG: NOW / NEXT / BACKLOG / DONE ringkas. Update tiap eksekusi (pindah kartu).
> 2. **LOG (bawah)** = jejak eksekusi, newest first. Tiap sesi dev tambah 1 entry: fase → kenapa → file diubah → verifikasi → next.
> 3. Tiap brainstorming yang mengubah plan → update 3 tempat: `02-ADR.md`/`07-Addendum` (KENAPA) + `06-MVP-Checklist.md` (APA) + file ini (KAPAN).
> 4. Tiap eksekusi → file ini WAJIB diupdate + dikirim ke Agesta via Telegram.
> 5. Rencana adanya di `01-PRD.md` + `06-MVP-Checklist.md`. File ini catat status + yang SUDAH kejadian. PLAN.md ditolak (duplikat).
>
> Kenapa 1 file, bukan Trello/Notion? Solo founder + semua di git + AI bisa update otomatis tiap kerjaan.
> Kalau nanti ada engineer pembantu, board pindah ke GitHub Projects, file ini tetap jadi memori.

---

## 📌 BOARD — posisi per 6 Okt 2026 malam

### 🔥 NOW (lagi dikerjain)
- [~] Patch `02-ADR.md` v2.0 → v2.1 (6 titik: header, Nuxt 4, endpoint split, flow makan, DB tri-state, amendment log) — 2/6 beres
- [ ] Patch `07-Addendum` Section 5 (skema `data_source`/`verified_at`/`needs_survey` + `raw_scrape`) — antri tepat setelah ADR

### ⏳ NEXT (antrian dekat)
- [ ] Push repo ke GitHub + bikin Projects board (15 mnt)
- [ ] Run migration + seed ke Supabase beneran (butuh dashboard user)
- [ ] 8.4 E2E (butuh DB seeded dulu)
- [ ] Auth: login/register/callback/middleware (0 file = blocker quota login + Simpan/history)

### 📦 BACKLOG (nanti)
- [ ] `components/`/`composables/`/`layouts/` + `GET /api/health` (UI masih inline)
- [ ] Vote/report tenant P1 (`POST /api/vote`, `POST /api/report-tenant`)
- [ ] Sisa Phase 4-7 yang belum dicentang rapi (sinkron lanjutan checklist)
- [ ] Scraper `raw_scrape` → parser per-mall (post-PMF)

### ✅ DONE (ringkas — detail di LOG bawah)
- [x] Docs awal 5 Okt (PRD+ADR+Journey+API+Checklist v1.0+Addendum v1.1+CSV 200)
- [x] Scaffold + 3-in-1 (Nuxt 4.5.2, TDD 12/12, AGENTS.md, README 458 baris)
- [x] Phase 8.1 Backend Mall (migration 4 tabel + seed 205 INSERT, pytest 8/8)
- [x] Patch NULL tri-state + AUDIT (Vitest 12/12, pytest 10/10, lint clean, build 3.15 MB)
- [x] Sinkron checklist v1.1 + git init (commit `2015d19` + `2648be9`, secrets bersih)
- [x] PROGRESS.md v1 → v2 board (file ini, feedback Agesta 6 Okt malam)

---

## 🧾 LOG (newest first)

## 2026-10-06 malam — PROGRESS.md jadi board (✅ BERES, SOP baru)
- **Fase:** Dokumentasi. Feedback Agesta: "PROGRESS.md = kanban/board kita".
- **Keputusan CTO:** SETUJU dengan modifikasi — 1 file, 2 section (BOARD atas + LOG bawah). Murni log = susah lihat "lagi dimana". Tool terpisah (Trello/Notion) = ditolak (tool ke-3, mati dalam seminggu buat solo founder).
- **Dikerjain:**
  - `docs/08-PROGRESS.md` v1 → v2: tambah BOARD (NOW/NEXT/BACKLOG/DONE) + SOP kirim file tiap eksekusi.
  - Kunci SOP di memory: tiap eksekusi wajib update + kirim PROGRESS.md.
- **File diubah:** `docs/08-PROGRESS.md`.
- **Verifikasi:** docs only, no code change.
- **Next:** Lanjut patch ADR sisa (4/6) + Addendum, tiap patch update BOARD + kirim file.

## 2026-10-06 malam — Patch ADR v2.1 + Addendum (🔥 IN PROGRESS, 2/6)
- **Fase:** Dokumentasi. Brainstorming terakhir ngasilin keputusan yang belum masuk docs formal.
- **Kenapa:** ADR masih bilang Nuxt 3 + `/api/generate` tunggal, belum ada NULL tri-state + `raw_scrape`. Addendum Section 5 belum ada kolom metadata baru.
- **Dikerjain (parsial):**
  - `02-ADR.md` header v2.0 → v2.1 Amended + amendment Nuxt 4.5.2 (struktur folder real + Prettier ditolak).
  - Sisa: endpoint split, flow makan, DB tri-state, amendment log.
  - `07-Addendum` Section 5: BELUM (antri).
- **File diubah:** `docs/02-ADR.md` (2 patch), `docs/07-PRD-Addendum-Mall-F&B.md` (0).
- **Verifikasi:** docs only, no code change.
- **Next:** Selesaikan 4 patch sisa → update BOARD → kirim file.

## 2026-10-06 — Sinkron checklist v1.1 + git init (✅ BERES)
- **Fase:** Dokumentasi (bukan fitur). Checklist v1.0 → v1.1.
- **Kenapa:** Checklist tertinggal dari kode (8.1 beres tak tercatat, kode 8.2/8.3 tak dicentang, Phase 8 nyelip sebelum Phase 4). User ngerasa "kurang terdokumentasi" — valid.
- **Dikerjain:**
  - `docs/06-MVP-Checklist.md` → v1.1: status real (8.1 ✅, 8.2/8.3 code-complete, 1.1/1.3/2.3/3.x sebagian, auth 0%).
  - `.gitignore` root (1 file ngecover `app/`, `supabase/`, `.env`, `__pycache__`).
  - `docs/08-PROGRESS.md` v1 dibuat — ganti usulan PLAN.md (ditolak: rencana sudah ada 3 file, yang hilang itu jejak eksekusi).
  - `git init` + `branch -m main` + commit awal `2015d19` (51 files, secrets scan bersih, `node_modules`/`.env` ke-exclude).
- **File diubah:** `docs/06-MVP-Checklist.md`, `.gitignore`, `docs/08-PROGRESS.md`.
- **Verifikasi:** docs + git only, no code change. Scan secrets bersih (cuma placeholder `sk-...` + hash npm).
- **Next:** Push ke GitHub + bikin Projects board → lanjut 8.4 testing E2E.

## 2026-10-06 — Patch NULL tri-state + AUDIT (✅ BERES, full hijau)
- **Fase:** 8.1 hardening (approved user).
- **Keputusan:** Field belum riset = `NULL` (bukan `FALSE`/`""`). Alasan: `""`→`FALSE` itu overclaim bahaya (halal!). `NULL` = antrian survey + auto-exclude dari filter `.eq(true)`.
- **Dikerjain:**
  - `supabase/generate_seed.py`: `to_bool_nullable()` + `sql_*_nullable()` + `tenant_to_sql()` emit `data_source`/`verified_at`/`needs_survey`.
  - `supabase/migration.sql`: kolom `data_source`/`verified_at`/`needs_survey` + tabel `raw_scrape` staging + RLS closed + 2 index.
  - `supabase/seed.sql`: regenerate 205 INSERT (5 mall + 200 tenant).
  - `app/types/index.ts`: `boolean | null` + metadata.
  - `server/api/makan/recommend.post.ts` + `malls/[slug]/tenants.get.ts`: JSDoc tri-state + passthrough metadata.
  - `pages/result-makan.vue` + `pages/mall/[slug].vue`: badge ❓ Belum terverifikasi + 📋 Perlu survey.
  - `supabase/AUDIT.md` (baru): valid bersyarat vs wajib survey (halal 194/200 mustahil, is_open 200/200 mustahil, lantai aneh `Foodprint`/`Tribeca`).
  - `docs/04-Database-Schema.md` + `supabase/README.md`: dokumentasi NULL + staging.
- **Verifikasi:** Vitest 12/12 ✅, pytest 10/10 ✅, ESLint clean ✅, build 3.15 MB ✅.
- **Next:** Run migration+seed ke Supabase beneran.

## 2026-10-06 — Phase 8.1 Backend Mall (✅ BERES)
- **Fase:** 8.1 DB + Seed.
- **Dikerjain:** `migration.sql` (4 tabel + RLS), `generate_seed.py` (CSV→SQL, escape quote, mission ARRAY), `seed.sql` 205 INSERT, `supabase/README.md`, `tests/test_generate_seed.py` 8 test.
- **Verifikasi:** pytest 8/8 ✅, build hijau ✅.
- **Next:** Patch NULL (dikerjain di entry atas).

## 2026-10-06 — Scaffold + 3-in-1 (✅ BERES)
- **Fase:** Phase 1 sebagian + fondasi permanen.
- **Dikerjain:** Nuxt 3.17→4.5.2 + ESLint + Tailwind, `utils/quiz-logic.ts` (TDD 12/12), `AGENTS.md`, JSDoc 18 file, `README.md` 458 baris beginner-friendly, quota cookie jujur.
- **SOP dikunci:** README + inline APA/KENAPA + AGENTS.md + TDD Vitest + verifikasi test→lint→build. Berlaku tiap project apps.
- **Verifikasi:** Vitest 12/12 ✅, lint clean ✅, build hijau ✅.

## 2026-10-05 — Docs awal (✅ BERES)
- **Dikerjain:** `01-PRD.md`, `02-ADR.md` (monolit Nuxt+Supabase, $0), `03-User-Journey.md` (616 baris, 3 journey), `05-API-Spec`, `06-MVP-Checklist.md` v1.0, `07-Addendum-Mall-F&B` v1.1 (split quiz total), CSV 200 rows (5 mall x 40, AI-dummy).
- **Next:** Eksekusi Phase 1 (mulai dari scaffold — sudah dikerjain 6 Okt).
