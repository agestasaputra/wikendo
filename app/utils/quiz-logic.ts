/**
 * quiz-logic.ts — Logic murni quiz & direktori (tidak ada dependensi Vue/Nuxt).
 *
 * KENAPA file ini ada:
 * Logic seperti progress bar, pre-fill mall, search, dan Maps URL dipakai di
 * beberapa pages (quiz.vue, makan.vue, mall/[slug].vue, recommend.post.ts).
 * Ditaruh di sini (bukan duplikat di tiap file) supaya:
 * 1. Satu sumber kebenaran — ubah sekali, berlaku di mana-mana.
 * 2. Bisa di-unit-test tanpa browser/Nuxt (vitest langsung import file ini).
 *
 * ATURAN: fungsi di sini harus PURE (input → output, tanpa side effect,
 * tanpa baca route/cookie/DB). Side effect tetap di pages/server.
 */
import type { QuotaStatus, QuotaStatusInput, LoaderMeta, LoaderVariant, WalletLabel, QuizFlow, QuizHeaderMeta, VoucherStyle, VoucherCardMeta } from '../types'

export function progressPercent(step: number, total: number): number {
  return ((step + 1) / total) * 100
}

export function isLastStep(step: number, total: number): boolean {
  return step >= total - 1
}

/**
 * Tentukan step awal quiz makan. Dipakai di makan.vue:
 * kalau user datang dari direktori (?mall=slug-valid), Q1 (pilih mall) di-skip.
 */
export function getMakanStartStep(
  mallQuery: string | undefined,
  validSlugs: string[]
): number {
  return mallQuery && validSlugs.includes(mallQuery) ? 1 : 0
}

/** Search client-side di direktori mall. Case-insensitive. */
export function filterTenantsByKeyword<T extends { name: string }>(
  tenants: T[],
  keyword: string
): T[] {
  const kw = keyword.toLowerCase()
  return tenants.filter((t) => t.name.toLowerCase().includes(kw))
}

/** Bikin link Google Maps buat 1 tenant. Dipakai di recommend.post.ts. */
export function buildMapsUrl(tenantName: string, mallSlug: string): string {
  return (
    'https://www.google.com/maps/search/' +
    encodeURIComponent(`${tenantName} ${mallSlug}`)
  )
}

/* ── Quota split v1.3 (Addendum 09) ─────────────────────────────
 * KENAPA di sini (pure): parsing cookie + bangun response quota split
 * dipakai server + pages wallet 2-state. Tanpa baca cookie/DB langsung —
 * caller yang baca cookie lalu passing string/angka ke sini.
 * Kontrak response persis GET /api/quota v1.1 di docs/05-API-Specification.md.
 * Contoh: buildQuotaStatus({ tempatUsed: 0, makanUsed: 1, isLoggedIn: false })
 */

/** Cookie `quota_used` (tempat, anon 1x) → 0|1. Nilai ngaco = 0 (aman). */
export function parseAnonTempatUsed(cookieValue: string | undefined): number {
  return cookieValue === '1' ? 1 : 0
}

/** Cookie `makan_quota_used` (makan, anon 2x) → 0|1|2. Dijepit 0–2, ngaco = 0. */
export function parseAnonMakanUsed(cookieValue: string | undefined): number {
  const n = parseInt(cookieValue || '0', 10)
  if (Number.isNaN(n) || n <= 0) return 0
  return Math.min(n, 2)
}

/** Bangun response quota split: anon (1+2 + login_cta) vs register (2+5). */
export function buildQuotaStatus(input: QuotaStatusInput): QuotaStatus {
  if (!input.isLoggedIn) {
    return {
      tempat: { used: input.tempatUsed, limit: 1, remaining: 1 - input.tempatUsed },
      makan: { used: input.makanUsed, limit: 2, remaining: 2 - input.makanUsed },
      is_logged_in: false,
      reset_at: null,
      login_cta: 'Login gratis → buka 2 tempat + 5 makan/hari'
    }
  }
  return {
    tempat: { used: input.tempatUsed, limit: 2, remaining: 2 - input.tempatUsed },
    makan: { used: input.makanUsed, limit: 5, remaining: 5 - input.makanUsed },
    is_logged_in: true,
    reset_at: input.resetAt ?? null
  }
}

