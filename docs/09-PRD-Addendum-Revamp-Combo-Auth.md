# PRD Addendum — Revamp Kombo 5+10+15 + Auth Progresif

**Version:** 1.3 (7 Okt 2026)
**Date:** 7 Okt 2026
**Status:** Approved by Agesta (7 Okt 2026) — LOCKED
**Merujuk ke:** `docs/01-PRD.md v2.0 Final` + `docs/07-PRD-Addendum-Mall-F&B.md v1.2 LOCKED` + `docs/02-ADR.md v2.1` + visual `design/revamp-combo-5-10-15.html`
**Owner:** Agesta
**APA ini?** PRD v2.0 Final jangan diutak-atik. File ini = RFC mini: kunci visual kombo + aturan login/quota biar pas eksekusi nggak ngarang.
**KENAPA perlu?** Dua open question (mandatory login? + kejar user sebanyak-banyaknya?) belum terkunci di dokumen. Tanpa ini, eksekusi Nuxt bakal beda interpretasi soal quota anon, voucher gate, dan phone.

---

## 1. Keputusan UI — Kombo 5+10+15 LOCKED (visual only)

**APA?** Satu alur utuh, bukan 3 app terpisah. Referensi visual: `design/revamp-combo-5-10-15.html` (31KB, 8 mockup HP). File HTML itu TIDAK diubah di v1.3 ini — sudah cukup sebagai spec visual.

- **A. Home Superapp (Opsi 10)** — `/`: 2 CTA gede (🗺️ Cari Tempat / 🍜 Cari Makan) + wallet quota (`2 tempat • 5 makan` untuk register, `1 tempat • 2 makan free` untuk anon) + grid Event/Promo/Wishlist/Riwayat.
- **B-C. Quiz swipe tempat (Opsi 5)** — `/quiz`: 6Q (mood/companion/anak conditional/budget/lokasi/waktu optional), 1 layar 1 pertanyaan, tombol 56px thumb-zone.
- **D. Result deck (Opsi 5)** — `/result`: hero #1 + Navigasi/save/share + mini deck ②③ tap "Lainnya". Best Match murni skor. Slot #1 boleh sponsored TAPI badge wajib "Sponsored".
- **E-F. Quiz makan (5+15)** — `/makan`: 4Q (mall wajib GI/CP/Kokas/PIM/Aeon + misi + budget + rombongan/Halal/Kids), ~20 detik, pre-filled `?mall=` dari direktori.
- **G. Result makan + voucher (15)** — `/result-makan`: 5 tenant murni + badge -20%/Halal + tombol Klaim voucher (WAJIB login, lihat §2).
- **H. Direktori (15)** — `/mall/:slug`: list 40 tenant + filter no-LLM SSR SEO, funnel organik → `/makan?mall=`.

**Token disatuin (KENAPA? biar konsisten, nggak gado-gado):** base #fffdf9, Orange tempat #f97316, Merah makan #ee2c4b, Plus Jakarta Sans, kartu 24px, tombol 56px.

**Yang DITUNDA Phase 2 (biar MVP 2-3 minggu kekejar):** foto Opsi 2, peta Opsi 7 jadi toggle, streak Opsi 8, gacha 12. Bukan dibuang, cuma antre.

---

## 2. Auth — Progresif, BUKAN Mandatory Login

**Keputusan decisive (jawab 2 open question lu):**
1. **Mandatory login? NGGAK.** Anon bisa pakai quiz tempat + quiz makan. Value first, login belakangan.
2. **Kejar user sebanyak-banyaknya? IYA.** Skema di bawah didesain buat ubah non-register → register sebanyak-banyaknya tanpa bunuh conversion.

### 2.1 Jatah anon vs register (split, tidak campur)

| Jalur | Anon | Register |
|---|---|---|
| 🗺️ Tempat (`/quiz→/result`) | **1x generate/hari**, result full 5 kartu, Maps boleh diklik | **2/2 penuh** |
| 🍜 Makan (`/makan→/result-makan`) | **2x generate/hari**, result full 5 tenant, Maps boleh | **5/5 penuh** |
| 💾 Simpan / ❤️ Wishlist / 🕘 Riwayat | 🔒 locked → login prompt | ✅ jalan |
| 🎟️ Klaim voucher makan | 🔒 **WAJIB login** (anti-farming voucher) | ✅ jalan |
| 📣 Lapor tutup/buka + Vote/share | ✅ tanpa login (freshness data) | ✅ jalan |
| 🔗 Share link result | read-only, penerima anon dapat jatah free (viral loop) | sama |

**KENAPA makan 2x bukan 1x?** Frekuensi makan 2-3x sehari (lunch/dinner). Kasih 2 biar kerasa value-nya, tapi voucher dikunci → umpan register + anti-borong voucher pakai anon baru.

### 2.2 4 momen login wall (semuanya pas high-intent, KENAPA? biar convert, bukan ngusir)

