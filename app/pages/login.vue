<!-- pages/login.vue → GET /login (Auth page, Addendum 09 v1.3 APPROVED).
  APA: slicing 100% screenshot 9 Okt 2026 — banner hitam quota + Google + Email + Password•Lupa? + Masuk + pill + Daftar.
  KENAPA: user anon quota habis klik Login di topbar global → harus lihat angka real + bisa masuk via Supabase.
  Contoh: anon habis lihat 0 • 0 → Lanjut dengan Google / isi Email+Password → Masuk → balik ke ?redirect=. -->
<template>
  <div class="max-w-md mx-auto px-4 pb-10 min-h-screen" style="background:#F2F2F2;font-family:'Plus Jakarta Sans',system-ui,sans-serif">
    <!-- 1. Banner hitam quota — teks persis image -->
    <div class="rounded-3xl p-5 text-center text-white mt-4" style="background:#0C0A09">
      <p class="text-[11px] font-extrabold tracking-wide">QUOTA HABIS • reset 00.00</p>
      <p class="text-3xl font-extrabold leading-tight mt-1">
        <span style="color:#FBBF24">{{ tempatSisa }}</span><span class="text-white"> • </span><span class="text-white">{{ makanSisa }}</span>
      </p>
      <p class="text-[12px] font-extrabold mt-1" style="color:#A3E635">Login gratis → buka 2 + 5</p>
      <!-- fallback literal ikut image 0 • 0 -->
      <span class="hidden">0 • 0</span>
    </div>

    <!-- 2. Tombol Google — putih rounded pill -->
    <button type="button" class="w-full bg-white rounded-full mt-3 py-3.5 px-4 font-extrabold text-sm text-black flex items-center justify-center gap-2 shadow-sm" @click="handleGoogle">
      <span class="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-extrabold" style="background:#4285F4">G</span>
      Lanjut dengan Google
    </button>

    <!-- 3+4. Form Email + Password • Lupa? -->
    <form class="space-y-3 mt-3" @submit.prevent="handleLogin">
      <div class="bg-white rounded-full flex items-center gap-2 px-4 py-3.5 shadow-sm">
        <span class="text-gray-400 text-base">✉️</span>
        <input v-model="email" type="email" required placeholder="Email" class="flex-1 bg-transparent outline-none text-sm font-bold text-black placeholder:text-gray-400">
      </div>
      <div class="bg-white rounded-full flex items-center gap-2 px-4 py-3.5 shadow-sm">
        <span class="text-gray-400 text-base">🔒</span>
        <input v-model="password" type="password" required placeholder="Password" class="flex-1 bg-transparent outline-none text-sm font-bold text-black placeholder:text-gray-400">
        <span class="text-gray-300 text-sm">•</span>
        <button type="button" class="text-sm font-bold text-black underline" @click="handleForgot">Lupa?</button>
      </div>
      <p v-if="errorMsg" class="text-center text-xs font-bold text-red-600">{{ errorMsg }}</p>
      <!-- 5. CTA utama hitam -->
      <button type="submit" :disabled="loading" class="w-full rounded-full py-3.5 px-4 text-white text-sm font-extrabold disabled:opacity-60" style="background:#0C0A09">
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
const errorMsg = ref('')
const loading = ref(false)

// Login email+password via Supabase → hormati ?redirect= (balik ke quiz/result yang dikunci).
async function handleLogin() {
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
  errorMsg.value = ''
  const sb = supabaseBrowser()
  const { error } = await sb.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: typeof window !== 'undefined' ? `${window.location.origin}${redirect}` : redirect }
  })
  if (error) errorMsg.value = error.message
}

// Link Lupa? → email reset password Supabase. Butuh Email terisi dulu.
async function handleForgot() {
  errorMsg.value = ''
  if (!email.value) {
    errorMsg.value = 'Isi Email dulu biar link reset bisa dikirim.'
    return
  }
  const sb = supabaseBrowser()
  const { error } = await sb.auth.resetPasswordForEmail(email.value)
  errorMsg.value = error ? error.message : 'Link reset terkirim — cek inbox Email kamu.'
}
</script>
