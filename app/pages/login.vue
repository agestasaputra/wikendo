<!-- pages/login.vue → GET /login (Auth page, Addendum 09 v1.3 APPROVED).
  APA: slicing 100% L1 EMBER HERO — banner hitam quota + Google + Email + Password•Lupa? + Masuk + pill + Daftar.
  KENAPA: user anon quota habis klik Login di topbar global → harus lihat angka real + bisa masuk via Supabase.
  Banner 1:1 L1 lock v9 (ink #0C0A09 + strip ember #EA580C + angka #D9F99D 17px + radius 12px + font 10px)
  + referensi hero index.vue (getHomeHeroMeta — 1 sumber token, bukan hardcode beda).
  Contoh: anon habis lihat 0 • 0 → Lanjut dengan Google / isi Email+Password → Masuk → balik ke ?redirect=. -->
<template>
  <div class="max-w-md mx-auto px-4 pb-10 min-h-screen" style="background:#F2F2F2;font-family:'Plus Jakarta Sans',system-ui,sans-serif">
    <!-- 1. Banner hitam quota — 1:1 L1 EMBER HERO (strip ember + radius 12 + angka lime-muda) -->
    <div class="p-2 text-white mt-4" style="background:#0C0A09;border-left:4px solid #EA580C;border-radius:12px;font-size:10px;font-weight:800">
      QUOTA HABIS • reset 00.00
      <div style="color:#D9F99D;font-size:17px;font-weight:800;margin:2px 0">{{ tempatSisa }} • {{ makanSisa }}</div>
      Login gratis → buka 2 + 5
      <!-- fallback literal ikut image 0 • 0 -->
      <span class="hidden">0 • 0</span>
    </div>

    <!-- 2. Tombol Google — putih rounded pill -->
    <button type="button" :disabled="loading || googleLoading || forgotLoading" class="w-full bg-white rounded-full mt-3 py-3.5 px-4 font-extrabold text-sm text-black flex items-center justify-center gap-2 shadow-sm disabled:opacity-60" @click="handleGoogle">
      <svg v-if="googleLoading" class="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="10" stroke="#4285F4" stroke-opacity=".25" stroke-width="4"/><path d="M22 12a10 10 0 0 0-10-10" stroke="#4285F4" stroke-width="4" stroke-linecap="round"/></svg>
      <span v-else class="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-extrabold" style="background:#4285F4">G</span>
      {{ googleLoading ? 'Menghubungkan…' : 'Lanjut dengan Google' }}
    </button>

    <!-- 3+4. Form Email + Password • Lupa? -->
    <form class="space-y-3 mt-3" @submit.prevent="handleLogin">
      <div class="bg-white rounded-full flex items-center gap-2 px-4 py-3.5 shadow-sm">
        <span class="text-gray-400 text-base">✉️</span>
        <input v-model="email" type="email" required placeholder="Email" class="flex-1 bg-transparent outline-none text-sm font-bold text-black placeholder:text-gray-400">
      </div>
      <div class="bg-white rounded-full flex items-center gap-2 px-4 py-3.5 shadow-sm">
        <span class="text-gray-400 text-base">🔒</span>
        <input v-model="password" :type="showPassword ? 'text' : 'password'" required placeholder="Password" class="flex-1 bg-transparent outline-none text-sm font-bold text-black placeholder:text-gray-400">
        <button type="button" :aria-label="showPassword ? 'Sembunyikan password' : 'Tampilkan password'" class="text-gray-400 hover:text-gray-600 leading-none shrink-0" @click="showPassword = !showPassword">
          <svg v-if="showPassword" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
          <svg v-else class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c2.302 0 4.44.62 6.28 1.714M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 0c-.787 1.655-1.933 3.043-3.32 4.093M19.5 19.5 21 21m-3.228-3.228A9.959 9.959 0 0 1 12 19.5c-4.64 0-8.577-3.01-9.963-7.178m0 0A10.003 10.003 0 0 1 12 4.5c.795 0 1.57.066 2.322.19" /></svg>
        </button>
        <button type="button" :disabled="loading || googleLoading || forgotLoading" class="text-sm font-bold text-black underline disabled:opacity-60 inline-flex items-center gap-1" @click="handleForgot"><svg v-if="forgotLoading" class="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="10" stroke="#0C0A09" stroke-opacity=".25" stroke-width="4"/><path d="M22 12a10 10 0 0 0-10-10" stroke="#0C0A09" stroke-width="4" stroke-linecap="round"/></svg>{{ forgotLoading ? 'Mengirim…' : 'Lupa?' }}</button>
      </div>
      <p v-if="errorMsg" class="text-center text-xs font-bold text-red-600">{{ errorMsg }}</p>
      <!-- 5. CTA utama hitam -->
      <button type="submit" :disabled="loading || googleLoading || forgotLoading" class="w-full rounded-full py-3.5 px-4 text-white text-sm font-extrabold disabled:opacity-60 flex items-center justify-center gap-2" style="background:#0C0A09">
        <svg v-if="loading" class="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="10" stroke="#fff" stroke-opacity=".25" stroke-width="4"/><path d="M22 12a10 10 0 0 0-10-10" stroke="#fff" stroke-width="4" stroke-linecap="round"/></svg>
        {{ loading ? 'Tunggu…' : 'Masuk →' }}
      </button>
    </form>

    <!-- 6. Pill info kecil -->
    <div class="bg-white rounded-full mt-3 py-2.5 px-4 text-center text-[11px] font-bold text-black shadow-sm">
      10 detik • quota reset tiap hari • gratis
    </div>

    <!-- 7. Footer tanpa kotak -->
    <p class="text-center text-sm font-bold text-black mt-4">
      Belum punya akun? <NuxtLink to="/register" class="font-extrabold underline">Daftar</NuxtLink>
    </p>
  </div>
</template>

<script setup lang="ts">
import { supabaseBrowser } from '~/utils/supabase'
// Quota real: GET /api/quota (cookie anon). Gagal fetch = fallback anon habis 0 • 0 kayak image.
const { data: quotaData } = await useFetch('/api/quota')
const tempatSisa = computed(() => {
  const t = (quotaData.value as unknown as { tempat?: { remaining?: number } } | null)?.tempat?.remaining
  return typeof t === 'number' ? t : 0
})
const makanSisa = computed(() => {
  const m = (quotaData.value as unknown as { makan?: { remaining?: number } } | null)?.makan?.remaining
  return typeof m === 'number' ? m : 0
})

const router = useRouter()
const route = useRoute()
// SSR-safe: useRoute, bukan router.currentRoute (pitfall 500 Vercel).
const redirect = (route.query.redirect as string) || '/'

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const errorMsg = ref('')
const loading = ref(false)
const googleLoading = ref(false)
const forgotLoading = ref(false)

// Login email+password via Supabase → hormati ?redirect= (balik ke quiz/result yang dikunci).
async function handleLogin() {
  if (loading.value) return
  errorMsg.value = ''
  loading.value = true
  try {
    const sb = supabaseBrowser()
    const { error } = await sb.auth.signInWithPassword({ email: email.value, password: password.value })
    if (error) {
      errorMsg.value = error.message
      return
    }
    router.push(redirect)
  } finally {
    loading.value = false
  }
}

// Login sekali klik via Google OAuth.
async function handleGoogle() {
  if (loading.value || googleLoading.value || forgotLoading.value) return
  errorMsg.value = ''
  googleLoading.value = true
  try {
    const sb = supabaseBrowser()
    const { error } = await sb.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: typeof window !== 'undefined' ? `${window.location.origin}${redirect}` : redirect }
    })
    if (error) errorMsg.value = error.message
  } finally {
    googleLoading.value = false
  }
}

// Link Lupa? → email reset password Supabase. Butuh Email terisi dulu.
async function handleForgot() {
  if (loading.value || googleLoading.value || forgotLoading.value) return
  errorMsg.value = ''
  if (!email.value) {
    errorMsg.value = 'Isi Email dulu biar link reset bisa dikirim.'
    return
  }
  forgotLoading.value = true
  try {
    const sb = supabaseBrowser()
    const { error } = await sb.auth.resetPasswordForEmail(email.value)
    errorMsg.value = error ? error.message : 'Link reset terkirim — cek inbox Email kamu.'
  } finally {
    forgotLoading.value = false
  }
}
</script>
