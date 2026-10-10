/**
 * composables/useAuth.ts — Session sumber kebenaran auth-state-home (Addendum 22 AS6 wallet-card APPROVED).
 *
 * APA: baca session Supabase pas load (getSession) + dengar perubahan (onAuthStateChange),
 * expose isLoggedIn/email/displayName/initial/signOut ke header + home.
 * KENAPA file ini ada: header pakai `v-if="!isLoggedIn"` tapi NOL sumber session (hantu, undefined
 * terus) + sapaan hardcode + NOL logout → login nol rasanya. 1 composable = 1 kebenaran dipakai
 * app.vue + index.vue, tanpa foto Google, tanpa /profile full, tanpa quota-server (ikut Addendum 22).
 * Contoh: const { isLoggedIn, displayName, signOut } = useAuth()
 */
import { supabaseBrowser } from '~/utils/supabase'

interface AuthUser {
  email?: string | null
  user_metadata?: Record<string, unknown>
}

export function useAuth() {
  const isLoggedIn = useState<boolean>('auth-is-logged-in', () => false)
  const email = useState<string>('auth-email', () => '')
  const displayName = useState<string>('auth-display-name', () => '')

  function applyUser(user: AuthUser | null) {
    if (!user) {
      isLoggedIn.value = false
      email.value = ''
      displayName.value = ''
      return
    }
    const mail = user.email ?? ''
    email.value = mail
    isLoggedIn.value = true
    const meta = user.user_metadata ?? {}
    const full = (meta.full_name as string) || (meta.name as string) || ''
    const first = full.trim().split(/\s+/)[0] || ''
    if (first) {
      displayName.value = first.charAt(0).toUpperCase() + first.slice(1)
    } else {
      // fallback prefix email: siskadptr@gmail.com → Siskadptr
      const prefix = mail.split('@')[0] || 'Teman'
      displayName.value = prefix.charAt(0).toUpperCase() + prefix.slice(1)
    }
  }

  async function refresh() {
    try {
      const sb = supabaseBrowser()
      const { data } = await sb.auth.getSession()
      applyUser(data.session?.user ?? null)
    } catch {
      // offline / SSR tanpa session → tetap anon, jangan crash
    }
  }

  // Load session pas composable dipakai + dengar perubahan auth.
  // NOTE: getSession + onAuthStateChange wajib ada (dikunci test auth-state-home).
  if (typeof window !== 'undefined') {
    void refresh()
    try {
      const sb = supabaseBrowser()
      sb.auth.onAuthStateChange((_event, session) => {
        applyUser(session?.user ?? null)
      })
    } catch {
      // abaikan — anon tetap jalan
    }
  }

  async function signOut() {
    try {
      const sb = supabaseBrowser()
      await sb.auth.signOut()
    } finally {
      isLoggedIn.value = false
      email.value = ''
      displayName.value = ''
    }
  }

  const initial = computed(() => (displayName.value || email.value || '?').charAt(0).toUpperCase())

  return { isLoggedIn, email, displayName, initial, refresh, signOut }
}
