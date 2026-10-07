# 17 — Design Index (Indeks Aset Desain Wikendo)

> Daftar semua artefak visual di `../design/` per 8 Okt 2026. File HTML = board interaktif (buka di browser), bukan dokumen markdown — jadi tetap tinggal di `design/`, di sini cuma indeksnya.

## Logo (final: D16 P3 🔒)

| File | Isi |
|---|---|
| `../design/assets/d16-day.svg` | Master Day: tile ink + dadu cream 56px (app icon, header light, favicon) |
| `../design/assets/d16-night.svg` | Takeout transparan (web dark-mode, header dark) |
| `../design/assets/d16-mono.svg` | 1-warna (struk voucher WIK-XXXXX, fotokopi, stempel) |
| `../design/assets/d16-lockup.svg` | Vertikal: icon + wordmark di bawah (splash, kaos) |
| `../design/assets/d16-lockup-horizontal.svg` | Horizontal: icon + wordmark kanan (header web/navbar) |
| `../design/logo-d16-full-version.html` | Brand sheet resmi P3 (self-contained, SVG inline) |
| `../design/logo-d16-padding-options.html` | Board 7 opsi padding P1(48)→P7(72), highlight P3 FINAL |
| `../design/logo-d16-dual-mode.html` | Kajian Day vs Night + tes kontras OLED |
| `../design/logo-finalis-top4-darkmode.html` | Finalis A2/A3/D16/D18 + fix dark-mode |
| `../design/logo-wikendo-icon-30.html` | Board v2: 30 logo icon-first |
| `../design/logo-wikendo-30.html` | Board v1: 30 logo (obsolete parsial, campur wordmark) |

## UI Revamp (kombo 5+10+15, Addendum v1.3)

| File | Isi |
|---|---|
| `../design/revamp-combo-5-10-15.html` | Spec visual kombo (sudah di-slicing ke `app/`, commit `e12be1b`) |
| `../design/revamp-options-v1.html` | Opsi 1–5 (proposal, visual only) |
| `../design/revamp-options-v2.html` | Opsi 6–15 (proposal, visual only) |

## Arsip (pre-Wikendo)

| File | Isi |
|---|---|
| `15-Wireframes.md` | (mirror) Wireframe teks era Weekend Planner |
| `14-Prototype-Guide.md` | (mirror) Panduan testing prototype HTML |
| `../design/prototype/` | Prototype HTML interaktif (index/quiz/result) |

## Aturan

- Logo FINAL = D16 P3 (dadu 56, W 29, rotasi -8°). Jangan redraw manual — turunkan dari `assets/`.
- Board HTML boleh nambah, master SVG cuma berubah via keputusan lock baru (catat di `08-PROGRESS.md`).