1. Generate ke-2 tempat / ke-3 makan → *"Sisa anon habis. Login gratis → buka 2 tempat/hari + simpan + riwayat."*
2. Tap Simpan / Klaim voucher → bottom sheet login.
3. Buka Wishlist/Riwayat → login prompt.
4. Quota habis → countdown reset 00.00 WIB + tombol login (bukan dead-end).

**Copy jual benefit, bukan blokir:** *"Login 10 detik (Google 1-tap) → quota reset tiap hari, gratis."*

### 2.3 Metode + open question PRD

- **Primary: Google OAuth 1-tap** (friksi nol). Secondary: Email+password.
- **Email verification? OPTIONAL dulu** (jawab open question PRD §4.5). Jangan jegal register. Google OAuth otomatis verified.
- **Phone mandatory? DROP** (jawab asumsi PRD §7 "Phone doesn't hurt conversion" → ternyata hurt, jadi drop). KENAPA? Phone bunuh conversion + SMS cost. Simpan buat optional Phase 2 (broadcast promo). Implikasi: `user_profiles.phone` jadi NULL-able, validasi +62 cuma kalau diisi. Google OAuth TANPA modal "Masukkan nomor HP" lagi.
- **Wallet Home 2 state:** anon (*"1 tempat • 2 makan free, login buat full"*) vs register (*"2 • 5"*). Result: tombol Simpan/Klaim ada gembok kecil.

---

## 3. Quota, Anti-Abuse, Cost

- Tempat 2/hari + makan 5/hari, reset 00:00 WIB. Anon: UUID localStorage + cookie (`quota_used` tempat, `makan_quota_used` makan) + rate-limit IP di server.
- **LLM fail → quota NGGAK kepotong** (edge case PRD §6 tetap berlaku).
- Abuse (clear storage = reset) DITERIMA dulu pas soft launch 30-50 users — growth > strict. Kalau spike baru kerasin (fingerprint/IP tracking, sesuai risk table PRD).
- Cost aman: makan = filter Supabase gratis, LLM cuma ranking ~400 token. Anon 1+2/hari nggak jebolin budget 500rb/bln. Target NFR <2s 3G + load result <1s tetap.

---

## 4. Delta API & Schema (dieksekusi SETELAH approve, bukan sekarang)

Non-breaking, patch downstream setelah v1.3 APPROVED:
- `user_quota`: split `quota_type='tempat'|'makan'` atau tabel `mall_search_quota(user_id,date,used)` (sudah ada di 8.1, tinggal pakai).
- `user_profiles.phone`: NOT NULL → NULL-able (drop mandatory).
- `GET /api/quota`: response anon = `{tempat:{used,limit:1}, makan:{used,limit:2}}`, register = `{tempat:{limit:2}, makan:{limit:5}}`.
- `POST /api/tempat/recommend` → anon ke-2 = `403 LOGIN_REQUIRED`. `POST /api/makan/recommend` → anon ke-3 = `403 LOGIN_REQUIRED`. Voucher claim endpoint baru = `401` kalau anon.
- `POST /api/vote` + `POST /api/report-tenant`: tetap tanpa login + rate-limit IP.
- Analytics: `login_prompted{reason}`, `user_registered{method}`, `voucher_claimed`, `anon_quota_exhausted{type}`.

---

## 5. Metrics tambahan (selain North Star PRD)

- Anon → register conversion >15% (goal utama v1.3 ini).
- Login wall conversion per momen (mana paling convert? → iterasi copy).
- Voucher claim rate (makan → klaim).
- Tetap: landing→quiz >40%, completion >70%, CTR Maps >50%, time >60s, share >5%, tenant halu = 0.

---

## 6. Effort (kasar, dikunci pas Checklist)

- Patch docs downstream (ADR v2.2 + Schema + API + Journey + Checklist + PROGRESS): ~1 jam.
- Auth slice (login/register/callback/middleware — blocker lama): ~4 jam (sudah ada di Checklist 3.5).
- Wallet 2-state + login wall 4 momen + gembok Simpan/Klaim + countdown: ~3 jam.
- Voucher gate + phone NULL-able migration: ~1.5 jam.
- **Total tambahan v1.3: ~5-6 jam** di luar backlog auth yang memang belum dikerjain.

---

## 7. Next Step

1. Agesta ketik **"approve"** → gue patch ADR v2.2 + Schema + API + Journey + Checklist + PROGRESS (KENAPA+APA+KAPAN).
2. Atau ketik **"revisi: ..."** kalau mau ubah (misal anon makan 1x bukan 2x, atau phone tetap wajib).
3. Setelah itu baru eksekusi Nuxt via TDD (test→lint→build), tetap **0 ubah `app/` sebelum approve** — lock lama masih berlaku.

**Ditulis oleh:** Hermes (CTO+CEO mode)
**Di-review oleh:** Agesta — ketik "approve" untuk gas, atau "revisi: ..." kalau mau ubah.
