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

## 📌 BOARD — posisi per 8 Okt 2026 (integrasi Supabase NOW, gradasi BACKLOG)

### 🔥 NOW (lagi dikerjain)
- [ ] Integrasi Supabase DB (NOW ⏳ 8 Okt): wire project → run migration + seed → env lokal + Vercel → verifikasi endpoint baca DB beneran
- [ ] NEXT: finalin lockup resmi (master mark + wordmark) + pasang ke header web & favicon + stamp voucher 1-warna
- [x] UI kombo slice-1→4 (DONE ✅ 7 Okt): Home wallet + quiz swipe + result deck/voucher + direktori SEO (`e12be1b` live, prod 200 `QUOTA HARI INI` ✅)
- [x] Logo board v1 30 opsi (DONE ✅ 7 Okt malam): `design/logo-wikendo-30.html` — campur wordmark, KURANG cocok (Agesta: prefer icon-first app icon)
- [ ] Logo board v2 icon-first 30 opsi (DONE ✅ 7 Okt malam): `design/logo-wikendo-icon-30.html` — SEMUA icon-first app-icon ready + varian logo saja / logo+wordmark bawah
- [x] D16 P3 FINAL LOCK (DONE ✅ 8 Okt): Agesta "Eeh sorry ubah ke p3 aja, kali ini final lock" → 5 SVG master + `logo-d16-full-version.html` (16 inline) + board highlight P4→P3 semua direvisi P4(60)→P3(56: x20/y20/w56/h56/rx15 W29). Nunggu "gas pasang D16" (H-LOCK + favicon ke `app/`, butuh approval karena nyentuh `app/`)
- [ ] NEXT: finalin lockup resmi (master mark + wordmark) + pasang ke header web & favicon + stamp voucher 1-warna
- [ ] NEXT: wire quota real `GET /api/quota` → wallet 2-state + `POST /api/voucher/claim` klaim beneran
- [x] Patch 5 docs downstream Addendum v1.3 (ADR v2.2 ✅ + Schema v1.1 ✅ + API v1.1 ✅ + Journey v2.1 ✅ + Checklist v1.2 ✅) — `app/` NOL diubah ✅ 5/5 GENAP
- [x] Push + Deploy Vercel AUTO via main (kombo `e12be1b` live, prod 200 `QUOTA HARI INI` ✅ 7 Okt malam)

### ⏳ NEXT (antrian dekat)
- [ ] 8.4 E2E (butuh DB seeded dulu)

### 📦 BACKLOG (nanti)
- [ ] Board 20 gradasi background (SKIP ⏸️ 8 Okt — `design/background-gradients-20.html` nunggu "Gua suka Gx" / "gas Gx" → eksekusi via TDD)
- [ ] `components/`/`composables/`/`layouts/` + `GET /api/health` (UI masih inline)
- [ ] Vote/report tenant P1 (`POST /api/vote`, `POST /api/report-tenant`)
- [ ] Sisa Phase 4-7 yang belum dicentang rapi (sinkron lanjutan checklist)
- [ ] Scraper `raw_scrape` → parser per-mall (post-PMF)

### ✅ DONE (ringkas — detail di LOG bawah)
- [x] Addendum v1.3 Revamp+Auth APPROVED by Agesta 7 Okt 2026 — LOCKED (`docs/09-PRD-Addendum-Revamp-Combo-Auth.md` DRAFT → Approved) ✅
- [x] Revamp kombo 5+10+15 (`design/revamp-combo-5-10-15.html`) — 1 alur utuh Home→Quiz→Result→Makan→Voucher→Direktori, visual disatuin, nunggu approval Agesta ✅
- [x] Revamp option board Vol.1 (Opsi 1–5, `design/revamp-options-v1.html`) + Vol.2 (Opsi 6–15, `design/revamp-options-v2.html`) — proposal visual only, 0 ubah `app/`, nunggu approval Agesta ✅
- [x] Migrasi npm → pnpm + fix build Vercel (lockfile tencentyun ENOTFOUND, Node 22, ESLint 10) → commit `481f82c`, push main ✅
- [x] Push repo ke GitHub public `agestasaputra/wikendo-web-app` (SSH key `hermes-wikendo-deploy`, 12 commit, remote origin main ✅)
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

## 2026-10-08 — Integrasi Supabase START (Agesta: skip gradasi → fokus DB)
- **Kenapa:** Agesta VERBATIM "okee jadikan ini sebagai todolist kita. kita skip ke next step aja. Gua mau integrate database dengan supabase". Board 20 gradasi → BACKLOG SKIP ⏸️.
- **Audit integrasi (temuan):**
  - Kode app SUDAH siap: `server/utils/db.ts` (singleton service role), 4 endpoint (`tempat/recommend`, `makan/recommend`, `malls`, `malls/:slug/tenants`) + `nuxt.config.ts` runtimeConfig + `app/.env.example` (tanpa `.env` asli ✅).
  - DB: `migration.sql` (mall F&B) + `seed.sql` (200 tenant) SIAP. GAP: tabel dasar (`generations` dst) cuma ada di `docs/04` sebagai snippet — tidak ada file SQL runnable + FK `voucher_claims→tenants` lintas file.
  - `.env` lokal BELUM ada (cuma `.env.example` ✅ bagus, tidak bocor).
  - Status Supabase Agesta: BELUM ADA project sama sekali → pandu dari register akun.
