<!-- pages/index.vue → GET / (Home Superapp, mockup A kombo 5+10+15, Addendum 09 v1.3). -->
APA: wallet quota 2-state + 2 CTA gede (Tempat/Makan) + grid Event/Promo/Wishlist/Riwayat + banner hype + riwayat.
KENAPA: tugas home cuma 1 — dorong landing→quiz >40% (PRD §4). 2 entry kelihatan duluan, wallet bikin scarcity jujur.
Contoh: quota real di-wire ke GET /api/quota (endpoint server/api/quota.get.ts); loading = skeleton, error = fallback 1 • 2.
<template>
<div class="max-w-md mx-auto px-4 pb-10">
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
    <NuxtLink to="/makan" class="rounded-[20px] p-[18px_12px] font-extrabold text-sm text-center text-white leading-snug shadow-lg" style="background:#ee2c4b;box-shadow:0 10px 20px -8px rgba(238,44,75,.6);min-height:56px">
      🍜<br>Cari Makan<br><small class="font-normal">quiz 20 dtk</small>
    </NuxtLink>
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