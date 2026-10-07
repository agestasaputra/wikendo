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
import type { QuotaStatus, QuotaStatusInput } from '../types'

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
