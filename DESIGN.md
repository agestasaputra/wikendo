---
version: alpha
name: Wikendo
description: Weekend plan + mall F&B finder — playful utility, decisif 1-tap, split Tempat (ember) vs Makan (rose).
colors:
  primary: "#0C0A09"
  paper: "#F5F5F4"
  card: "#FFFFFF"
  ember: "#EA580C"
  ember-cta: "#C2410C"
  ember-bright: "#FB923C"
  ember-wash: "#FFF7ED"
  rose: "#E11D48"
  rose-bright: "#FDA4AF"
  rose-wash: "#FFE4E6"
  gift-border: "#FECDD3"
  lime: "#A3E635"
  on-ink: "#FFFFFF"
  on-ember: "#FFFFFF"
  on-rose: "#FFFFFF"
  on-lime: "#0C0A09"
typography:
  label-caps:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.625rem
    fontWeight: 800
    letterSpacing: "0.025em"
  question:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.1875rem
    fontWeight: 800
    lineHeight: 1.375
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.8125rem
    lineHeight: 1.5
  option:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.875rem
    fontWeight: 700
rounded:
  header: 14px
  option: 20px
  card: 24px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
components:
  page-canvas:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.primary}"
    rounded: "{rounded.card}"
    padding: 16px
  quiz-ink-header:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-ink}"
    rounded: "{rounded.header}"
    padding: 12px
  quiz-option:
    backgroundColor: "{colors.card}"
    textColor: "{colors.primary}"
    typography: "{typography.option}"
    rounded: "{rounded.option}"
    padding: 14px
  quiz-option-selected-tempat:
    backgroundColor: "{colors.ember-wash}"
    textColor: "{colors.primary}"
    rounded: "{rounded.option}"
    padding: 14px
  quiz-option-selected-makan:
    backgroundColor: "{colors.rose-wash}"
    textColor: "{colors.primary}"
    rounded: "{rounded.option}"
    padding: 14px
  quiz-dot-tempat:
    backgroundColor: "{colors.ember-bright}"
    rounded: "{rounded.full}"
    size: 8px
  quiz-dot-makan:
    backgroundColor: "{colors.rose-bright}"
    rounded: "{rounded.full}"
    size: 8px
  quiz-seg-on:
    backgroundColor: "{colors.lime}"
    textColor: "{colors.on-lime}"
    rounded: "{rounded.full}"
    height: 8px
  strip-tempat:
    backgroundColor: "{colors.ember}"
    rounded: "{rounded.full}"
    width: 5px
    height: 48px
  voucher-gift:
    backgroundColor: "{colors.rose-wash}"
    textColor: "{colors.primary}"
    rounded: "{rounded.header}"
    padding: 12px
  voucher-gift-edge:
    backgroundColor: "{colors.gift-border}"
    textColor: "{colors.primary}"
    rounded: "{rounded.header}"
    padding: 12px
  cta-tempat:
    backgroundColor: "{colors.ember-cta}"
    textColor: "{colors.on-ember}"
    rounded: "{rounded.header}"
    height: 56px
  cta-makan:
    backgroundColor: "{colors.rose}"
    textColor: "{colors.on-rose}"
    rounded: "{rounded.header}"
    height: 56px
---

## Overview

Wikendo = perencana weekend + pencari makanan mall. Personality: playful utility — emoji, bahasa santai, tapi tiap layar cuma minta 1 keputusan kecil (completion >70%).

Split paling sakral: **Tempat = ember, Makan = rose**. Dua flow tidak pernah campur warna aksi. Label kecil dan question selalu putih di atas ink. Lime cuma buat kemajuan/nilai (<10% dosis).

## Colors

- **Primary ({colors.primary}):** Ink — teks, header quiz, tombol Maps. Background header quiz Q2d/M3d.
- **Paper ({colors.paper}):** Background container semua pages (`page-canvas`, kombo hangat, bukan putih polos).
- **Card ({colors.card}):** Permukaan opsi quiz dan kartu list.
- **Ember ({colors.ember}):** Brand/strip/selected flow Tempat — strip hero 5px (`strip-tempat`), selected quiz. BUKAN background teks-putih (putih di atasnya 3.56:1, gagal AA) — CTA teks-putih wajib pakai `ember-cta`.
- **Ember CTA ({colors.ember-cta}):** Ember-deep khusus permukaan teks-putih (`cta-tempat`, putih 5.2:1 lolos AA). Satu keluarga ember, hanya untuk CTA Tempat.
- **Ember bright ({colors.ember-bright}):** Cuma dot label Q2d (`quiz-dot-tempat`). Wash ({colors.ember-wash}) cuma bg selected tempat.
- **Rose ({colors.rose}):** SATU-SATUNYA aksi flow Makan — CTA (`cta-makan`, putih 4.73:1 lolos AA), cermin ember. Bright ({colors.rose-bright}) cuma dot label M3d (`quiz-dot-makan`). Wash ({colors.rose-wash}) bg selected makan + base voucher gift.
- **Gift border ({colors.gift-border}):** Border/aksen kartu voucher gift V12 (`voucher-gift-edge`).
- **Lime ({colors.lime}):** Kemajuan (segmen blok quiz `quiz-seg-on`) dan nilai (pill BEST, badge). BUKAN aksi, BUKAN label. Dosis <10% per layar. Teks di atas lime selalu ink ({colors.on-lime}).
- **On-colors:** Putih di atas ink/ember-cta/rose; ink di atas lime.

