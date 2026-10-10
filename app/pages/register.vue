<!-- pages/register.vue → GET /register (Auth page, Addendum 09 v1.3 APPROVED).
  APA: slicing 100% image img_19a0ea1cfdcf — banner hitam DAFTAR GRATIS 2•5 + Daftar via Google + Email + Password•kuat? + checkbox + Daftar →.
  KENAPA: user klik Register di topbar global → lihat benefit quota full + bisa daftar via Supabase (email atau Google 1-klik).
  Banner 1:1 R1 lock v9 (ink #0C0A09 + strip ember #EA580C + angka #D9F99D 17px + radius 12px + font 10px kiri).
  TAKEOUT 10 Okt 2026 (request Agesta): field Nama dihapus — user hanya isi Email + Password.
  Contoh: anon lihat 2 • 5 → Daftar via Google / isi Email+Password → Daftar → home. -->
<template>
  <div class="max-w-md mx-auto px-4 pb-10 min-h-screen" style="background:#F5F5F4;font-family:'Plus Jakarta Sans',system-ui,sans-serif">
    <!-- 1. Banner hitam promo — 1:1 image (strip ember + radius 12 + angka lime-muda) -->
    <div class="p-2 text-white mt-4" style="background:#0C0A09;border-left:4px solid #EA580C;border-radius:12px;font-size:10px;font-weight:800">
      DAFTAR GRATIS
      <div style="color:#D9F99D;font-size:17px;font-weight:800;margin:2px 0">2 • 5</div>
      quota full + voucher 🎟️
    </div>

    <!-- 2. Tombol Google — putih rounded pill -->
    <button type="button" :disabled="loading || googleLoading" class="w-full bg-white rounded-full mt-3 py-3.5 px-4 font-extrabold text-sm text-black flex items-center justify-center gap-2 shadow-sm disabled:opacity-60" @click="handleGoogle">
      <svg v-if="googleLoading" class="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="10" stroke="#4285F4" stroke-opacity=".25" stroke-width="4"/><path d="M22 12a10 10 0 0 0-10-10" stroke="#4285F4" stroke-width="4" stroke-linecap="round"/></svg>
      <span v-else class="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-extrabold" style="background:#4285F4">G</span>
      {{ googleLoading ? 'Menghubungkan…' : 'Daftar via Google' }}
    </button>

    <!-- 3+4. Form Email + Password + meter kuat? (Nama di-takeout 10 Okt 2026) -->
    <form class="space-y-3 mt-3" @submit.prevent="handleRegister">
      <div class="bg-white rounded-full flex items-center gap-2 px-4 py-3.5 shadow-sm">
        <span class="text-gray-400 text-base">✉️</span>
        <input v-model="email" type="email" required placeholder="Email" class="flex-1 bg-transparent outline-none text-sm font-bold text-black placeholder:text-gray-400">
      </div>
      <div class="bg-white rounded-full flex items-center gap-2 px-4 py-3.5 shadow-sm">
        <span class="text-gray-400 text-base">🔒</span>
        <input v-model="password" type="password" required placeholder="Password" class="flex-1 bg-transparent outline-none text-sm font-bold text-black placeholder:text-gray-400">
        <span class="text-gray-300 text-sm">•</span>
        <span class="flex gap-0.5" aria-hidden="true">
          <span v-for="i in 5" :key="i" class="inline-block w-2 h-2 rounded-[2px]" :style="{ background: i <= strength ? '#4B5563' : '#E5E7EB' }"></span>
        </span>
        <span class="text-[11px] font-bold text-gray-400">kuat?</span>
      </div>
      <div class="flex items-center gap-2 px-1">
        <input v-model="agree" type="checkbox" id="terms" required checked class="w-4 h-4 rounded border-gray-300">
        <label for="terms" class="text-xs font-bold text-black">
          Setuju Syarat & Privasi
        </label>
      </div>
      <p v-if="errorMsg" class="text-center text-xs font-bold text-red-600">{{ errorMsg }}</p>
      <!-- 6. CTA utama hitam -->
      <button type="submit" :disabled="loading || googleLoading" class="w-full rounded-full py-3.5 px-4 text-white text-sm font-extrabold disabled:opacity-60 flex items-center justify-center gap-2" style="background:#0C0A09">
        <svg v-if="loading" class="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="10" stroke="#fff" stroke-opacity=".25" stroke-width="4"/><path d="M22 12a10 10 0 0 0-10-10" stroke="#fff" stroke-width="4" stroke-linecap="round"/></svg>
        {{ loading ? 'Tunggu…' : 'Daftar →' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { supabaseBrowser } from '~/utils/supabase'

const router = useRouter()

const email = ref('')
const password = ref('')
const agree = ref(true)
const errorMsg = ref('')
const loading = ref(false)
const googleLoading = ref(false)

// Meter kuat? 0-5 ikut panjang + variasi huruf/angka — visual ikut image (4/5 solid contoh).
const strength = computed(() => {
  const p = password.value
  let s = 0
  if (p.length >= 4) s += 1
  if (p.length >= 6) s += 1
  if (p.length >= 8) s += 1
  if (/[A-Z]/.test(p) && /[a-z]/.test(p)) s += 1
  if (/\d/.test(p) && /[^A-Za-z0-9]/.test(p)) s += 1
  return Math.min(5, s)
})

// Daftar email+password via Supabase signUp → /check-email (Opsi B magic-link, lock 10 Okt 2026).
// Link verifikasi di inbox balik ke HOME (/). Google OAuth tetap langsung (tanpa cek-email).
async function handleRegister() {
  if (loading.value) return
  errorMsg.value = ''
  loading.value = true
  try {
    const sb = supabaseBrowser()
    const { error } = await sb.auth.signUp({
      email: email.value,
      password: password.value,
      options: {
        emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/` : '/'
      }
    })
    if (error) {
      errorMsg.value = error.message
      return
    }
    router.push({ path: '/check-email', query: { email: email.value } })
  } finally {
    loading.value = false
  }
}

// Daftar 1-klik via Google OAuth.
async function handleGoogle() {
  if (loading.value || googleLoading.value) return
  errorMsg.value = ''
  googleLoading.value = true
  try {
    const sb = supabaseBrowser()
    const { error } = await sb.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/` : '/' }
    })
    if (error) errorMsg.value = error.message
  } finally {
    googleLoading.value = false
  }
}
</script>