- **Dikerjain:** `supabase/migration-base.sql` (baru, runnable, idempotent): 6 tabel dasar + RLS + 4 functions + FK voucher→tenants dipisah (§8b, aman run duluan) + verifikasi COUNT otomatis. Urutan run: base → migration.sql → seed.sql.
- **Files:** `supabase/migration-base.sql`, `docs/08-PROGRESS.md` (BOARD + LOG ini).
- **Next:** pandu Agesta register → bikin project → run 3 SQL → kirim 3 keys → wire env lokal + Vercel → verifikasi endpoint.

## 2026-10-08 — Board 20 gradasi background (biar Agesta bisa putusin pakai mata)
- **Kenapa:** Agesta VERBATIM "Gua masih ga suka sama background color yang lu kasih. Gua mau gradasi color untuk background apps nya. Kasih gua 20 rekomendasi gradasi color untuk wikendo" + "Kasih gua html format, biar bisa gua cek".
- **Dikerjain:** `design/background-gradients-20.html` self-contained (±20KB): 8 Universal (G1–G8) + 4 Tempat (G9–G12) + 4 Makan (G13–G16) + 4 Trust/Dark (G17–G20). Tiap kartu = preview UI asli (header + wallet + 2 CTA + teks) di atas gradasinya + hex chips + copy-CSS + shortlist localStorage + filter kategori + sticky bar salin pilihan.
- **Rekomendasi:** 🥇 G4 Sunset Glow (signature arena dadu) · 🥈 G3 Duo Weekend (ceritain split di home) · 🥉 G9+G13 pasangan glow ikut flow.
- **Files:** `design/background-gradients-20.html`, `docs/08-PROGRESS.md` — `app/` NOL diubah.
- **Next:** tunggu "Gua suka Gx, Gy" / "gas Gx" → eksekusi ke `app/` via TDD.

## 2026-10-08 — Board polish UI v1 (biar Agesta bisa putusin pakai mata)
- **Kenapa:** Agesta VERBATIM "Kasih gua file html, agar gua bisa lihat dan bisa ambil keputusan".
- **Dikerjain:** `design/ui-polish-options-v1.html` self-contained (±27KB): diagnosa live 4 poin + palette review token final + tabel emoji→Lucide + preview guideline docs/18 + 3 opsi visual (A Warm Minimal S/~4jam, B Signature Cream ⭐ M/~8jam, C Bold Mesh L/~14jam, tiap opsi 3 mockup HP: Home + Quiz + Result dengan glow yang ikut flow) + head-to-head vs North Star + sticky approve bar (pilihan kesimpen localStorage).
- **Rekomendasi:** B — satu-satunya yang jawab 4 feedback sekaligus, beda ~4 jam dari A tapi hasilnya "Wikendo banget".
- **Files:** `design/ui-polish-options-v1.html`, `docs/08-PROGRESS.md` — `app/` NOL diubah.
- **Next:** tunggu "gas guideline" / "gas polish B" / "gas A" / "gas C".

## 2026-10-08 — Audit feedback UI (background flat / guideline / palette / ikon)
- **Kenapa:** Agesta VERBATIM feedback 4 poin: background flat putih statis, butuh brand/design guideline, review palette/brand color, ikon tidak senada. Minta insight expert selaras brand identity Wikendo.
- **Audit live (6 pages + token):** base #fffdf9 flat tanpa texture di semua page; header putih polos + wordmark teks (belum D16); wallet 1-satunya gradient (#0e7490→#164e63) ✅; CTA tempat solid #f97316 ✅ vs CTA makan outline (inkonsisten); progress makan gradient #ee2c4b→#fb923c (nyampur orange tempat ✖); gray chaos (#ececec/#e4e4e7/gray-100/gray-500); ikon 100% emoji (~30 macam, gaya + ukuran + render OS beda-beda ✖); font Plus Jakarta Sans ✅; radius 14/20/24 campur.
- **Dikerjain:** insight 4 poin di chat (bukan eksekusi `app/`, nunggu approval). Next yang ditawarin: docs/18-Brand-Guideline.md + board polish + swap ikon Lucide + bg signature.
- **Files:** `docs/08-PROGRESS.md` (LOG ini) — `app/` NOL diubah.

## 2026-10-08 — Semua dokumentasi nyebar dimirror ke docs/ (10–17)
- **Kenapa:** Agesta VERBATIM "Btw tolong semua dokumentasi yang udah dibuat, ditaruh juga di folder docs di repo. Agar terdokumentasi dengan baik."
- **Dikerjain:** 7 file nyebar dimirror utuh ke `docs/` (skema: file asli = source of truth, mirror cuma salinan + banner sync): 10-App-Guide ← `app/README.md`, 11-AGENTS-App ← `app/AGENTS.md`, 12-Supabase-Guide ← `supabase/README.md`, 13-Data-Audit-Tenant-V1 ← `supabase/AUDIT.md`, 14-Prototype-Guide ← `design/prototype/README.md`, 15-Wireframes ← `design/wikendo-wireframes.md`, 16-Repo-Overview ← `README.md` (root). Plus 17-Design-Index (indeks aset `design/`: 5 SVG master D16 P3 + 6 board HTML + 3 arsip revamp). Plus update struktur folder di `README.md` root (docs 01–17).
- **Verifikasi:** script compare body mirror == sumber: 7/7 MATCH ✅ (16 sempat MISMATCH karena README root ke-patch duluan, re-sync → MATCH).
- **Files:** `docs/10-*.md` … `docs/17-*.md` (8 baru), `README.md` (root, struktur folder), `docs/08-PROGRESS.md` (LOG ini).
- **Aturan:** edit file ASLI-nya, jangan edit mirror (nanti re-sync). Board HTML tetap di `design/` (interaktif), indeksnya di 17.

