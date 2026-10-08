/**
 * types/index.ts — KONTRAK DATA project (satu-satunya sumber kebenaran bentuk data).
 *
 * ATURAN: nambah/ubah field? Edit file ini DULU, baru pages/server yang pakai.
 * - QuizTempatInput  = body POST /api/tempat/recommend (dari quiz.vue via query string)
 * - QuizMakanInput   = body POST /api/makan/recommend (dari makan.vue via query string)
 * - TempatRecommendation = 1 kartu di result.vue (output generateTempat/LLM)
 * - TenantRecommendation = 1 kartu di result-makan.vue (tenant DB + reason LLM + maps_url)
 * - TenantRow        = 1 baris mentah tabel `tenants` Supabase
 * - RankResult       = output rankTenants(): nama (HARUS persis dari kandidat) + reason
 * - LLMChatResponse  = bentuk mentah response 9Router (choices[0].message.content)
 */
export interface QuizTempatInput {
  mood: string
  companion: string
  budget: string
  location: string
  time?: string
}

export interface QuizMakanInput {
  mall_slug: string
  mission: string
  budget_tier: string
  companion: string
  halal_only?: boolean
  kids_friendly?: boolean
}

export interface TempatRecommendation {
  name: string
  category: string
  reason: string
  estimated_cost: string
  location_area: string
  best_time: string
  confidence: string
}

export interface TenantRecommendation {
  name: string
  category: string
  lantai: string
  halal: boolean | null
  budget_tier: string
  price_range: string
  kids_friendly: boolean | null
  hype_tiktok: boolean | null
  reason: string
  maps_url: string
  data_source?: string
  needs_survey?: boolean
}

export interface TenantRow {
  name: string
  category: string
  lantai: string
  halal: boolean | null
  budget_tier: string
  price_range: string
  kids_friendly: boolean | null
  hype_tiktok: boolean | null
  mission?: string[]
  mall_id?: string
  is_open?: boolean
  data_source?: string
  verified_at?: string | null
  needs_survey?: boolean
}

export interface RankResult {
  name: string
  reason: string
}

export interface LLMChatResponse {
  choices: { message: { content: string } }[]
}

/**
 * QuotaStatus — KONTRAK GET /api/quota v1.1 (Addendum 09 v1.3, split tempat+makan).
 * - Anon: tempat limit 1 + makan limit 2 + reset_at null + login_cta (wallet 2-state).
 * - Register: tempat limit 2 + makan limit 5 + reset_at 00:00 WIB, TANPA login_cta.
 * Dipakai: buildQuotaStatus() di utils/quiz-logic + server/api/quota.get.ts.
 */
export interface QuotaSlice {
  used: number
  limit: number
  remaining: number
}

export interface QuotaStatusInput {
  tempatUsed: number
  makanUsed: number
  isLoggedIn: boolean
  resetAt?: string | null
}

export interface QuotaStatus {
  tempat: QuotaSlice
  makan: QuotaSlice
  is_logged_in: boolean
  reset_at: string | null
  login_cta?: string
}

/**
 * WalletLabel — KONTRAK wallet quota home (pages/index.vue).
 * - headline: sisa per mode ("1 tempat • 2 makan") — jujur ikut GET /api/quota, bukan static.
 * - tempatChip/makanChip: "sisa/limit mode" ("0/1 tempat", "2/5 makan").
 * - exhausted: true = dua-duanya 0 → momen login CTA.
 * Dipakai: buildWalletLabel() di utils/quiz-logic.
 */
export interface WalletLabel {
  headline: string
  tempatChip: string
  makanChip: string
  exhausted: boolean
}

/**
 * LoaderVariant — KONTRAK spinner fetching API (1 helper + 1 komponen, 3 pages).
 * - tempat = orange #f97316 (result.vue, POST /api/tempat/recommend, LLM 30-45 dtk)
 * - makan = merah #ee2c4b (result-makan.vue, POST /api/makan/recommend, rank tenant)
 * - mall = teal #0e7490 (mall/[slug].vue, GET tenants filter, tanpa LLM)
 * Dipakai: getLoaderMeta() di utils/quiz-logic + components/AppLoader.vue.
 */
export type LoaderVariant = 'tempat' | 'makan' | 'mall'

export interface LoaderMeta {
  accent: string
  title: string
  hint: string
}

