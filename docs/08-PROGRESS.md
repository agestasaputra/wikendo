# 08-PROGRESS.md — Board + Log Eksekusi Wikendo (`wikendo-web-app`)

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
- [ ] Push repo ke GitHub + bikin Projects board (15 mnt, butuh URL repo dari Agesta)

### ⏳ NEXT (antrian dekat)
- [ ] Auth slice: login/register/callback/middleware (0 file = blocker quota login + Simpan/history)
- [ ] Run migration + seed ke Supabase beneran (butuh dashboard user)
- [ ] 8.4 E2E (butuh DB seeded dulu)

### 📦 BACKLOG (nanti)
- [ ] `components/`/`composables/`/`layouts/` + `GET /api/health` (UI masih inline)
- [ ] Vote/report tenant P1 (`POST /api/vote`, `POST /api/report-tenant`)
- [ ] Sisa Phase 4-7 yang belum dicentang rapi (sinkron lanjutan checklist)
- [ ] Scraper `raw_scrape` → parser per-mall (post-PMF)

### ✅ DONE (ringkas — detail di LOG bawah)
- [x] Rename repo `weekend-planner` → `wikendo-web-app` + lock brand Wikendo (folder mv, 13 file patch, git mv 2 artefak, verify test 12/12 + lint + pytest 10/10 + build 3.15MB ✅, commit rename)
- [x] Docs awal 5 Okt (PRD+ADR+Journey+API+Checklist v1.0+Addendum v1.1+CSV 200)
- [x] Scaffold + 3-in-1 (Nuxt 4.5.2, TDD 12/12, AGENTS.md, README 458 baris)
- [x] Phase 8.1 Backend Mall (migration 4 tabel + seed 205 INSERT, pytest 8/8)
- [x] Patch NULL tri-state + AUDIT (Vitest 12/12, pytest 10/10, lint clean, build 3.15 MB)
- [x] Sinkron checklist v1.1 + git init (commit `2015d19` + `2648be9`, secrets bersih)
- [x] PROGRESS.md v1 → v2 board (file ini, feedback Agesta 6 Okt malam)
- [x] Workflow permanen dikunci di skill `agesta-app-workflow` (7 section, auto-apply project baru)
- [x] Patch ADR v2.0 → v2.1 (6/6: Nuxt 4, endpoint split, flow makan, struktur real, NULL tri-state, LLM hemat, change log)
- [x] Patch Addendum v1.1 → v1.2 (Section 5: skema metadata + `raw_scrape` + aturan NULL)

---

## 🧾 LOG (newest first)

## 2026-10-07 dini hari — Rename repo `weekend-planner` → `wikendo-web-app` + lock brand Wikendo ✅ BERES
- **Kenapa:** Agesta lock brand Wikendo (verifikasi verdict AMAN) + minta repo jadi `wikendo-web-app`. Timing perfect: remote GitHub masih kosong + belum deploy Vercel → rename sekarang gratis, nanti mahal.
- **Eksekusi:** `mv weekend-planner → wikendo-web-app` + patch 13 file (package.json/lock UI title+footer app.vue 2x AGENTS.md README app 3x README root 7x API-spec 4 URL schema.md backup prototype README 3x PROGRESS next-line) + `git mv` 2 artefak (wireframes.md + complete-docs.pdf) + ganti sebutan "Weekend Planner" → "Wikendo" di judul/docs/UI.
- **Files TIDAK diubah (sengaja, alasan):** `01-PRD.md` Final Locked (sebutan internal, nggak ngaruh runtime), `.gitignore` (pattern generik), `data/*.csv`, `supabase/*`, `design/prototype/*.html` (konten prototype, bukan brand live).
- **Verifikasi:** test 12/12 ✅, lint EXIT:0 ✅, pytest 10/10 ✅, build 3.15 MB ✅ — rename 100% aman, logic nol berubah.
- **Next:** push ke GitHub (`wikendo-web-app`, private) — butuh URL repo dari Agesta.

## 2026-10-06 malam — Verifikasi final Wikendo (lock candidate Agesta)
- **Status:** Agesta suka Wikendo. Verifikasi fresh 2026-10-06: wikendo.id RDAP 404 = AVAILABLE, wikendo.com = parkir Hostinger (bukan bisnis aktif), App Store ID 0 hasil, Play Store 0 app, web search no brand/perusahaan/startup (hasil cuma linguistik "wikendo" + generik).
- **Verdict:** AMAN untuk di-lock sebagai brand (dengan 2 catatan: DJKI manual + .com parked).
- **Next:** 1) cek DJKI manual PDKI kelas 9/35/42, 2) amankan wikendo.id, 3) kunci handle IG/TikTok @wikendo, 4) rename repo → `wikendo-web-app` (DONE, lihat LOG rename di bawah).
- **File diubah:** `docs/08-PROGRESS.md`.

