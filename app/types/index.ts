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