/**
 * QuizFlow — KONTRAK header quiz Q2d/M3d (board v7, gas Q2d+M3d+V12).
 * - tempat = QUIZ TEMPAT + dot ember-terang #FB923C, selected ember #EA580C/#FFF7ED
 * - makan = QUIZ MAKAN + dot rose-terang #FDA4AF, selected rose #E11D48/#FFE4E6
 * Label + question PUTIH #fff di atas ink #0C0A09 (AAA). Segmen blok lime #A3E635.
 * Dipakai: getQuizHeaderMeta() di utils/quiz-logic + pages/quiz.vue + pages/makan.vue.
 */
export type QuizFlow = 'tempat' | 'makan'

export interface QuizHeaderMeta {
  label: string
  dot: string
  labelColor: string
  questionColor: string
  headBg: string
  segOn: string
  selBorder: string
  selBg: string
}

/**
 * VoucherStyle — KONTRAK kartu voucher result-makan (board v7, gas Q2d+M3d+V12).
 * - gift = V12 gift surprise: bg grad cream-rose + border pink + pill rose.
 * Dipakai: getVoucherCardMeta() di utils/quiz-logic + pages/result-makan.vue.
 */
export type VoucherStyle = 'gift'

export interface VoucherCardMeta {
  bg: string
  border: string
  goBg: string
  goColor: string
}

/**
 * InfinitePage — KONTRAK paging S2b infinity scroll (list mall + detail mall).
 * - items: potongan page ini (10/page tenant, mall future-proof)
 * - total: jumlah penuh pasca-filter (sticky count "10/40")
 * - hasMore: loaded < total → sentinel masih dipantau
 * API backward-compat: tanpa ?limit = array legacy (bukan objek ini).
 * Dipakai: useInfiniteList() + GET /api/malls + GET /api/malls/:slug/tenants.
 */
export interface InfinitePage<T> {
  items: T[]
  total: number
  hasMore: boolean
}

/**
 * InfiniteFetchPage — fetch 1 page: boleh objek InfinitePage ATAU array legacy.
 * Array legacy = API lama tanpa ?limit (40 tenant sekaligus) → hasMore false.
 */
export type InfiniteFetchPage<T> = InfinitePage<T> | T[]

/**
 * ResultCardMeta — KONTRAK meta kartu result R3b (tempat photo+lime) + F1b (makan tiket).
 * - R3b: strip ember #EA580C + best lime #A3E635 teks ink + aksi ink + chip Lainnya ink/lime.
 * - F1b: tiket ink + diskon lime + border dashed pink #FECDD3 + Klaim rose #E11D48 + BEST lime + halal mint.
 * - Page paper #F5F5F4 + kartu putih (token lock Agesta).
 * Dipakai: getResultTempatMeta()/getResultMakanMeta() di utils/quiz-logic + pages/result.vue + pages/result-makan.vue.
 */
export interface ResultTempatMeta {
  strip: string
  bestBg: string
  bestColor: string
  actionBg: string
  actionColor: string
  pageBg: string
  cardBg: string
  moreBg: string
  moreColor: string
}

export interface ResultMakanMeta {
  ticketBg: string
  discountColor: string
  ticketBorder: string
  claimBg: string
  claimColor: string
  bestBg: string
  halalBg: string
  halalColor: string
  pageBg: string
  cardBg: string
}

/**
 * HomeHeroMeta — KONTRAK hero home I17 V2 Ember P1 (slicing full dari screenshot V2).
 * - headBg ink #0C0A09 + strip ember #EA580C (V2, bukan orange I2 #F97316)
 * - angka lime-di-gelap #D9F99D + pill lime #A3E635 teks ink
 * - CTA Tempat/Makan ink (I17), page paper #F5F5F4, kartu putih, badge mint
 * Dipakai: getHomeHeroMeta() di utils/quiz-logic + pages/index.vue.
 */
export interface HomeHeroMeta {
  headBg: string
  strip: string
  numColor: string
  pillBg: string
  pillColor: string
  ctaBg: string
  ctaColor: string
  pageBg: string
  cardBg: string
  tagBg: string
  tagColor: string
}

/**
 * TenantCardMeta — KONTRAK thumb kartu tenant S2c (slicing 8 Okt 2026).
 * - emoji: thumb emoji per kategori (kopi☕, japanese🍜, healthy🥗, fallback🍜)
 * - bg: warna avatar kotak rounded per kategori (kopi maroon #7C2D12,
 *   japanese charcoal #1C1917, healthy hijau #15803D, fallback #44403C)
 * DB real tanpa kolom rating/promo → rating/promo/badge diturunkan
 * deterministik via helper pure (flag adaptasi di PROGRESS, bukan bohong).
 * Dipakai: getTenantCardMeta() di utils/quiz-logic + pages/mall/[slug].vue.
 */
export interface TenantCardMeta {
  emoji: string
  bg: string
}
