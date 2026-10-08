# PRD Addendum — Entrypoint Mall di Home (M1+M3)

**Version:** 1.0 (9 Okt 2026)
**Status:** Approved by Agesta (9 Okt 2026) — LOCKED (`Gua suka M1+M3`)
**Merujuk ke:** `docs/01-PRD.md v2.0 Final` + `docs/09-PRD-Addendum-Revamp-Combo-Auth.md v1.3 LOCKED` + board `design/revamp-options-v8.html`
**Owner:** Agesta
**APA ini?** PRD Final jangan diutak-atik. File ini = RFC mini: kunci pintu masuk /mall dari Home biar eksekusi nggak ngarang.
**KENAPA perlu?** /mall yatim — 5 mall • 200 tenant, tanpa login/quota (friksi terendah), tapi nol entry dari Home. 4 ikon cepat mati (span tanpa link), 2 CTA cuma Tempat + Makan.

---

## 1. Keputusan — Paket M1+M3 LOCKED

- **M1 (P0, ±1 jam):** ikon Event mati (🎡, span) → ikon **Mall 🏬** ber-link `/mall`. Above-fold, nol geser layout, quiz CTR aman.
- **M3 (P1, ±3 jam, 1 commit bareng M1):** kartu **Mall Terdekat** di bawah Rekomendasi: `🏬 Mall Terdekat / 5 mall • 200 tenant → tanpa login`, link `/mall`. Pola pull, informatif (count nyata dari copy statis yang sudah tampil di /mall: "5 mall").
- **M2 DITOLAK:** CTA ketiga sejajar quiz kanibalisasi target landing→quiz >40% (PRD §4).

## 2. Aturan eksekusi

- Dual Entry Split tetap: entry Mall cuma pintu ke `/mall`, tidak prefill quiz mana pun.
- M3 count "5 mall • 200 tenant" = copy statis konsisten dengan /mall ("5 mall" + 5×40 tenant seed); bila seed berubah, update copy bareng.
- Token ikut lock lama: paper #F5F5F4, ink #0C0A09, lime #A3E635, ember #EA580C, rose #E11D48.

## 3. Verifikasi DONE

- TDD `app/tests/mall-entry.test.ts`: M1 (link+🏬, tanpa Event/🎡), M3 (judul+count+tanpa login), ≥2 pintu /mall.
- Full suite + lint + build hijau, prod `/` 200 + marker (🏬, Mall Terdekat, 2× /mall link).