## 2026-10-08 — P3 FINAL LOCK 🔒 (✅ DONE, nunggu "gas pasang D16")
- **Kenapa:** Agesta VERBATIM "Eeh sorry ubah ke p3 aja, kali ini final lock" — P4 (60) batal, P3 (56) final.
- **Dikerjain:** 5 SVG master diregenerate P3 (`x20/y20/w56/h56/rx15`, W29, titik r3.5 cx30/cx66) + full-version 16 inline SVG direvisi (leftover P4 = 0 ✅) + badge "✅ FINAL LOCK P3" + board highlight `.cur` P4→P3 + catatan final. Verifikasi script: assets 5/5, P3-dadu 16/16, board `card cur` = 1 (P3).
- **Files:** `design/assets/*.svg` (5), `design/logo-d16-full-version.html`, `design/logo-d16-padding-options.html`, `docs/08-PROGRESS.md` (BOARD + LOG ini).
- **Next:** Agesta balas "gas pasang D16" → H-LOCK + favicon Day P3 ke `app/` via TDD + PNG 1024.

## 2026-10-08 — Fix full-version corrupt: SVG di-inline (self-contained)
- **Kenapa:** Agesta VERBATIM "Gambarnya kok corrupt di file html nya" — akar: 16 `<img src="assets/...">` path relatif putus saat HTML dikirim single-file via Telegram (folder `assets/` tidak ikut). SVG master sehat (489–826 bytes), yang rusak link-nya.
- **Dikerjain:** `design/logo-d16-full-version.html` — 16 `<img>` → inline `<svg>` (style bawaan ikut pindah), CSS `.hero`/`.bar` samakan `img,svg`. Verifikasi: `src="assets` = 0, `<img` = 0, inline `<svg` = 16, size 12KB→19.7KB ✅. File master `design/assets/*.svg` tetap ada (dipakai pas "gas pasang D16").
- **Files:** `design/logo-d16-full-version.html` (fix), `docs/08-PROGRESS.md` (LOG ini).
- **Next:** Agesta buka ulang file di bawah — harusnya semua gambar tampil ✅. Lalu balas "gas pasang D16".

## 2026-10-08 — D16 P4 full version (✅ DONE, nunggu "gas pasang D16")
- **Kenapa:** Agesta VERBATIM "Gua suka p4. Coba bikin full version" — P4 dikunci (dadu 60, W 30, tile ink, rotasi -8°).
- **Dikerjain:** `design/assets/` 5 SVG master (d16-day tile ink app-icon, d16-night takeout transparan, d16-mono 1-warna struk, d16-lockup vertikal icon+wordmark bawah, d16-lockup-horizontal icon+wordmark kanan) + `design/logo-d16-full-version.html` brand sheet resmi 4 seksi: ① master asset + skala 64/32/16 favicon, ② token warna (ink/cream/tempat/makan) + font ExtraBold + titik oranye sakral, ③ mock header light/dark + struk voucher, ④ brand police (jangan stretch/ganti warna/Day-di-gelap/Night-jadi-icon). Wordmark lockup penuhi 2 pilihan Agesta (icon saja + icon+wordmark).
- **Verifikasi:** 6 file exists (5 SVG + 1 HTML) ✅, `app/` NOL diubah ✅ (design-only).
- **Files:** `design/assets/*.svg` (5 baru), `design/logo-d16-full-version.html` (baru), `docs/08-PROGRESS.md` (BOARD + LOG ini).
- **Next:** Agesta balas "gas pasang D16" → H-LOCK + favicon Day ke `app/` via TDD (test→lint→build→commit+push+deploy) + export PNG 1024 via browser render.

## 2026-10-08 — Board 7 opsi padding D16 (P1 48 → P7 72)
- **Kenapa:** feedback "Dadunya terlalu besar haha" (revisi 60/64 kebablasan) → "Coba bikin banyak opsi dari macam2 padding value". Board perbandingan visual biar pilih pakai mata, bukan angka.
- **Dikerjain:** `design/logo-d16-padding-options.html` — 7 kartu (P1 48 lega, P2 52 asli ⭐, P3 56 seimbang, P4 60 sekarang, P5 64 mekar, P6 68 full-bleed, P7 72 ekstrem), tiap kartu Day tile ink + Night takeout berdampingan. Rekomendasi: Day P3 (56) + Night P4/P5 (60/64), Day dan Night boleh beda ukuran.
- **Files:** `design/logo-d16-padding-options.html` (baru), `docs/08-PROGRESS.md` (LOG ini).
- **Next:** Agesta balas misal "Day P3, Night P5" → kunci + export 4 asset + pasang header & favicon.

