<!-- pages/login.vue → GET /login (Auth page, Addendum 09 v1.3 APPROVED) -->
<APA: 1 halaman formulir login + tombol Continue, base #fffdf9 + font Plus Jakarta Sans.>
<KENAPA: User blum login klik button Login di header → harus bisa akses /login tanpa 404.>

<template>
  <div class="max-w-md mx-auto px-4 pb-10 min-h-[80vh] flex flex-col" style="background:#F5F5F4">
    <div class="flex justify-between items-center font-bold text-[13px] py-3">
      <NuxtLink to="/" class="text-ink">← Kembali ke Wikendo</NuxtLink>
    </div>

    <div class="px-6 py-8">
      <h2 class="text-2xl font-bold text-ink mb-4">Selamat Datang</h2>

      <p class="text-gray-600 text-sm mb-6">Masuk akun kamu untuk melanjutkan</p>

      <form class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input type="email" required class="w-full rounded-[20px] p-[14px] border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors" placeholder="contoh@email.com" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
          <input type="password" required class="w-full rounded-[20px] p-[14px] border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors" placeholder"•••••••••••••••" />
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
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()

// Simpan redirect URL dari query agar bisa kembali ke halaman yang diminta
const redirect = router.currentRoute.query.redirect || '/'

// TODO: integrasi Supabase auth signInWithPassword nanti
// const { data, error } = await supabase.auth.signInWithPassword({ email, password })

// Mock login — redirect ke home setelah submit
const handleSubmit = (e: Event) => {
  e.preventDefault()
  // Mock auth success — redirect ke home
  router.push('/')
}
</script>