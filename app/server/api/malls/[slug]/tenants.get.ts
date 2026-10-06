/**
 * GET /api/malls/:slug/tenants — List tenant 1 mall + filter server-side.
 * Query: ?halal=true ?budget=hemat|menengah|leluasa ?kids=true ?search=kopi ?mission=nongkrong_lama
 * Filter kolom dikerjakan di SQL Supabase; filter mission (array) di-memory setelah fetch.
 * Tanpa login/quota/LLM. 404 kalau slug mall tidak ada.
 * ATURAN NULL (tri-state): ?halal=true pakai .eq('halal', true) → row halal=NULL otomatis
 * ke-exclude (belum riset ≠ halal). Direktori tampil apa adanya + badge ❓ di UI.
 */
import { supabaseAdmin } from '../../../utils/db'
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
  return list
})
