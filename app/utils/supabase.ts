/**
 * utils/supabase.ts — Client Supabase BROWSER (anon key, aman ke browser).
 *
 * APA: singleton createClient pakai runtimeConfig.public (supabaseUrl + supabaseAnonKey).
 * KENAPA file ini ada: pages/login.vue butuh auth dari browser (signIn password,
 * Google OAuth, reset password). BEDA dengan server/utils/db.ts (service key,
 * server-only — JANGAN import dari pages, rahasia tidak boleh ke browser).
 * Contoh: const sb = supabaseBrowser(); await sb.auth.signInWithPassword({ email, password })
 */
import { createClient } from '@supabase/supabase-js'

let browser: ReturnType<typeof createClient> | null = null

export function supabaseBrowser() {
  if (!browser) {
    const config = useRuntimeConfig()
    browser = createClient(
      config.public.supabaseUrl as string,
      config.public.supabaseAnonKey as string
    )
  }
  return browser
}