## 2026-10-08 — D16 dadu dikecilin lagi (feedback "terlalu besar haha")
- **Kenapa:** revisi sebelumnya kebablasan mekar (Day 68 / Night 72). Titik tengah: Day dadu 68→**60** (W 33→30), Night 72→**64** (W 35→31). Napas tile balik ~18-20px.
- **Files:** `design/logo-d16-dual-mode.html`, `docs/08-PROGRESS.md` (LOG ini).
- **Next:** Agesta cek — kalau pas balas "gas pasang D16" → export 4 asset + header & favicon.

## 2026-10-08 — D16 dual Day/Night (✅ DONE, nunggu "gas pasang D16")
- **Kenapa:** Agesta VERBATIM "Gua suka d16 (asli). Tapi jika background nya gelap, sepertinya outer warna hitamnya lebih baik ditakeout ya? Jadi ada 2 versi logo? Gimana menurut lu" — dijawab sebagai expert: YA wajib 2 versi = logo system (Day/Night/Mono), standar semua app besar. Bukan ganti logo, dadu IDENTIK, cuma wadah adaptif.
- **Dikerjain:** `design/logo-d16-dual-mode.html` — VERSI 1 D16-Day tile ink #18181b (asli, app icon utama + light) vs VERSI 2 D16-Night dadu-takeout transparan (web dark via `prefers-color-scheme`, header dark, splash dark). Bukti fisika kontras: Day di OLED 1.1:1 (buta) vs Night takeout 15:1 (tajam). Aturan dikunci: dadu tak tersentuh, app icon selalu opaque Day, favicon = Day, struk = mono.
- **Verifikasi:** file 10KB exists ✅, `app/` NOL diubah ✅ (design-only, pasang header/favicon nunggu approval karena nyentuh `app/`).
- **Files:** `design/logo-d16-dual-mode.html` (baru), `docs/08-PROGRESS.md` (BOARD + LOG ini).
- **Next:** Agesta balas "gas pasang D16" → export d16-day.svg/png1024 + d16-night.svg + d16-mono.svg + d16-lockup.svg + pasang header web & favicon.

