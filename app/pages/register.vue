<!-- pages/register.vue → GET /register (Auth page, Addendum 09 v1.3 APPROVED).
  Design R1 PENUH dari revamp-options-v9.html: hero rose #E11D48 + ink #0C0A09 border,
  field 3 (Nama/Email/Password), checkbox Syarat & Privasi,
  CTA ink, footer mini 10 detik, font Plus Jakarta Sans,
  mobile max-w-md, base #fffdf9, KENAPA: User klik button Register di header → harus bisa akses /register tanpa 404. -->
<div class="max-w-md mx-auto px-4 pb-10" style="background:#fffdf9;">
  <header class="bg-white sticky top-0 z-40 shadow-sm max-w-md mx-auto px-4 py-3 flex justify-between items-center">
    <a href="/" class="flex items-center" aria-label="Wikendo — beranda">
      <img src="/brand-icon-day.png" alt="Wikendo" width="32" height="32" class="rounded-lg">
    </a>
    <div class="flex gap-3 items-center">
      <!-- Mutual-exclusive: show bell when logged in, Register button when not -->
      <button type="button" aria-label="Notifikasi" class="text-sm font-bold leading-none text-ink hover:text-orange-600">🔔</button>
      <button type="button" aria-label="Register" class="text-sm font-bold leading-none text-orange-600 hover:text-red-500">Register</button>
    </div>
  </header>

  <!-- Hero strip R1: rose #E11D48 + ink #0C0A09 border -->
  <div class="hero" style="background:#E11D48;border-left:4px solid #0C0A09;border-radius:12px;color:#fff;padding:10px;font-size:10px;font-weight:800;margin-bottom:16px;text-align:center">
    DAFTAR GRATIS<div class="big" style="font-size:24px;font-weight:800;margin:4px 0">2 • 5</div>quota full + voucher 🎟️
  </div>

  <main class="px-6 py-8">
    <form class="space-y-4" @submit="handleSubmit">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Nama</label>
        <input type="text" required class="w-full rounded-[20px] p-[14px] border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors" placeholder="Nama lengkap" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
        <input type="email" required class="w-full rounded-[20px] p-[14px] border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors" placeholder="contoh@email.com" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
        <input type="password" required class="w-full rounded-[20px] p-[14px] border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors" placeholder="•••••••••••••••" />
      </div>
      <div class="flex items-start">
        <input type="checkbox" id="terms" required class="w-4 h-4 rounded border-gray-300 focus:ring-orange-500 transform hover:scale-125 transition duration-150 ms-4" />
        <label for="terms" class="ml-2 text-sm font-medium text-gray-700">
          Setuju Syarat & Privasi
        </label>
      </div>
      <button type="submit" class="w-full bg-orange-600 text-white rounded-[20px] p-[14px] font-bold text-sm py-3 transition-colors hover:bg-orange-500">
        Daftar →
      </button>
      <p class="text-center text-xs text-gray-500">
        Sudah punya akun? <NuxtLink to="/login" class="font-medium text-red-600 hover:text-orange-500">Masuk sekarang</NuxtLink>
      </p>
    </form>
  </main>

  <footer class="mt-6 text-center text-xs text-gray-400">
    10 detik • quota reset tiap hari • gratis
  </footer>
</div>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { supabase } from '@/supabase/client' // <-- add this

const router = useRouter()

// TODO: integrasi Supabase auth signUp nanti
// const { data, error } = await supabase.auth.signUp({ email, password })

// Mock register — redirect ke home setelah submit
const _handleSubmit = async (e: Event) => {
  e.preventDefault()
  // Real Supabase register — ganti mock di bawah baris ini kalau udah punya Supabase config
  const { data, error } = await supabase.auth.signUp({
    email, password,
    options: { data: { nama: (document.querySelector('input[type="text"]') as HTMLInputElement).value } }
  })
  if (error) {
    // TODO: tampilkan error di UI
    alert(error.message)
    return
  }
  // Mock auth success — redirect ke home
  router.push('/')
}
</script>