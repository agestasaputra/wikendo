-- migration.sql — Tabel Mall F&B (Phase 8.1, Addendum 07 v1.1).
--
-- APA: bikin 3 tabel (malls, tenants, mall_search_quota) + index + RLS public-read.
-- KENAPA file terpisah dari seed.sql: struktur (sekali) vs data (boleh regenerate).
--   Run migration.sql DULU, baru seed.sql.
-- Cara pakai: paste SELURUH file ini di Supabase Dashboard → SQL Editor → Run.
-- Idempotent: semua pakai IF NOT EXISTS / DROP POLICY IF EXISTS — aman di-run ulang.
-- Sumber: docs/04-Database-Schema.md bagian "Addendum 07 v1.1".
--
-- CATATAN: tabel `generations` (dipakai API recommend buat nyimpen hasil) bukan bagian
-- file ini — dia dari skema dasar (docs/04 bagian 4). Kalau project Supabase masih kosong,
-- run skema dasar itu dulu, baru file ini.

-- 1. Tabel malls (5 rows V1: GI, Central Park, Kokas, PIM, Aeon BSD)
CREATE TABLE IF NOT EXISTS malls (
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
COMMENT ON TABLE malls IS 'Daftar mall V1 (direktori + quiz makan)';

-- 2. Tabel tenants (200 rows V1, 40 per mall — lihat seed.sql)
-- ATURAN NULL (approved 6 Okt 2026): halal/kids_friendly/hype_tiktok NULL = belum riset,
-- BUKAN false. Jangan isi string kosong — pakai NULL + needs_survey=TRUE.
CREATE TABLE IF NOT EXISTS tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mall_id UUID NOT NULL REFERENCES malls(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  lantai TEXT NOT NULL,
  halal BOOLEAN DEFAULT true,
  budget_tier TEXT NOT NULL CHECK (budget_tier IN ('hemat','menengah','leluasa')),
  price_range TEXT,
  kids_friendly BOOLEAN DEFAULT false,
  mission TEXT[] DEFAULT '{}',
  hype_tiktok BOOLEAN DEFAULT false,
  is_open BOOLEAN DEFAULT true,
  maps_url TEXT,
  data_source TEXT NOT NULL DEFAULT 'curated'
    CHECK (data_source IN ('curated','scrape','deep_research','manual')),
  verified_at TIMESTAMPTZ,
  needs_survey BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- Kolom baru buat DB yang SUDAH run migration lama (idempotent, aman di-run ulang):
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS data_source TEXT NOT NULL DEFAULT 'curated';
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS verified_at TIMESTAMPTZ;
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS needs_survey BOOLEAN NOT NULL DEFAULT false;
COMMENT ON TABLE tenants IS 'Tenant F&B per mall (sumber ranking quiz makan + direktori)';
COMMENT ON COLUMN tenants.mission IS 'Misi yang cocok: makan_cepat, nongkrong_lama, keluarga, healing (bisa >1)';
COMMENT ON COLUMN tenants.halal IS 'NULL = belum riset (bukan non-halal). Filter halal-only exclude NULL.';
COMMENT ON COLUMN tenants.kids_friendly IS 'NULL = belum riset (bukan tidak ramah anak).';
COMMENT ON COLUMN tenants.hype_tiktok IS 'NULL = belum riset (bukan tidak hype). Temporal, expire 90 hari.';
COMMENT ON COLUMN tenants.data_source IS 'curated=scrape awal V1 | scrape=list mentah | deep_research=riset brand | manual=survey lapangan';
COMMENT ON COLUMN tenants.verified_at IS 'NULL = belum verifikasi lapangan. Diisi saat survey manual selesai.';
COMMENT ON COLUMN tenants.needs_survey IS 'TRUE = ada field NULL, masuk antrian survey manual.';

-- 2b. Tabel staging scrape (kotor boleh masuk, WAJIB ada city buat gate Jabodetabek).
-- APA: penampung mentah SEBELUM masuk tenants bersih. KENAPA dipisah: format tiap
-- website mall beda-beda, jangan cemari tabel produksi. Alur: scrape → raw_scrape
-- → GATE wilayah (city harus Jabodetabek, selain itu REJECT) → normalisasi 1 parser
-- per mall → INSERT tenants (halal/kids/hype = NULL + needs_survey=TRUE).
-- Scope LOCK: Jabodetabek = Jakarta, Bogor, Depok, Tangerang, Bekasi (+ varian
-- Selatan/Utara/Timur/Barat/Pusat). Di luar itu = tolak, walau datanya bagus.
CREATE TABLE IF NOT EXISTS raw_scrape (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mall_name TEXT NOT NULL,
  city TEXT NOT NULL,
  tenant_name TEXT NOT NULL,
  lantai TEXT,
  category TEXT,
  source_url TEXT,
  scraped_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','approved','rejected'))
);
COMMENT ON TABLE raw_scrape IS 'Staging scrape mentah. Gate: city WAJIB Jabodetabek, else status=rejected.';
COMMENT ON COLUMN raw_scrape.city IS 'Kota mall. Non-Jabodetabek → REJECT otomatis, jangan normalisasi.';

-- Index: lookup tenant per mall + filter quiz (mall + budget + halal, hanya yang buka)
CREATE INDEX IF NOT EXISTS idx_tenants_mall ON tenants(mall_id);
CREATE INDEX IF NOT EXISTS idx_tenants_filter
  ON tenants(mall_id, budget_tier, halal) WHERE is_open = true;

-- 3. Tabel quota makan login (anon pakai cookie, tidak pakai tabel ini)
CREATE TABLE IF NOT EXISTS mall_search_quota (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  used INT DEFAULT 0 CHECK (used >= 0),
  PRIMARY KEY (user_id, date)
);
COMMENT ON TABLE mall_search_quota IS 'Quota quiz makan user login: 5/hari (anon: cookie makan_quota_used max 2)';

-- 4. RLS: direktori boleh dibaca publik (tanpa login) — sesuai desain /mall/:slug gratis
ALTER TABLE malls ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE mall_search_quota ENABLE ROW LEVEL SECURITY;
ALTER TABLE raw_scrape ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read malls" ON malls;
CREATE POLICY "Public read malls" ON malls FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read tenants" ON tenants;
CREATE POLICY "Public read tenants" ON tenants FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users view own makan quota" ON mall_search_quota;
CREATE POLICY "Users view own makan quota" ON mall_search_quota
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service manage makan quota" ON mall_search_quota;
CREATE POLICY "Service manage makan quota" ON mall_search_quota
  FOR ALL USING (true) WITH CHECK (true);

-- raw_scrape: TIDAK public-read (data kotor staging). Hanya service role (bypass RLS
-- via supabaseAdmin) yang baca/tulis. Policy ini eksplisit block anon:
DROP POLICY IF EXISTS "No public access raw_scrape" ON raw_scrape;
CREATE POLICY "No public access raw_scrape" ON raw_scrape FOR SELECT USING (false);

DROP POLICY IF EXISTS "Service manage raw_scrape" ON raw_scrape;
CREATE POLICY "Service manage raw_scrape" ON raw_scrape
  FOR ALL USING (true) WITH CHECK (true);

-- Index antrian survey: query "mana yang needs_survey=TRUE" harus cepat
CREATE INDEX IF NOT EXISTS idx_tenants_needs_survey ON tenants(mall_id) WHERE needs_survey = true;
CREATE INDEX IF NOT EXISTS idx_raw_scrape_city_status ON raw_scrape(city, status);
