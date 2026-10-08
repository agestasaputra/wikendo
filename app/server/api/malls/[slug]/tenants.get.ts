/**
 * GET /api/malls/:slug/tenants — List tenant 1 mall + filter server-side + paging S2b.
 * Query filter: ?halal=true ?budget=hemat|menengah|leluasa ?kids=true ?search=kopi ?mission=nongkrong_lama
 * Tanpa ?limit = array legacy (backward-compat, 40 tenant sekaligus seperti sekarang).
 * Dengan ?limit&?offset = objek { items, total, hasMore } (10/page default, max 50).
 * Filter kolom di SQL Supabase; mission (array) di-memory; paging di-slice setelah
 * semua filter (benar untuk 40 row/mall, total = pasca-filter buat sticky count "10/40").
 * Tanpa login/quota/LLM. 404 kalau slug mall tidak ada.
 * ATURAN NULL (tri-state): ?halal=true pakai .eq('halal', true) → row halal=NULL otomatis
 * ke-exclude (belum riset ≠ halal). Direktori tampil apa adanya + badge ❓ di UI.
 */
import { supabaseAdmin } from '../../../utils/db'
import { parsePaginationParams, hasMorePages } from '../../../../utils/quiz-logic'
import type { TenantRow } from '~/types'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug') as string
  const query = getQuery(event)
  const db = supabaseAdmin()

  const { data: mall } = await db.from('malls').select('*').eq('slug', slug).single()
  if (!mall) throw createError({ statusCode: 404, statusMessage: 'Mall tidak ditemukan' })

  let q = db.from('tenants').select('*').eq('mall_id', mall.id).eq('is_open', true)
  if (query.halal === 'true') q = q.eq('halal', true)
  if (query.budget) q = q.eq('budget_tier', query.budget)
  if (query.kids === 'true') q = q.eq('kids_friendly', true)
  if (query.search) q = q.ilike('name', `%${query.search}%`)
  const { data: tenants } = await q.order('name')

  let list = (tenants || []) as TenantRow[]
  if (query.mission) list = list.filter((t: TenantRow) => (t.mission || []).includes(query.mission as string))

  // Legacy: tanpa ?limit → array penuh (kontrak lama).
  if (query.limit === undefined) return list

  const { limit, offset } = parsePaginationParams(query as Record<string, unknown>)
  const items = list.slice(offset, offset + limit)
  return { items, total: list.length, hasMore: hasMorePages(offset + items.length, list.length) }
})
