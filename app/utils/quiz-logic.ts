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