## 2026-10-08 dinihari — Finalis Top 4 + fix dark mode (✅ DONE, master dikunci D16)
- **Kenapa:** Agesta shortlist A2 + A3 + D16 + D18 (verbatim) + flag issue "warna logonya hitam punya issue ketika dark mode". Valid: tile #18181b full nyatu sama wallpaper gelap/OLED, edge hilang.
- **Dikerjain:** `design/logo-finalis-top4-darkmode.html` (self-contained) — tiap finalis dites 3 wallpaper (terang/gelap/OLED): A2 aman tanpa fix ✅, A3 tile hitam → fix A3-cream (tile #fffdf9 + ring ink + W ink, premium pindah ke huruf), D16 tile hitam → fix D16-orange (tile #f97316 + dadu cream outline ink, hitam jadi isi bukan wadah), D18 aman (hitam cuma isi kartu, + stroke cream 3px buat 16px). Prinsip dikunci: tile jangan hitam pekat, hitam = isi bukan wadah, tiap master wajib lolos terang+gelap+OLED + 16px + 1-warna. Rekomendasi: #1 A2 master (tanpa fix, store-ready) + #2 D16-orange runner-up (berkarakter, Gen-Z).
- **Verifikasi:** file exists 15KB ✅, `app/` NOL diubah ✅ (design-only).
- **Files:** `design/logo-finalis-top4-darkmode.html` (baru), `docs/08-PROGRESS.md` (BOARD + LOG ini).
- **Next:** Agesta balas "kunci A2" / "kunci D16-orange" / dua-duanya → export SVG/PNG + pasang header web & favicon + stamp voucher 1-warna.

## 2026-10-07 malam — Logo board v2 icon-first 30 opsi (✅ DONE, nunggu shortlist Top 3-5 Agesta)
- **Kenapa:** revisi brief Agesta VERBATIM "Gua lebih prefer logo daripada wordmark. Dapat dipakai sebagai logo app di smartphone. Bahkan lebih bagus jika dibawah logo ada wordmark nya. Jadi punya 2 pilihan: logo saja atau logo + wordmark". Board v1 campur wordmark → generate ulang full icon-first.
- **Dikerjain:** `design/logo-wikendo-icon-30.html` (self-contained, Plus Jakarta Sans, token kombo) — 6 family x 5 opsi SEMUA icon-first: A W Monogram (01-05) + B Pin/Lokasi (06-10) + C Weekend/Time (11-15) + D Keputusan (16-20) + E Mall/Kuliner (21-25) + F Maskot Icon (26-30). Tiap kartu = app icon 88px + lockup wordmark "wikendo." di bawah + simulasi favicon 16px. Fitur: filter family + toggle tampilan "icon + wordmark" vs "icon saja" (sesuai 2 pilihan Agesta) + shortlist ⭐ (localStorage `wikendo-logo-v2-shortlist` + salin) + klik → modal preview 96px + kecil 32px (home screen test) + 1-warna (tes struk fotokopi). Rekomendasi bisnis v2: #1 = 06 Pin W Jagoan (master icon), #2 = 02 W Gradient (cadangan store-ready), #3 = 21 Mangkok W (modul makan/B2B), #4 = 14 Tiket WKND (bahasa voucher), #5 = 28 Pin Senyum (evolusi maskot, nanti).
- **Verifikasi:** file exists 46KB ✅, no linter HTML (skip) ✅, `app/` NOL diubah ✅ (design-only, no deploy UI impact).
- **Files:** `design/logo-wikendo-icon-30.html` (baru), `docs/08-PROGRESS.md` (BOARD + LOG ini).
- **Next:** Agesta shortlist Top 3-5 (⭐ → Salin shortlist → paste ke sini) → finalin lockup resmi 2 varian + export PNG/SVG + pasang header web & favicon + stamp voucher 1-warna.

## 2026-10-07 malam — Logo board 30 opsi (✅ DONE, nunggu shortlist Top 3-5 Agesta)
- **Kenapa:** request Agesta "kita belum punya logo wikendo, generate 30 rekomendasi". Logo harus nempel ke bisnis: decision engine weekend (tempat + makan di mall), hidup di 4 tempat (app icon, favicon 16px, header web, struk voucher 1-warna).
- **Dikerjain:** `design/logo-wikendo-30.html` (self-contained, Plus Jakarta Sans, token kombo) — 6 family x 5 opsi: A wordmark (01-05) + B monogram W (06-10) + C weekend/time (11-15) + D lokasi/keputusan (16-20) + E mall/kuliner (21-25) + F maskot (26-30). Fitur: filter family chip + shortlist ⭐ (localStorage + salin) + klik mark → preview terang/gelap/mono (tes struk 1-warna). Rekomendasi bisnis: #1 = 16 Pin W (master mark), #2 = 01 Titik Nongkrong (wordmark), #3 = 22 Mangkok W (modul makan/B2B), #4 = 14 Tiket WKND (bahasa voucher), #5 = 28 Pin Senyum (evolusi maskot, nanti).
- **Verifikasi:** file exists 35KB ✅, no linter HTML (skip) ✅, `app/` NOL diubah ✅ (design-only, no deploy UI impact).
- **Files:** `design/logo-wikendo-30.html` (baru), `docs/08-PROGRESS.md` (BOARD + LOG ini).
- **Next:** Agesta shortlist Top 3-5 → finalin lockup resmi + pasang header web & favicon + stamp voucher.

## 2026-10-07 sore — UI kombo 5+10+15 SLICING (✅ 6 halaman, test 56/56 + lint + build 8.93s)
- **Kenapa:** approval kombo dikunci Agesta ("gas slicing eksekusi ui nya di repo" + "kan udah gua approve tadi terkait design kombo revamp"). Prod live tapi masih UI lama (0 file .vue diubah di 3 commit terakhir) — design kombo masih statis di `design/revamp-combo-5-10-15.html` yang nggak ikut deploy (Vercel Root = `app/`).
- **Dikerjain (slice-1 → slice-4):**
  - Token: `tailwind.config.ts` +5 warna kombo (`base #fffdf9`, `tempat #f97316`, `makan #ee2c4b`, `wallet #0e7490`, `ink #18181b`) + `nuxt.config.ts` font Plus Jakarta Sans (preconnect + stylesheet) + `lang="id"`.
  - Layout: `app.vue` rewrite (logo `Wikendo.` + nav Tempat/Makan/Mall, base hangat, font Jkt Sans).
  - Slice-1 Home: `index.vue` rewrite (mockup A) — wallet 2-state static "2 tempat • 5 makan" + 2 CTA 56px + grid8 (Wishlist/Riwayat 🔒 momen #3) + banner hype + riwayat jujur kosong + `useHead` SEO/OG.
  - Slice-2 Quiz: `quiz.vue` rewrite (mockup B-C) + `makan.vue` rewrite (mockup E-F) — 1 layar 1 tanya, opt-card selected Orange/Merah, progress gradient, `makan` Q1 chip mall horizontal + Q4 toggle halal/kids, pre-fill `?mall=` via `getMakanStartStep`.
  - Slice-3 Result: `result.vue` rewrite (mockup D) — hero deck 24px + Navigasi/Simpan(wall momen #2)/Share + mini-deck geser + quota note + wall 403 jujur; `result-makan.vue` rewrite (mockup G) — border Merah 2px + badge halal tri-state + tombol Klaim wall (wire `POST /api/voucher/claim` Phase 2) + Maps tenant.
  - Slice-4 Direktori: `mall/[slug].vue` rewrite (mockup H) — search + 4 filter chip (server query) + CTA `/makan?mall=` pre-filled + kartu tenant 62px + `useHead` SEO per-mall.
- **Verifikasi:** `pnpm vitest run` 3 files 56/56 ✅ (no regresi) + `pnpm lint` bersih ✅ + `pnpm build` 8.93s 3.26MB ✅.
- **Files:** `tailwind.config.ts`, `nuxt.config.ts`, `app.vue`, `pages/index.vue`, `pages/quiz.vue`, `pages/makan.vue`, `pages/result.vue`, `pages/result-makan.vue`, `pages/mall/[slug].vue`, `docs/08-PROGRESS.md` (BOARD + LOG ini).
- **Next:** wire quota real `GET /api/quota` → wallet 2-state + `POST /api/voucher/claim` klaim beneran → commit+push+deploy (jalan di bawah).

## 2026-10-07 sore — Auth slice tracer-2 (✅ GREEN 26/26, total test 56/56 + lint + build)
- **Kenapa:** tracer-1 ngunci quota split + wall momen #1. tracer-2 ngunci sisa gerbang auth v1.3: phone optional (skip ≠ error) + format kode voucher + wall momen #2-4 (Simpan/Wishlist/Riwayat/klaim WAJIB login).
- **Dikerjain (TDD RED→GREEN):**
  - RED: `app/tests/auth-gate.test.ts` (26 test) — `normalizePhone` (trim, kosong→null) + `isPhoneValid` (NULL lolos, isi wajib `+62`) + `isVoucherCodeValid`/`generateVoucherCode` (`WIK-XXXXX`) + wall #2 Simpan / #3 Wishlist+Riwayat / #4 klaim voucher. RED valid 26/26 fail (fungsi belum ada).
  - GREEN: `app/utils/quiz-logic.ts` +8 fungsi pure (seam komentar `Auth gate v1.3`, tanpa baca auth/DB langsung).
- **Verifikasi:** `pnpm vitest run` 3 files 56/56 ✅ (12 lama + 18 tracer-1 + 26 tracer-2, no regresi) + `pnpm lint` bersih ✅ + `pnpm build` 9.05s 3.23MB ✅.
- **Files:** `app/tests/auth-gate.test.ts` (baru), `app/utils/quiz-logic.ts`, `docs/08-PROGRESS.md` (BOARD + LOG ini).
- **Next:** `server/api/quota.get.ts` pakai fungsi pure tracer-1 → wallet 2-state → `POST /api/voucher/claim` pakai `generateVoucherCode` + `isPhoneValid`.

## 2026-10-07 sore — Push + Deploy Vercel AUTO (✅ live, prod HTTP 200)
- **Kenapa:** Agesta: "tiap ada perubahan jangan lupa langsung commit+push+deploy Vercel" → kunci ke global memory + SOP §5 (`agesta-app-workflow`).
- **Dikerjain:** `git status` bersih (tracer-1 `a36c6e0` sudah di `origin/main`, 0 pending) → verifikasi auto-deploy: `curl -sI https://wikendo-web-app.vercel.app/` = HTTP 200 `server: Vercel` + `x-powered-by: Nuxt` + title `Wikendo — Bingung Weekend Mau Kemana?` ✅. Jadi TIDAK perlu `vercel --prod` manual — tiap push main = deploy otomatis.
- **Verifikasi:** `git log origin/main..HEAD` kosong (in-sync) ✅ + prod 200 ✅.
- **Files:** `docs/08-PROGRESS.md` (BOARD deploy ✅ + LOG ini).
- **Next:** tracer-2 TDD (phone optional + voucher `WIK-XXXXX` + wall momen #2-4).

## 2026-10-07 sore — Auth slice tracer-1 (✅ GREEN 18/18, test 30/30 + lint + build)
- **Kenapa:** Addendum v1.3 sudah LOCKED + Agesta "Perfect! Lanjut eksekusi". Tracer-1 = fondasi quota split pure biar API `GET /api/quota` v1.1 + wallet 2-state 1 interpretasi.
- **Dikerjain (TDD RED→GREEN):**
  - RED: `app/tests/quota-auth.test.ts` (18 test) — parse cookie anon `quota_used` 0|1 + `makan_quota_used` 0|1|2 clamp, `buildQuotaStatus` split anon 1+2 vs register 2+5 + `login_cta`, wall momen #1 `isTempatLoginWall`/`isMakanLoginWall`. RED valid 18/18 fail (fungsi belum ada).
  - GREEN: `app/types/index.ts` + tipe kontrak `QuotaSlice`/`QuotaStatusInput`/`QuotaStatus` (kontrak `GET /api/quota` v1.1) + `app/utils/quiz-logic.ts` 5 fungsi pure (parse x2 + build + wall x2) + fix lint `import/first` (import tipe ke atas).
- **Verifikasi:** `pnpm vitest run` 2 files 30/30 ✅ (12 lama + 18 baru, no regresi) + `pnpm lint` bersih ✅ + `pnpm build` 9.09s 3.23MB ✅.
- **Files:** `app/tests/quota-auth.test.ts` (baru), `app/utils/quiz-logic.ts`, `app/types/index.ts`, `docs/08-PROGRESS.md` (BOARD + LOG ini).
- **Next:** tracer-2 TDD (phone optional + voucher `WIK-XXXXX` + wall momen #2-4) → `server/api/quota.get.ts` pakai fungsi pure ini.

## 2026-10-07 siang — Patch downstream v1.3 (✅ BERES, 5/5 docs genap)
- **Kenapa:** Agesta "Approve" Addendum v1.3 → kunci downstream biar eksekusi Nuxt 1 interpretasi. PRD Final TIDAK diutak-atik (aturan Addendum).
- **Dikerjain:**
  - `02-ADR.md` v2.1 → v2.2 (7 patch: header, phone optional, progresif auth, OAuth tanpa modal HP, konsekuensi, quota split 1+2/wall 4 momen/voucher wajib login, analytics 3 event, summary, footer, change log).
  - `04-Database-Schema.md` v1.0 → v1.1 (3 patch: header, `user_profiles.phone` NOT NULL → NULL + CHECK optional + index partial + komentar, `initialize_new_user` phone DEFAULT NULL + quota makan, tabel baru `voucher_claims` + RLS).
  - `05-API-Specification.md` v1.0 → v1.1 (6 patch: header, `GET /api/quota` split tempat+makan + login_cta, implementasi cookie ganda, `POST /api/auth/register` phone optional, validasi + init, tipe `QuotaStatus` split, endpoint 16 `POST /api/voucher/claim` + footer).
  - `03-User-Journey.md` v2.0 → v2.1 (6 patch: header, quota rules split, register phone optional + OAuth tanpa modal, generate-again + Step 8 wallet 2-state, Step 13 voucher + Step 14 Home kombo, analytics 3 event, metrics anon→register >15%).
  - `06-MVP-Checklist.md` v1.1 → v1.2 (14 patch: header+status, 2.1 auth progresif + login wall 4 momen + wallet + voucher gate, 2.2 quota split cookie ganda, 2.4 history/fav anon locked + split, 3.5 auth pages Google primary + phone opsional + tanpa modal, 3.7 quota-exhausted split + wallet + voucher gate, 5.1 analytics 3 event, 6.1 testing split + wall + voucher + LLM-fail, 8.0 goal + 8.1 voucher_claims + 8.2 claim API + 8.3 tombol klaim + 8.4 testing wall, totals 81h P0/105h, risk OAuth tanpa friksi HP, toggles phone permanen + voucher, success anon→register >15% + klaim >20%, footer next=TDD).
- **Verifikasi:** docs only, `app/` NOL diubah ✅. Patch per-file verified ✅.
- **Files:** `docs/02-ADR.md`, `docs/04-Database-Schema.md`, `docs/05-API-Specification.md`, `docs/03-User-Journey.md`, `docs/06-MVP-Checklist.md`, `docs/08-PROGRESS.md` (BOARD + LOG ini).
- **Next:** commit `docs: patch downstream v1.3` → kirim PROGRESS.md → eksekusi Nuxt TDD (auth slice + wall + wallet + voucher).

## 2026-10-07 — Addendum v1.3 Revamp+Auth DRAFT (⏳ nunggu approve Agesta)
- **Kenapa:** Agesta lock kombo 5+10+15 + 2 open question (mandatory login? kejar user sebanyak-banyaknya?) belum terkunci di dokumen. Tanpa ini eksekusi Nuxt bakal beda interpretasi.
- **Dikerjain:** `docs/09-PRD-Addendum-Revamp-Combo-Auth.md` DRAFT (~7.5KB): §1 kombo LOCKED (ref visual HTML 31KB, token #fffdf9/#f97316/#ee2c4b, tunda foto/peta/streak/gacha Phase 2) + §2 auth progresif (anon tempat 1x + makan 2x, voucher WAJIB login, phone DROP → NULL-able, email verif optional, Google 1-tap primary, 4 momen login wall, wallet 2-state) + §3 quota/abuse/cost + §4 delta API/Schema non-breaking + §5 metrics (anon→register >15%) + §6 effort ~5-6 jam + §7 next (approve → patch downstream → TDD).
- **Verifikasi:** write verified ✅. `app/` NOL diubah ✅ (lock approval masih berlaku). Patch ADR/Schema/API/Journey/Checklist DITAHAN sampai Agesta approve.
- **Files:** `docs/09-PRD-Addendum-Revamp-Combo-Auth.md` (baru), `docs/08-PROGRESS.md` (BOARD NOW + LOG ini).
- **Next:** Agesta "approve" → patch ADR v2.2 + Schema + API + Journey + Checklist → eksekusi Nuxt TDD. Atau "revisi: ..." kalau mau ubah.

## 2026-10-07 — Kombo board 5+10+15 (✅ BERES, proposal only)
- **Kenapa:** Agesta shortlist 2/5/7/10/15, minta ranking + visual kombo biar kebayang. Lock: 0 ubah `app/` sebelum approval.
- **Dikerjain:** `design/revamp-combo-5-10-15.html` (31KB) — 1 alur utuh 8 mockup HP: Home Superapp (10) → Quiz swipe tempat (5) → Result deck (5, tap "Lainnya" demo geser) → Quiz makan (5+15) → Result+voucher (15) → Direktori /mall/:slug (15, SEO). Token disatuin: base #fffdf9, Orange tempat #f97316, Merah makan #ee2c4b, Plus Jakarta Sans, kartu 24px, tombol 56px. Plus: peta alur ASCII, tabel nilai vs North Star, tombol "Setuju gas kombo" (localStorage), aturan sponsored jujur + penundaan Opsi 2/7/8/12.
- **Verifikasi:** write verified ✅. Browser visual check belum (no browser tool sesi ini) — Agesta review langsung di HP.
- **Files:** `design/revamp-combo-5-10-15.html` (baru), `docs/08-PROGRESS.md` (BOARD+DONE+LOG ini).
- **Next:** Agesta balas "gas kombo" → tulis Addendum revamp → eksekusi Nuxt TDD (test→lint→build).

## 2026-10-07 — Revamp option board Vol.1 + Vol.2 (✅ BERES, proposal only)
- **Kenapa:** Agesta kurang suka UI existing, minta 5 opsi revamp lalu nambah 10 lagi. Aturan lock: JANGAN eksekusi perubahan di codebase sebelum approval.
- **Dikerjain:**
  - `design/revamp-options-v1.html` (44KB): Opsi 1 Warm Evolution, 2 Explore Photo-First, 3 Night Dark, 4 Premium Clean, 5 Swipe Quiz (rekomendasi) — tiap opsi 3 mockup HP Landing→Quiz→Result + tabel head-to-head + tombol pilih (localStorage).
  - `design/revamp-options-v2.html` (51KB): Opsi 6 Chat Concierge, 7 Map-First, 8 Brutalist Playful, 9 Editorial Guide, 10 Superapp Home, 11 WA-Native, 12 Lucky Spin Gacha, 13 Group Vote, 14 Calm Zen, 15 Mall Directory+Voucher — tiap opsi 3 mockup HP + tabel Vol.2 + rekomendasi kombo 5+15+11.
- **Verifikasi:** file exists ✅, ukuran + hitung marker OPSI ✅, `app/` NOL diubah ✅ (proposal di `design/` only). Browser visual check belum (no browser tool di sesi ini) — Agesta review langsung di HP.
- **Files:** `design/revamp-options-v1.html` (baru), `design/revamp-options-v2.html` (baru), `docs/08-PROGRESS.md` (BOARD+DONE+LOG ini).
- **Next:** Agesta pilih (angka / kombo / "gas rekomendasi") → tulis Addendum revamp → eksekusi ke Nuxt via TDD.

## 2026-10-07 dini hari — Migrasi npm → pnpm + fix build Vercel ✅ BERES
- **Kenapa:** Build Vercel fail `ENOTFOUND mirrors.tencentyun.com` — `package-lock.json` kekunci ke mirror Tencent (bawaan server dev), DNS-nya unreachable dari server Vercel `iad1`. Agesta juga request sekalian pindah ke pnpm + beresin warning.
- **Dikerjain:**
  - Install pnpm 9.15.4 (via `npm i -g`, corepack kepentok EACCES symlink /usr/bin) + kunci `packageManager: pnpm@9.15.4`.
  - Buang `package-lock.json` (tercemar 1068 refs tencentyun) + `.npmrc` mirror → `pnpm install` fresh dari registry resmi → `pnpm-lock.yaml` 337KB, scan `tencentyun` = 0 BERSIH.
  - `engines.node`: `>=18.0.0` → `22.x` (hilangkan warning auto-upgrade Vercel + pin runtime prod).
  - ESLint 9.39.5 → 10.12.0 (warning peer `unmet peer eslint@^10` dari `@nuxt/eslint 1.17.0` hilang permanen; `@eslint/js 10.0.1` + `eslint-plugin-unicorn 73` sekarang puas).
  - Nuxt ikut naik 4.5.2 → 4.6.0 (minor, otomatis via `^`).
  - Sync docs: `AGENTS.md` (stack + perintah pnpm), `README.md` (tabel versi + semua perintah + troubleshooting), `eslint.config.mjs` (komentar v10).
- **Verifikasi:** `pnpm test` 12/12 ✅, `pnpm lint` EXIT:0 bersih ✅, `pnpm build` EXIT:0 3.23MB (792kB gzip) ✅. WARN `Unsupported engine` di lokal harmless (lokal Node 26, prod Vercel 22).
- **Files:** `app/package.json`, `app/pnpm-lock.yaml` (baru), `app/package-lock.json` (hapus), `app/.npmrc` (hapus), `app/AGENTS.md`, `app/README.md`, `app/eslint.config.mjs`, `docs/08-PROGRESS.md`.
- **Next:** push → Vercel redeploy (Root Directory tetap `app`, pnpm auto-detect via lockfile) → cek URL preview. Catatan: DB kosong + LLM localhost = UI preview dulu, bukan E2E penuh.

## 2026-10-07 dini hari — Push repo ke GitHub public ✅ BERES
- **Kenapa:** backup cloud + siap deploy Vercel + repo public sesuai putusan Agesta. Remote awal kosong (repo GitHub baru, tanpa README) → push mulus tanpa conflict.
- **Eksekusi:** SSH key baru `hermes-wikendo-deploy` (ed25519, `~/.ssh/id_ed25519_github`), daftar di github.com/settings/keys oleh Agesta → `git remote add origin git@github.com:agestasaputra/wikendo-web-app.git` → `git push -u origin main` (12 commit, new branch main → main).
- **Verifikasi:** `git push` EXIT:0, branch main track origin/main. Secrets scan: `.env` tidak ter-track, `.gitignore` nutupin env/build/node_modules ✅. 1 hit `queue-microtask` di package-lock = false positive (URL mirror npm, bukan secret).
- **Files:** `docs/08-PROGRESS.md` (BOARD NOW=auth slice, DONE+push).
- **Next:** Auth slice (blocker quota login) → seed Supabase → E2E → deploy Vercel.

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
