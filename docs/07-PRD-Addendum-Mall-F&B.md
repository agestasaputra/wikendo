# PRD Addendum — Mall F&B Directory (Split Quiz)

**Version:** 1.2 Amended (6 Okt 2026 malam — sinkron patch NULL tri-state)
**Date:** 6 Okt 2026
**Status:** Approved by Agesta (6 Okt 2026) — LOCKED, patch downstream ✅, UI ✅
**Merujuk ke:** `docs/01-PRD.md v2.0 Final` + `docs/02-ADR.md v2.1 Amended`
**Owner:** Agesta
**Perubahan vs v1.1:** Section 5 sinkron skema real: kolom metadata `data_source`/`verified_at`/`needs_survey` + tabel staging `raw_scrape` + aturan NULL tri-state (patch 6 Okt, sudah live di migration + seed + API + UI).

---

## 0. PRD Addendum itu apa? (penjelasan 30 detik)

PRD lu yang `01-PRD.md v2.0` itu udah Final & Approved — jangan diutak-atik lagi.

**Addendum = tambahan resmi ke PRD lama, tanpa ngubah isinya.**

- PRD v2.0 tetap berlaku (quiz tempat 30 detik → 5 rekomendasi tempat, quota 2/hari).
- File ini cuma nambah scope baru: **quiz + directory tenant F&B per mall yang berdiri sendiri**.
- Di workflow company lu (PRD → RFC → ADR), file ini = RFC mini. Sekali approve → patch ADR + Schema + API → Jira.

---

## 1. Problem Tambahan

PRD v2.0 solve **decision fatigue weekend secara umum** ("mau kemana weekend ini?").

Problem turunan satu topik:
> "Gue udah di Grand Indonesia, mau makan apa? Halal, budget <100k, bisa nongkrong lama."

Keputusan baru per masukan lu: **jangan campur**. Alasan CTO setuju:
- Ekspektasi beda: cari tempat = planning 2-3 menit (save/share), cari makan = lapar <10 detik.
- Card beda: tempat butuh area + best time, tenant butuh lantai + halal + budget + misi.
- Kalau dicampur 3+2, user bingung ("ini mau ngajak jalan apa ngajak makan?") → click-rate turun.

---

## 2. Visi Revisi: Two Entry, Two Quiz, One Data

```
[Entry 1: Cari Tempat] quiz 30 detik → 5 rekomendasi TEMPAT (PRD v2.0 murni)
[Entry 2: Cari Makan] quiz 20 detik → 5 rekomendasi TENANT (data Supabase, file ini)
```

Satu data fondasi (`malls → tenants`, 200 rows sudah jadi di `data/tenants-seed.csv`), dua quiz terpisah, dua result page terpisah.

Landing `/` punya 2 CTA besar:
- 🗺️ "Cari Tempat Weekend" → `/quiz` (existing)
- 🍜 "Cari Makan di Mall" → `/makan` (baru)

---

## 3. Scope V1 — Quiz Tempat (TIDAK BERUBAH, PRD v2.0 murni)

Tidak ada Q6 mall. Tidak ada tenant di result tempat. 100% sesuai PRD v2.0:

Q1 mood → Q2 companion → Q3 child_age (conditional) → Q4 budget → Q5 location → Q6 time (optional) → `/result` 5 tempat.

---

## 4. Scope V1 — Quiz Makan (baru, eksekusi bareng Plan Mode)

### 4.1 Entry
- CTA di landing + navbar `[Makan]` + halaman direktori `/mall/:slug` ada tombol "Cariin yang cocok".

### 4.2 Quiz `/makan` (4 pertanyaan, ~20 detik, 1 layar 1 pertanyaan)

1. **"Mau makan di mall mana?"** → [GI] / [Central Park] / [Kokas] / [PIM] / [Aeon BSD] (wajib pilih 1, tidak ada opsi bebas — biar result murni tenant)
2. **"Misi makan kali ini?"** → Makan Cepat / Nongkrong Lama / Keluarga / Healing
3. **"Budget per orang?"** → Hemat (<50k) / Menengah (50-150k) / Leluasa (>150k) — sama kayak quiz tempat biar konsisten
4. **"Rombongan + pantangan?"** → Sendiri / Berdua / Rame-rame + toggle Halal only + toggle Kids-friendly

### 4.3 Result `/result-makan` (5 TENANT saja, tidak ada tempat umum)

Card khusus tenant:
```
┌────────────────────────────────────────┐
│ 🍜 HokBen                              │
│ [Japanese • GI Lt.3A] [✅ Halal]       │
│ Kenapa cocok: "Cepat, halal, budget   │
│ hemat, cocok buat rame-rame."          │
│ 💰 30-80rb • 👨‍👩‍👧 Kids • 🔥 Hype TikTok │
│ [📍 Maps] [💾 Simpan] [Lapor tutup]    │
└────────────────────────────────────────┘
```

Actions: Maps (deep link nama tenant + mall), Simpan (login wall sama kayak tempat), Lapor tutup/buka (tanpa login), Vote/share.

### 4.4 Direktori SEO `/mall/:slug` (tetap ada, tanpa LLM, gratis)
List 40 tenant searchable + filter halal/budget/lantai/kids/mission/search. Tombol "Cariin yang cocok →" masuk ke `/makan?mall=gi` (pre-filled Q1).

---

## 5. Data — Daftar Tenant Per Mall

Schema tidak berubah dari v1.0 (sudah benar untuk split):