## 2026-10-06 malam — Riset 38 nama EN Tier S/A/B (domain + store + bisnis)
- **Scope:** Tier S 8 + Tier A 14 + Tier B 16 = 38 nama. Cek: .id RDAP PANDI, .com RDAP Verisign+DNS+landing title, App Store ID iTunes API, Play Store scraping + pkg-match, web search finalis bersih.
- **.id AVAILABLE (24):** pickly, scouty, treatly, sunyay, res momentseto, sparky, nomly, slurpo, feasto, bruncho, brewo, outgo, dally, amblo, strolly, detouro, joyrio, waygo, gemly, alleyo, hearty, savy, mainly, hoodly. TAKEN (14): hoppin, hideout, hangry, cuppa, mello, toasty, fizzy, bubbly, zesty, sippo, mappin, porto, pitstop, metime.
- **.com HANYA 1 AVAILABLE:** res momentseto. Sisanya TAKEN (beberapa mati/parkir: pickly, sunyay, treatly, sparky, dally, mainly, hoodly, bruncho = registered tapi no-site, bisa ditawar; joyrio/detouro/alleyo/hearty = parking 114B; brewo = perusahaan lem Polandia aktif; scouty = scouty.com aktif; outgo = DAT Outgo; waygo = Waygo translator; savy = savy.com aktif; slurpo = dijual BrandBucket premium).
- **App Store 0 hasil (7, paling bersih):** sunyay, res momentseto, bruncho, brewo, amblo, joyrio, alleyo. Near-clean: slurpo, sippo, detouro. Danger exact lokal: hangry (HANGRY! PT Modular Kuliner Indonesia), porto (Porto HRIS PT Porto Indonesia), feasto (Feasto POS F&B), hoodly (Hoodly foodtech), strolly (Strolly Baby-Friendly Places travel).
- **Play Store 0 hasil (1):** joyrio (TOTAL 0 app). Bersih pkgmatch kosong: sunyay, slurpo, bruncho, brewo, amblo, detouro, alleyo, treatly, mainly, res momentseto, hoppin (no exact pkg).
- **Verdict bersih total (6):** joyrio (terbersih: .id free + Play 0 + iOS 0 + web no-brand; .com parked), sunyay (.id free + iOS 0 + Play bersih; .com registered-mati), amblo (.id free + iOS 0 + Play bersih; .com fwd bitoil), detouro (.id free + Play bersih; .com parked), alleyo (.id free + iOS 0 + Play bersih; .com parked), res momentseto (SATU-SATUNYA double .id+.com AVAILABLE + iOS 0 + Play bersih).
- **Gugur keras:** hangry, porto, feasto, hoodly (tabrakan lokal/F&B), waygo, outgo, scouty, savy, brewo (bisnis global aktif), mello/fizzy/zesty/bubbly/nomly/sparky/mappin/metime/pitstop (crowded exact dua store).
- **DJKI:** tetap manual PDKI kelas 9/35/42 (server tidak bisa JS).
- **Rekomendasi:** Res momentseto (aset double domain) vs Joyrio (terbersih non-res momentseto) vs Sunyay (ceria, brandable). Detail + ranking di chat.
- **File diubah:** `docs/08-PROGRESS.md`.
- **Next:** Agesta pilih 1-2 finalis → cek DJKI manual → amankan .id.

## 2026-10-06 malam — 7 kandidat Inggris + verifikasi (domain + store + web)
- **Kandidat:** Wikendo / Planit / Outly / Whereto / Spotly / Dayoff / Roamly.
- **✅ BERSIH (1):** Wikendo (.id AVAILABLE + App Store 0 + Play 0 hasil + web no brand; .com taken tapi cuma parkir Hostinger, bisa ditawar).
- **❌ GUGUR (6):** Planit (.id+.com taken + 50 Play + 9 iOS, crowded); Outly (.com = startup food outly.world + app com.outly.africa exact + tool Paris useoutly.com); Whereto (.com = produk WhereTo aktif + com.wheretoapp exact + 8 iOS travel); Spotly (10 iOS + 12 Play exact matches); Dayoff (.id+.com taken + app KPop DAY OFF + dayoffcompany travel Korea); Roamly (.com = insurtech US aktif + banyak app travel/eSIM Roamly).
- **Insight:** nama Inggris 1/7 lolos vs Indonesia 5/15 — namespace Inggris jauh lebih crowded global. Finalis EN cuma Wikendo.
- **DJKI:** tetap wajib cek manual PDKI kelas 9/35/42 sebelum lock.
- **Rekomendasi:** Wikendo (EN) vs Wikenin/Enaknya (ID) — putusan di rekomendasi chat.
- **File diubah:** `docs/08-PROGRESS.md`.
- **Next:** Agesta lock 1 nama (ID vs EN) → cek DJKI manual → amankan .id.

