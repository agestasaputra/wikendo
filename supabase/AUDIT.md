# AUDIT Data Tenant V1 — Valid vs Butuh Survey Lapangan

**Tanggal:** 6 Okt 2026 | **Sumber:** `data/tenants-seed.csv` (200 rows, 5 mall x 40, AI-curated dummy)
**Tujuan:** misahin field yang cukup valid buat MVP vs yang WAJIB verifikasi manual sebelum dipercaya user.
**Aturan main baru (approved):** belum riset = `NULL` + `needs_survey=TRUE`, bukan `FALSE`/string kosong.

> Catatan jujur: CSV V1 terisi 100% (tidak ada sel kosong) — padahal datanya AI-generated,
> bukan hasil survey. Artinya `needs_survey` hasil regenerate = `FALSE` semua, dan
> `verified_at` = `NULL` semua (belum ada verifikasi lapangan SAMA SEKALI).
> Audit ini yang nentuin antrian survey prioritas, bukan mesin.

## 1. Ringkasan per field

| Field | Distribusi | Confidence | Verdict |
|---|---|---|---|
| `tenant_name` | 200 unik | ~80% — nama brand besar mostly benar, typo/gerai tutup mungkin ada | VALID BERSYARAT — cocokkan saat survey |
| `category` | japanese 47, kopi 24, indonesia 22, fastfood 20, dessert 19, chinese 18, western 17, minuman 16, bakery 12, healthy 5 | ~75% — japanese 47 terlalu dominan (bias AI), healthy 5 kurang | VALID BERSYARAT |
| `lantai` | 10 nilai unik: `G, LG, UG, GF, 1, 3, 3A, 5, Foodprint, Tribeca` | ~50% — `Foodprint` aneh, angka polos (`1`,`3`,`5`) ambigu antar-mall | BUTUH SURVEY (lihat §2) |
| `halal` | true 194 / false 6 | RENDAH untuk yang `true` — 97% halal mustahil akurat tanpa riset | BUTUH SURVEY PRIORITAS 1 |
| `budget_tier` + `price_range` | hemat 113 / menengah 63 / leluasa 24, price 0 kosong | ~70% — pola masuk akal, nominal bisa geser | VALID BERSYARAT |
| `kids_friendly` | true 133 / false 67 | ~60% — 133 ramah-anak kedengeran kebanyakan | BUTUH SURVEY PRIORITAS 3 |
| `mission` | keluarga 90 (!) / makan_cepat 59 / nongkrong 38 / healing 7 / kombinasi 6 | IMBALANCE — keluarga 90 vs healing 7, multi-mission cuma 6 rows (under-tag) | VALID SEMENTARA — retag healing/nongkrong saat survey |
| `hype_tiktok` | true 41 / false 159 | TEMPORAL — hype basi dalam 90 hari | BUTUH RE-CEK BERKALA (bukan survey lapangan) |
| `is_open` | true 200 / false 0 | MUSTAHIL — 200/200 buka terus tidak realistis | BUTUH MEKANISME LAPOR (tombol Lapor tutup/buka di UI) |

## 2. Lantai aneh per mall (wajib cek lapangan)

| Mall | Lantai unik | Catatan |
|---|---|---|
| Grand Indonesia | `1, 3A, 5, Foodprint, G, LG` | `Foodprint` = zona foodcourt GI? nama tidak standar — samakan format |
| Central Park | `1, LG, Tribeca` | `Tribeca` = zona CP, valid sebagai nama area tapi inkonsisten format |
| Kota Kasablanka | `GF, LG, UG` | Bersih ✅ |
| Pondok Indah Mall | `1, 3, GF, LG` | Angka `1`,`3` ambigu (PIM 1/2/3 gedung terpisah) — tulis `PIM1-L1` dst |
| Aeon BSD | `1, GF` | Bersih ✅ |

**Keputusan:** format lantai TIDAK diubah sekarang (biar seed jalan). Standarisasi pas survey mall pertama.

## 3. Antrian survey (prioritas)

**P1 — Fatal kalau salah:**
1. 6 tenant `halal=false` — verifikasi beneran non-halal. Salah klaim = hancurkan trust.
2. Spot-check 20 tenant `halal=true` paling populer (McD, HokBen, dsb — brand known-halal gampang).

**P2 — Bikin data akurat:**
3. `is_open` — andalkan tombol Lapor + cek saat survey P1.
4. Lantai aneh GI/CP/PIM (§2).
5. `mission` healing/nongkrong — tambah tag yang kurang (target: healing ≥20 rows).

**P3 — Nice to have:**
6. `kids_friendly` 133 true — turunkan yang overclaim.
7. `hype_tiktok` 41 true — ganti sumber ke cek TikTok/GMaps review berkala, bukan survey.

## 4. Cara pakai kolom metadata (workflow survey)

```sql
-- Antrian survey: yang belum pernah diverifikasi lapangan
SELECT mall_id, name, halal, kids_friendly, hype_tiktok
FROM tenants WHERE verified_at IS NULL ORDER BY mall_id, name;

-- Selesai survey 1 tenant → tutup antriannya
UPDATE tenants SET halal=true, kids_friendly=true, hype_tiktok=false,
  data_source='manual', verified_at=NOW(), needs_survey=false
WHERE id='<uuid>';

-- Gate scrape: tolak mentah non-Jabodetabek SEBELUM normalisasi
UPDATE raw_scrape SET status='rejected' WHERE status='pending'
  AND city NOT IN ('Jakarta','Jakarta Selatan','Jakarta Utara','Jakarta Timur',
    'Jakarta Barat','Jakarta Pusat','Bogor','Depok','Tangerang',
    'Tangerang Selatan','Bekasi');
```

## 5. Keputusan

1. V1 seed TETAP dipakai buat dev/demo (data cukup bagus buat alur, bukan buat kebenaran).
2. Jangan pernah klaim "data terverifikasi" ke user sebelum P1 kelar — badge ❓ yang bicara.
3. Scrape masa depan WAJIB lewat `raw_scrape` + gate kota di atas; halal/kids/hype kosong → `NULL`.