/** Momen wall #1 tempat: anon yang used>=1 (generate ke-2 dikunci). Register bukan wall. */
export function isTempatLoginWall(used: number, isLoggedIn: boolean): boolean {
  return !isLoggedIn && used >= 1
}

/** Momen wall #1 makan: anon yang used>=2 (generate ke-3 dikunci). Register bukan wall. */
export function isMakanLoginWall(used: number, isLoggedIn: boolean): boolean {
  return !isLoggedIn && used >= 2
}

/* ── Wallet label home (index.vue) ─────────────────────────────────
 * KENAPA di sini (pure): wallet home tadinya static "2 tempat • 5 makan"
 * (limit REGISTER) padahal user sekarang anon → scarcity bohong.
 * QuotaStatus (dari GET /api/quota) → label jujur ikut sisa.
 * exhausted = momen login CTA. Tanpa baca API/cookies langsung.
 * Contoh: buildWalletLabel(buildQuotaStatus({tempatUsed:0,makanUsed:0,isLoggedIn:false}))
 * → { headline: '1 tempat • 2 makan', ... }.
 */

/** QuotaStatus → label wallet: headline sisa + chip "sisa/limit" + flag habis. */
export function buildWalletLabel(status: QuotaStatus): WalletLabel {
  const t = status.tempat.remaining
  const m = status.makan.remaining
  return {
    headline: `${t} tempat • ${m} makan`,
    tempatChip: `${t}/${status.tempat.limit} tempat`,
    makanChip: `${m}/${status.makan.limit} makan`,
    exhausted: t <= 0 && m <= 0
  }
}

/* ── Auth gate v1.3 (Addendum 09) ─────────────────────────────────
 * KENAPA di sini (pure): normalisasi phone + validasi format + format
 * kode voucher + wall momen #2-4 dipakai server (register/claim) +
 * pages (bottom sheet login). Tanpa baca auth/DB langsung.
 * Kontrak: API §register (phone optional) + §16 claim (WIK-XXXXX) +
 * Journey (4 momen wall). Contoh: normalizePhone('  ') → null.
 */

/** API §register: trim input HP, kosong/undefined → null (skip = valid). */
export function normalizePhone(input: string | undefined): string | null {
  const trimmed = (input || '').trim()
  return trimmed ? trimmed : null
}

/**
 * Schema CHECK `phone IS NULL OR phone ~ '^\+62[0-9]{9,13}$'`:
 * null/undefined/kosong = true (skip), isi wajib format +62.
 */
export function isPhoneValid(phone: string | null | undefined): boolean {
  if (phone === null || phone === undefined || phone === '') return true
  return /^\+62[0-9]{9,13}$/.test(phone)
}

/** API §16: kode klaim `WIK-XXXXX` (5 char A-Z/0-9 uppercase). */
export function isVoucherCodeValid(code: string | undefined): boolean {
  return typeof code === 'string' && /^WIK-[A-Z0-9]{5}$/.test(code)
}

/** Generate kode klaim baru `WIK-XXXXX` (random A-Z/0-9, tanpa I/O biar testable). */
export function generateVoucherCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let suffix = ''
  for (let i = 0; i < 5; i++) {
    suffix += chars[Math.floor(Math.random() * chars.length)]
  }
  return `WIK-${suffix}`
}

/** Momen wall #2: tap Simpan — anon dikunci, login lolos. */
export function isSaveLoginWall(isLoggedIn: boolean): boolean {
  return !isLoggedIn
}

/** Momen wall #3a: buka Wishlist — anon dikunci, login lolos. */
export function isWishlistLoginWall(isLoggedIn: boolean): boolean {
  return !isLoggedIn
}

/** Momen wall #3b: buka Riwayat — anon dikunci, login lolos. */
export function isHistoryLoginWall(isLoggedIn: boolean): boolean {
  return !isLoggedIn
}

/** Momen wall #4: klaim voucher WAJIB login (anon → 401, anti-farming). */
export function isVoucherClaimWall(isLoggedIn: boolean): boolean {
  return !isLoggedIn
}

/* ── Loader spinner fetching API ───────────────────────────────────
 * KENAPA di sini (pure): warna aksen + pesan per variant dipakai komponen
 * AppLoader di 3 pages (result, result-makan, mall/[slug]) → 1 sumber
 * kebenaran, bukan hardcode warna di tiap page. Tanpa baca route/state.
 * Contoh: getLoaderMeta('makan').accent → '#ee2c4b'.
 */