## 2026-10-06 malam — Verifikasi nama brand 15/15 (domain + store + web)
- **Konteks:** "Weekend Planner" tabrakan + generik. Cek penuh 15 kandidat: .id via RDAP PANDI, .com via RDAP Verisign+DNS, App Store ID via iTunes API, Play Store via scraping, web via search.
- **❌ GUGUR (6):** Pilihin (.com judol PRADA888 + .id parked + .app startup foto aktif); Dolan (dolan.id = AI trip planner kompetitor + app Dolan Travel di App Store + com.dolan.id di Play); Liburin (app Liburin Travel di App Store, kategori sama persis); Jalanin (PT Djalanin Wisata Jaya aktif 2021 + djalanin.com + jalanin.org); Kemana (.id+.com taken + generik); Pelesir (.id+.com taken + kata generik Traveloka/Tiket).
- **⚠️ RISIKO (4):** Mamana (.id+.app free tapi tabrakan app pregnancy di Play+App Store); Mampir (MAMPIR route-optimizer + Yuk Mampir kuliner di Play); Nongki (startup Makassar + Bandung + nongkee.com, nongki.com dijual HugeDomains); Gaskuy (Gaskuy.ID itinerary 1000startup + gaskuy.co.id tour organizer + crowded "kuy").
- **✅ BERSIH (5):** Wikenin (.id+.com AVAILABLE + App Store 0 + Play 0 hasil — paling bersih); Kulinin (.id+.com AVAILABLE + store bersih, catatan: mirip Kulina F&B); Enaknya (.id AVAILABLE + store bersih, .com premium $1,888 skip); Piknikin (.id free + store bersih); Healingin (.id free + store bersih, trend-risk + 9 huruf).
- **DJKI:** belum bisa otomatis (PDKI butuh JS, browser server mati) — wajib cek manual pdki-indonesia.dgip.go.id menu Merek kelas 9/35/42 untuk finalis sebelum lock.
- **Rekomendasi:** Wikenin (data terbersih) atau Enaknya (brand terkuat, bunyi paling nempel). Kulinin opsi tengah (domain double + makan-kuat).
- **File diubah:** `docs/08-PROGRESS.md`.
- **Next:** Agesta lock 1 nama → cek DJKI manual → amankan domain .id.

## 2026-10-06 malam — Patch ADR v2.1 + Addendum v1.2 (✅ BERES, 8 patch)
- **Fase:** Dokumentasi. Brainstorming terakhir (split quiz, NULL tri-state, staging scrape, LLM hemat) belum masuk docs formal.
- **Dikerjain:**
  - `02-ADR.md` v2.0 → v2.1: header amended + Nuxt 4.5.2 + arsitektur split + flow tempat/makan + struktur backend real + quota split 2/5 + NULL tri-state + staging `raw_scrape` + pola LLM makan + tabel + status + change log (8 patch).
  - `07-Addendum` v1.1 → v1.2: header + skema `tenants` (halal/kids/hype DEFAULT NULL + metadata) + staging `raw_scrape` + aturan NULL + referensi AUDIT (3 patch).
- **File diubah:** `docs/02-ADR.md`, `docs/07-PRD-Addendum-Mall-F&B.md`, `docs/08-PROGRESS.md`.
- **Verifikasi:** docs only, no code change. PRD utama TIDAK diubah (Final & Locked, sesuai aturan Addendum).
- **Next:** Push GitHub (butuh URL repo dari Agesta) → Auth slice.

## 2026-10-06 malam — Workflow permanen dikunci (✅ BERES)
- **Fase:** SOP. Request Agesta: "simpan semua workflow, pasti dipakai buat project lain".
- **Dikerjain:**
  - Skill baru `agesta-app-workflow` (7 section: alur dokumen solo vs company, struktur docs, format PROGRESS, scaffold+TDD, git+secrets, gaya kerja, checklist project baru).
  - Memory diringkas → pointer ke skill (hemat 194 chars, 54% → 45%).
- **File diubah:** skill `agesta-app-workflow` (di `~/.hermes/skills/`), memory.
- **Verifikasi:** `skill_view` reload penuh ✅, siap auto-apply tiap project baru.
- **Next:** Project app baru = skill ini + checklist 6 langkah di section 7.

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
