/**
 * GET /api/malls — List semua mall aktif (is_active=true, urut nama).
 * Tanpa login/quota/LLM — halaman direktori boleh diakses siapa pun.
 */
import { supabaseAdmin } from '../../utils/db'

export default defineEventHandler(async () => {
  const db = supabaseAdmin()
  const { data } = await db.from('malls').select('*').eq('is_active', true).order('name')
  return data || []
})