```sql
CREATE TABLE malls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT 'Jakarta',
  area TEXT,
  maps_url TEXT,
  total_tenant INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mall_id UUID NOT NULL REFERENCES malls(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  lantai TEXT NOT NULL,
  halal BOOLEAN DEFAULT NULL,          -- NULL = belum survey (tri-state, patch 6 Okt)
  budget_tier TEXT NOT NULL,
  price_range TEXT,
  kids_friendly BOOLEAN DEFAULT NULL,  -- NULL = belum survey
  mission TEXT[] DEFAULT '{}',
  hype_tiktok BOOLEAN DEFAULT NULL,    -- NULL = belum survey
  is_open BOOLEAN DEFAULT true,
  maps_url TEXT,
  -- Metadata kualitas data (patch 6 Okt 2026, wajib):
  data_source TEXT DEFAULT 'curated',  -- 'curated' | 'scrape' | 'survey'
  verified_at TIMESTAMPTZ DEFAULT NULL,
  needs_survey BOOLEAN DEFAULT false,  -- TRUE kalau halal/kids/hype masih NULL
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_tenants_mall ON tenants(mall_id);
CREATE INDEX idx_tenants_filter ON tenants(mall_id, budget_tier, halal) WHERE is_open = true;
ALTER TABLE malls ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read malls" ON malls FOR SELECT USING (true);
CREATE POLICY "Public read tenants" ON tenants FOR SELECT USING (true);
```

**Staging scrape (patch 6 Okt 2026):** hasil scraper TIDAK langsung ke `tenants`.
Wajib lewat `raw_scrape` (RLS closed, no public-read) + gate Jabodetabek 2 lapis
(allowlist target + kolom city reject non-Jabodetabek) + parser per-mall.
Mall tanpa tenant = `is_active=false` otomatis hidden.

**Aturan NULL tri-state (patch 6 Okt 2026, wajib):** field belum riset = `NULL`,
bukan `FALSE`/`""`. Filter safety: `.eq('halal', true)` auto-exclude NULL saat halal-only.
UI badge ketiga: ❓ Belum terverifikasi + 📋 Perlu survey. Audit: `supabase/AUDIT.md`
(halal 194/200 mustahil, is_open 200/200 mustahil — wajib survey lapangan P1).

CSV `data/tenants-seed.csv` 200 rows tetap dipakai (5 mall x 40). Tidak perlu ubah.

### Dimana tenant list dipasang (revisi split):
1. **Result Makan:** 5 tenant murni (bukan campuran).
2. **Direktori `/mall/:slug`:** list + filter (SEO).
3. **History/Favorites:** snapshot JSONB + `type: 'tempat' | 'makan'` biar tidak kecampur di UI.

---

## 6. API (revisi split, tidak ngubah 9 endpoint tempat)

Tempat (existing, tidak berubah):
```
POST /api/generate → body quiz tempat → 5 tempat
```

Makan (baru):
```
GET  /api/malls → list 5 mall
GET  /api/malls/:slug → detail + stats
GET  /api/malls/:slug/tenants?halal=true&budget=hemat&mission=nongkrong_lama&search=kopi
POST /api/makan/recommend → body {mall_slug, mission, budget_tier, companion, halal_only, kids_friendly} → Top 5 tenant
POST /api/vote → {generation_id, tenant_id} tanpa login, rate-limit IP
POST /api/report-tenant → {tenant_id, issue}
```

Type:
```typescript
export interface MakanQuizInput {
  mall_slug: string;
  mission: 'makan_cepat'|'nongkrong_lama'|'keluarga'|'healing';
  budget_tier: 'hemat'|'menengah'|'leluasa';
  companion: 'sendiri'|'berdua'|'rame';
  halal_only?: boolean;
  kids_friendly?: boolean;
}
```

---

## 7. Quota & Cost (revisi split)

Rekomendasi CTO (decisive):
- Quota Tempat: 2/hari (tetap, PRD v2.0).
- Quota Makan: 5/hari terpisah (tidak makan quota tempat).
- Alasan: behaviour beda (makan bisa 2-3x sehari: lunch/dinner), cost tetap $0 (filter Supabase gratis, LLM CF cuma ranking ~400 token).
- Implementasi: tambah kolom `quota_type` di `user_quota` atau table baru `mall_search_quota(user_id, date, used)`. Anonymous: cookie terpisah `makan_quota_used`.

---

## 8. Effort Revisi

| Item | Estimasi |
|---|---|
| Schema malls/tenants + seed 200 rows (sudah jadi CSV) | 1 jam import + verifikasi |
| GET malls + tenants list + halaman `/mall/:slug` | 5 jam (reuse card) |
| Quiz `/makan` (4 Q) + result-makan (card tenant) | 5 jam (copy-paste quiz tempat, ganti Q + card) |
| POST /api/makan/recommend (filter DB + ranking LLM) | 2 jam |
| **Total tambahan V1** | **~13 jam** (+2 jam vs campur, tapi UX bersih, worth it) |

Hapus dari scope: logika campur 3+2 (tidak jadi).

---

## 9. Metrics

- Makan quiz completion >75% (lebih pendek dari tempat)
- Makan result → Maps click >40%
- Lapor tutup/buka per minggu (freshness)
- Tenant halu complaint = 0 (semua dari DB)

---

## 10. Next Step

1. Lu approve v1.1 ini → gue patch ADR + Schema + API + update prototype quiz/makan.
2. Coding Phase 1 tetap jalan (tempat dulu, makan paralel).

**Ditulis oleh:** Hermes (CTO+CEO mode)
**Di-review oleh:** Agesta — ketik "approve" untuk gas, atau "revisi: ..." kalau mau ubah.
