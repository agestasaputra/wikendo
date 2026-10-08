<!-- pages/login.vue → GET /login (Auth page, Addendum 09 v1.3 APPROVED).
  Design L1-inspired: hero ink #0C0A09 + ember #EA580C strip + lime #A3E635 CTA,
  quota info 1:1 screen, font Plus Jakarta Sans, mobile max-w-md.
  KENAPA: User blum login klik button Login di header → harus bisa akses /login tanpa 404. -->
<h1 class="text-2xl font-bold text-ink mb-4">Selamat Datang</h1>
<div class="hero" style="background:#0C0A09;border-left:4px solid #EA580C;border-radius:12px;color:#fff;padding:8px;font-size:10px;font-weight:800;margin-bottom:12px">
  QUOTA HABIS • reset 00.00<div class="big">0 • 0</div>Login gratis → buka 2 + 5
</div>
<div class="px-6 py-8">
  <form class="space-y-4" @submit="handleSubmit">
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
      <input type="email" required class="w-full rounded-[20px] p-[14px] border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors" placeholder="contoh@email.com" />
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
      <input type="password" required class="w-full rounded-[20px] p-[14px] border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors" placeholder="•••••••••••••••" />
    </div>
    <button type="submit" class="w-full bg-orange-600 text-white rounded-[20px] p-[14px] font-bold text-sm py-3 transition-colors hover:bg-orange-500">
      Masuk
    </button>
    <p class="text-center text-xs text-gray-500">
      Belum punya akun? <NuxtLink to="/register" class="font-medium text-orange-600 hover:text-red-500">Daftar sekarang</NuxtLink>
    </p>
  </form>
</div>
<div class="mt-6 text-center text-xs text-gray-400">
  © 2026 Wikendo MVP • Nuxt 4 + Supabase + Hermes-combo
</div>
</template>
<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()

// Simpan redirect URL dari query agar bisa kembali ke halaman yang diminta
const redirect = (route.query.redirect as string) || '/'

// TODO: integrasi Supabase auth signInWithPassword nanti
// const { data, error } = await supabase.auth.signInWithPassword({ email, password })

// Mock login — redirect ke home atau URL yang diminta
const _handleSubmit = (e: Event) => {
  e.preventDefault()
  // Mock auth success — redirect ke home
  router.push(redirect)
}
</script>