/** Meta spinner per variant: warna aksen + judul + hint. Variant ngaco = fallback mall (aman). */
export function getLoaderMeta(variant: LoaderVariant): LoaderMeta {
  if (variant === 'tempat') {
    return { accent: '#f97316', title: 'Lagi cariin tempat yang cocok…', hint: 'LLM lagi ranking 5 tempat • 30–45 detik' }
  }
  if (variant === 'makan') {
    return { accent: '#ee2c4b', title: 'Lagi cariin tenant yang cocok…', hint: 'Filter tenant + ranking LLM • 20 detik' }
  }
  return { accent: '#0e7490', title: 'Lagi muat tenant…', hint: 'Direktori mall • tanpa LLM, bentar doang' }
}

/* ── Nama mall (direktori + quiz makan) ────────────────────────────
 * KENAPA di sini (pure): mapping slug→nama dipakai 3 tempat
 * (mall/index.vue, mall/[slug].vue, result-makan.vue) → 1 sumber
 * kebenaran. Mall ke-6 = tambah 1 entry di 2 map ini. Tanpa baca route/DB.
 * Contoh: getMallShortLabel('grand-indonesia') → 'GI'.
 */

const MALL_NAMES: Record<string, string> = {
  'grand-indonesia': 'Grand Indonesia',
  'central-park': 'Central Park',
  'kota-kasablanka': 'Kota Kasablanka',
  'pondok-indah-mall': 'Pondok Indah Mall',
  'aeon-bsd': 'Aeon BSD'
}

const MALL_SHORT_LABELS: Record<string, string> = {
  'grand-indonesia': 'GI',
  'central-park': 'CP',
  'kota-kasablanka': 'Kokas',
  'pondok-indah-mall': 'PIM',
  'aeon-bsd': 'Aeon'
}

/** Slug → nama lengkap. Slug ngaco = fallback slug as-is (tidak crash). */
export function getMallName(slug: string): string {
  return MALL_NAMES[slug] || slug
}

/** Slug → label pendek chip (GI, CP, Kokas, PIM, Aeon). Ngaco = fallback slug. */
export function getMallShortLabel(slug: string): string {
  return MALL_SHORT_LABELS[slug] || slug
}

/* ── Header quiz Q2d/M3d + voucher V12 (board v7, gas Q2d+M3d+V12) ──
 * KENAPA di sini (pure): meta header quiz (label putih + dot ember/rose-terang,
 * segmen lime, selected ember vs rose) dipakai 2 pages (quiz.vue + makan.vue)
 * → 1 sumber kebenaran, bukan hardcode hex di tiap page.
 * Tanpa baca route/state. Contoh: getQuizHeaderMeta('tempat').dot → '#FB923C'.
 */

/** Meta header quiz per flow: label putih + dot + segmen lime + selected split. */
export function getQuizHeaderMeta(flow: QuizFlow): QuizHeaderMeta {
  const base = {
    labelColor: '#fff',
    questionColor: '#fff',
    headBg: '#0C0A09',
    segOn: '#A3E635'
  }
  if (flow === 'makan') {
    return {
      ...base,
      label: 'QUIZ MAKAN',
      dot: '#FDA4AF',
      selBorder: '#E11D48',
      selBg: '#FFE4E6'
    }
  }
  return {
    ...base,
    label: 'QUIZ TEMPAT',
    dot: '#FB923C',
    selBorder: '#EA580C',
    selBg: '#FFF7ED'
  }
}

/** Segmen blok quiz: index < step+1 = nyala. Contoh: getQuizSegState(0,5) → [T,F,F,F,F]. */
export function getQuizSegState(step: number, total: number): boolean[] {
  return Array.from({ length: total }, (_, i) => i <= step)
}

/** Meta kartu voucher: gift = V12 gift surprise (grad cream-rose + pill rose). */
export function getVoucherCardMeta(style: VoucherStyle): VoucherCardMeta {
  void style
  return {
    bg: 'linear-gradient(140deg,#FFF7ED,#FFE4E6)',
    border: '#FECDD3',
    goBg: '#E11D48',
    goColor: '#fff'
  }
}
