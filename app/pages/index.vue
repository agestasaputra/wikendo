<!-- pages/index.vue → GET / (Home Superapp, mockup A kombo 5+10+15, Addendum 09 v1.3). -->
APA: wallet quota 2-state + 2 CTA gede (Tempat/Makan) + grid Event/Promo/Wishlist/Riwayat + banner hype + riwayat.
KENAPA: tugas home cuma 1 — dorong landing→quiz >40% (PRD §4). 2 entry kelihatan duluan, wallet bikin scarcity jujur.
Contoh: quota real di-wire ke GET /api/quota (endpoint server/api/quota.get.ts); loading = skeleton, error = fallback 1 • 2.
<template>
<div class="max-w-md mx-auto px-4 pb-10" style="background:#F5F5F4">
  <!-- Header ink #0C0A09 + border-left ember #EA580C p1 ⭐ -->
  <div class="rounded-[20px] p-4 text-white relative overflow-hidden bg-gradient-to-br from-[#0e7490] to-[#164e63]">
    <div class="border-l-5 border-[#EA580C] pt-2" style="position:relative">
      <div class="flex justify-between items-center font-bold text-sm py-3">
        <span>Halo, teman Wikendo 👋</span>
        <span>🔔</span>
      </div>

      <!-- Wallet quota 2-state: jujur ikut GET /api/quota (anon 1 • 2, register 2 • 5). Habis semua = momen login CTA. -->
      <div class="mt-3 flex gap-2">
        <span class="flex-1 bg-white/15 rounded-xl p-2 text-center text-xs font-bold">🗺️ {{ quotaPending ? '…' : wallet.tempatChip }}</span>
        <span class="flex-1 bg-white/15 rounded-xl p-2 text-center text-xs font-bold">🍜 {{ quotaPending ? '…' : wallet.makanChip }}</span>
      </div>
      <NuxtLink v-if="!quotaPending && !quotaError && wallet.exhausted" to="/quiz" class="block text-center text-xs font-extrabold mt-2.5 underline">🔒 Quota habis — Login gratis → buka 2 tempat + 5 makan/hari</NuxtLink>
    </div>
  </div>

  <!-- 2 CTA gede — thumb-zone min 56px -->
  <div class="grid grid-cols-2 gap-2.5 my-3.5">
    <NuxtLink to="/quiz" class="rounded-[20px] p-[18px_12px] font-extrabold text-sm text-center text-white leading-snug shadow-lg" style="background:#f97316;box-shadow:0 10px 20px -8px rgba(249,115,22,.6);min-height:56px">
      🗺️<br>Cari Tempat<br><small class="font-normal">quiz 30 dtk</small>
    </NuxtLink>
    <NuxtLink to="/makan" class="rounded-[20x] p-[18px_12px] font-extrabold text-sm text-center text-white leading-snug shadow-lg" style="background:#ee2c4b;box-shadow:0 10px 20px -8px rgba(238,44,75,.6);min-height:56px">
      🍜<br>Cari Makan<br><small class="font-normal">quiz 20 dtk</small>
    </NuxtLink>
  </div>

  <!-- Grid Event/Promo/Wishlist/Riwayat -->
  <div class="grid grid-cols-2 gap-4 mt-4">
    <div class="rounded-2xl p-4 bg-white shadow-sm" style="border:1.5px solid #ece7dd">
      <h3 class="font-bold text-[13px] mb-2">🎲 Event</h3>
      <p class="text-sm text-gray-600">Quiz mingguan dengan hadiah mingguan</p>
    </div>
    <div class="rounded-2xl p-4 bg-white shadow-sm" style="border:1.5px solid #ece7dd">
      <h3 class="font-bold text-[13px] mb-2">⏱️ Promo</h3>
      <p class="text-sm text-gray-600">Voucher harian −20% ke 50%</p>
    </div>
    <div class="rounded-2xl p-4 bg-white shadow-sm" style="border:1.5px solid #ece7dd">
      <h3 class="font-bold text-[13px] mb-2">❤️ Wishlist</h3>
      <p class="text-sm text-gray-600">Simpan favorit tenant & tempat</p>
    </div>
    <div class="rounded-2xl p-4 bg-white shadow-sm" style="border:1.5px solid #ece7dd">
      <h3 class="font-bold text-[13px] mb-2">📜 Riwayat</h3>
      <p class="text-sm text-gray-600">Riwayat quiz & hasil minggu ini</p>
    </div>
  </div>

  <!-- Banner hype -->
  <div class="mt-4 rounded-2xl p-4 bg-gradient-to-br from-[#FAF1E8] to-[#F5F5F4] border border-gray-100">
    <div class="flex items-center justify-between">
      <div>
        <p class="font-bold text-[13px]">🔥 Minggu ini panas!</p>
        <p class="text-sm text-gray-600">5 rekomendasi terfavorit minggu ini</p>
      </div>
      <NuxtLink to="/quiz" class="font-extrabold text-sm text-[#EA580C]">Lihat Semua →</NuxtLink>
    </div>
  </div>

  <!-- Riwayat singkat -->
  <div class="mt-4 text-sm text-gray-500">
    <p>⭐ Minggu lalu: 3.4/5 rata-rata — 2.107 pengguna</p>
    <p>🏆 Top place: Rooftop Senayan (4.8★)</p>
    <p>🍜 Top makan: Kopi Kekinian (4.9★, −20%)</p>
  </div>
</div>
</template>

<script setup lang="ts">
import type { QuotaStatus } from '~/types'
import { buildQuotaStatus, buildWalletLabel } from '~/utils/quiz-logic'
// SEO Home: GEO-friendly (og + description ID). Direktori /mall/:slug nyusul slice-4.
useHead({
  title: 'Wikendo — Bingung Weekend Mau Kemana?',
  meta: [
    { name: 'description', content: 'Quiz 30 detik → 5 rekomendasi tempat weekend. Quiz 20 detik → 5 tenant mall + voucher. Gratis, quota reset tiap hari.' },
    { property: 'og:title', content: 'Wikendo — Bingung Weekend Mau Kemana?' },
    { property: 'og:description', content: 'Quiz 30 detik → 5 rekomendasi tempat. Quiz makan → 5 tenant + voucher. Gratis.' }
  ]
})
// Quota real: GET /api/quota (cookie anon). Gagal fetch = fallback anon fresh (1 • 2), bukan angka bohong register.
const { data: quotaData, pending: quotaPending, error: quotaError } = await useFetch<QuotaStatus>('/api/quota')
const quotaStatus = computed(() => quotaData.value || buildQuotaStatus({ tempatUsed: 0, makanUsed: 0, isLoggedIn: false }))
const wallet = computed(() => buildWalletLabel(quotaStatus.value))
</script>