## Typography

Plus Jakarta Sans untuk semua. Hierarki dari size + weight, bukan ganti font.

- `label-caps` (10px, 800, tracking lebar): label `QUIZ TEMPAT` / `QUIZ MAKAN` — selalu putih + dot terang, bukan aksi.
- `question` (19px, 800, snug): teks pertanyaan quiz — putih di atas ink header.
- `body-md` (13px): hint, microcopy, alasan tenant.
- `option` (14px, 700): label opsi quiz.

## Layout

Satu kolom mobile: container `max-w-md mx-auto px-4 pb-10` (`page-canvas`). **Background selalu di container ini, bukan body/root.** Spacing baseline 4px: `sm` gap antar segmen/chip, `md` gap antar kartu, `lg` antar section.

## Shapes

Header quiz 14px, opsi quiz 20px, kartu hero/list 24px, tombol CTA min-height 56px, pill/chip full. Strip aksen kiri = border 5px (ember tempat, rose makan). Segmen progress = blok-blok (bukan bar gradasi), gap 5px, on = lime, off = putih 22%.

## Components

- `page-canvas`: container `max-w-md` semua pages, bg paper + teks ink.
- `quiz-ink-header` (Q2d/M3d): kartu ink berisi label-caps putih + dot (`quiz-dot-tempat`/`quiz-dot-makan`) + question putih + segmen blok lime (`quiz-seg-on`). Satu-satunya header quiz yang sah.
- `quiz-option` + `quiz-option-selected-tempat/makan`: opsi putih border netral; selected = border 2px ember/rose + bg wash. Chip mall (GI/CP/Kokas/PIM/Aeon) ikut pola selected makan.
- `quiz-dot-tempat` / `quiz-dot-makan`: dot 8px di label header — satu-satunya pemakaian bright.
- `quiz-seg-on`: segmen blok menyala (lime, teks di atasnya ink). Satu-satunya pemakaian lime di quiz.
- `strip-tempat`: strip aksen 5px hero flow Tempat (ember murni, non-teks).
- `voucher-gift` (V12): gradasi cream→rose (token: rose-wash + border gift-border), ikon 🎁 + `Ada −20% buat lu` + pill rose `Buka →`. 1 focal per kartu.
- `voucher-gift-edge`: aksen/border gift (`gift-border`) kartu voucher.
- `cta-tempat` / `cta-makan`: satu aksi dominan per layar, tinggi 56px, teks putih bold ≥14px. Tempat wajib `ember-cta` (bukan ember murni — alasan kontras AA).
- Hasil (tempat & makan) = item list isi 5, pola 3 lapis: hero + minis + full list. Tidak pernah campur tempat wisata + tenant.

## Logo

Master terkunci: **D16 P3** — dadu 56px, W 29, rotasi dadu -8°, tile ink, dadu cream, titik tempat + makan. File master di `app/public/`: `d16-day.svg` (tile ink, utama), `d16-night.svg` (dadu takeout transparan), `d16-mono.svg` (1-warna), `d16-lockup.svg` (icon + wordmark bawah), `d16-lockup-horizontal.svg` (icon kiri + wordmark kanan). Favicon = Day.

- **Dipakai di:** header web H-LOCK, app icon + splash light Day, web dark-mode (`prefers-color-scheme`) Night, struk voucher WIK-XXXXX Mono, splash/kaos V-LOCK.
- **Jangan:** stretch/gepeng, ganti warna, Day di atas gelap (gelap = Night takeout), Night jadi app icon (launcher wajib opaque — iOS nolak transparan). Dadu (W + 2 titik + rotasi) tidak boleh diubah di versi apa pun.

## Do's and Don'ts

- **Do** pakai token reference (`{colors.ember-cta}`) — jangan hardcode hex di komponen baru.
- **Do** jaga split: ember = tempat, rose = makan. Selected, CTA, strip ikut flow-nya.
- **Do** pakai `ember-cta` untuk SEMUA teks-putih di atas oranye; ember murni hanya permukaan non-teks (strip, selected border).
- **Do** pakai helper tested (`getQuizHeaderMeta`, `getQuizSegState`, `getVoucherCardMeta`, `getLogoAsset`) — bukan hex/path lepas di pages.
- **Don't** pakai lime buat label, CTA, atau background besar. Lime = kemajuan/nilai saja.
- **Don't** label full merah/oranye 10px — gagal AAA, label bukan aksi.
- **Don't** campur hasil tempat + makanan dalam satu list.
- **Don't** taruh background di body/root — selalu di container `max-w-md`.
- **Don't** warna di luar palet — tambah token dulu, baru pakai.
- **Don't** utak-atik dadu logo (W + 2 titik + rotasi -8°) di semua versi.
- **Don't** nest varian komponen (`cta-tempat.hover` salah; `cta-tempat-hover` sibling yang benar).
