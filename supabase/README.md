# Folder `supabase/` — Database Mall F&B (Phase 8.1)

Panduan buat **pemula**: file apa aja di sini, urutan jalaninnya, dan gimana cara pakainya.
Ditulis Bahasa Indonesia, step-by-step. Engineer baru baca file ini dulu sebelum sentuh DB.

> **Buat AI assistant:** aturan main ada di `app/AGENTS.md`. File ini cuma panduan manusia.

## Isi folder

| File | APA | Kapan dipakai |
|---|---|---|
| `migration.sql` | Bikin STRUKTUR: 4 tabel (`malls`, `tenants`, `mall_search_quota`, `raw_scrape` staging) + index + RLS | Sekali aja (run ulang aman, idempotent) |
| `seed.sql` | Isi DATA: 5 mall + 200 tenant (40/mall) | Setelah migration; run ulang aman (upsert + delete-insert) |
| `generate_seed.py` | Script yang BIKIN `seed.sql` dari `../data/tenants-seed.csv` | Kalau CSV berubah (tambah mall/tenant) → regenerate |
| `tests/test_generate_seed.py` | Unit test generator (10 test: mission, escape quote, bool, NULL tri-state, meta mall) | Setiap ubah generator/CSV → wajib hijau |
| `AUDIT.md` | Audit valid-vs-survey: field mana dipercaya, mana antri survey + query workflow | Sebelum klaim data terverifikasi; tiap mau survey lapangan |

## Cara pakai (urutan WAJIB)

### 1. Run migration di Supabase

1. Buka Supabase Dashboard project lu → **SQL Editor** → **New query**
2. Copy-paste **seluruh** isi `migration.sql` → **Run**
3. Sukses kalau tidak ada error merah. Tabel `malls`, `tenants`, `mall_search_quota` kebikin.

### 2. Run seed di Supabase

1. Di SQL Editor → **New query** lagi
2. Copy-paste **seluruh** isi `seed.sql` → **Run**
3. Verifikasi — harusnya keluar:

| slug | total_tenant | aktual |
|---|---|---|
| aeon-bsd | 40 | 40 |
| central-park | 40 | 40 |
| grand-indonesia | 40 | 40 |
| kota-kasablanka | 40 | 40 |
| pondok-indah-mall | 40 | 40 |

Kalau ada yang bukan 40 → seed gagal, jangan lanjut. Lapor ke Agesta.

### 3. Kalau CSV berubah (tambah mall/tenant baru)

JANGAN edit `seed.sql` manual — dia auto-generated. Caranya:

```bash
cd supabase
python3 generate_seed.py   # nulis ulang seed.sql dari CSV
python3 -m pytest tests/ -q  # wajib 10 passed
```

Terus run ulang `seed.sql` di SQL Editor kayak langkah 2.

## Kenapa dibikin script, bukan SQL tulis tangan?

CSV punya 3 jebakan yang bikin seed gagal total kalau 1 aja lolos:

1. **Apostrof di nama** — `McDonald's`, `D'Crepes`, `Roti'O`. Di SQL, `'` harus ditulis `''`.
   1 lolos = 1 statement error.
2. **Mission pipe-separated** — `makan_cepat|keluarga` harus jadi `ARRAY['makan_cepat','keluarga']`
   (kolom `TEXT[]`, bukan string biasa).
3. **Bool text** — `true`/`false` di CSV harus jadi `TRUE`/`FALSE` SQL.

Script + 10 unit test yang jagain keempatnya. Test merah = jangan run seed.

## Aturan NULL + staging scrape (patch 6 Okt 2026)

1. **Belum riset = `NULL`, bukan `FALSE`/string kosong.** `halal`/`kids_friendly`/`hype_tiktok`
   kosong → `NULL` + `needs_survey=TRUE` (masuk antrian survey). Filter halal-only/kids
   pakai `.eq(true)` → `NULL` otomatis ke-exclude. UI tampil ❓ Belum terverifikasi.
2. **Scrape TIDAK langsung ke `tenants`.** Masuk `raw_scrape` dulu → gate kota
   (non-Jabodetabek = `rejected`) → parser per-mall → `tenants` bersih.
3. **Audit data:** `AUDIT.md` — field mana valid, mana antri survey (P1/P2/P3).

## FAQ

**Q: Run migration/seed 2x bikin duplikat?**
A: Enggak. Migration pakai `IF NOT EXISTS`. Seed: malls pakai `ON CONFLICT DO UPDATE`,
tenants di-`DELETE` per-mall dulu baru `INSERT` fresh.

**Q: `generations` table mana? Kok API recommend insert ke situ?**
A: Itu tabel skema dasar (quiz tempat, docs/04 bagian 4) — bukan bagian Phase 8.1.
Kalau project Supabase masih kosong, run skema dasar itu dulu, baru `migration.sql` ini.

**Q: Tabel `mall_search_quota` kok kosong setelah seed?**
A: Wajar. Tabel itu keisi otomatis saat user login pakai quiz makan (5/hari).
User anon pakai cookie browser (`makan_quota_used`, max 2) — tidak nyentuh tabel ini.

**Q: Mau nambah mall ke-6?**
A: Tambah 40 row di CSV (`mall_slug` baru) + tambah 1 entry di `MALL_META`
(`generate_seed.py`) + regenerate + run seed. API + pages otomatis ikut
(`GET /api/malls` list dinamis, quiz ambil dari situ).
