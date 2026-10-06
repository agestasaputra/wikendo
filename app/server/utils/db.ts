/**
 * server/utils/db.ts — Koneksi Supabase (ADMIN, server-only).
 *
 * APA: Singleton client Supabase pakai SERVICE ROLE key (bypass RLS).
 * KENAPA singleton: 1 client dipakai ulang, hemat koneksi DB.
 * ATURAN: file ini HANYA di-import dari server/api/*. JANGAN import dari pages/
 * (service key = rahasia, tidak boleh sampai ke browser).
 * Contoh: const db = supabaseAdmin(); const { data } = await db.from('malls').select('*')
 */
import { createClient } from '@supabase/supabase-js'

let admin: ReturnType<typeof createClient> | null = null

export function supabaseAdmin() {
  if (!admin) {
    const config = useRuntimeConfig()
    admin = createClient(
      config.public.supabaseUrl,
      config.supabaseServiceKey
    )
  }
  return admin
}
