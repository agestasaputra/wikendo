<!-- pages/result-makan.vue → GET /result-makan (Result TENANT + voucher, mockup G kombo 15). -->
APA: deck best match + tombol Klaim voucher (F1b ticket-style dashed border + benefit −20% gede) + Maps tenant + quota makan.
KENAPA: voucher = umpan kuota 5/hari + bukti B2B ke mall (PRD §8). Klaim WAJIB login (anti-farming, API 401).
Contoh: anon tap Klaim → wall "Login 10 detik untuk klaim voucher". Lock: TENANT saja, 0 tempat wisata.
<template>
<div class="max-w-md mx-auto px-4 pb-10" style="background:#F5F5F4">
  <div class="flex justify-between items-center font-bold text-[13px] py-3">
    <span>← Hasil • {{ mallLabel }} 📍</span>
    <span class="text-gray-500">{{ quotaLabel }} tersisa</span>
  </div>

  <AppLoader v-if="pending" variant="makan" />
  <div v-else-if="error" class="rounded-2xl p-4 text-sm font-bold" :style="isWall ? {background:'#fff7ed',border:'2px solid #f97316',color:'#9a3412'} : {background:'#fef2f2',border:'1px solid #fecaca',color:'#991b1b'}">
    <template v-if="isWall">🔒 Quota makan anon habis (2x/hari). Login 10 detik → quota jadi 5x/hari, gratis.<br><NuxtLink to="/" class="underline">Login / balik Home →</NuxtLink></template>
    <template v-else>{{ errorMessage }}<br><button class="underline mt-1" @click="refresh()">Coba lagi → (quota nggak kepotong)</button></template>
  </div>
  <div v-else-if="list.length" class="flex flex-col">
    <!-- F1b ticket-style result: solid border di atas, dashed border di bawah, benefit −20% gede -->
    <div class="bg-white shadow-lg rounded-2xl overflow-hidden" style="border-top:4px solid #FECDD3;border-bottom:2px dashed #FECDD3">
      <div class="p-4">
        <div class="font-extrabold text-[16.5px]">🍜 {{ hero.name }} — {{ mallLabel }} L{{ hero.floor }}</div>
        <p class="text-[12.5px] text-gray-600 my-1.5">Kenapa: {{ hero.reason }}</p>
        <p class="text-[12.5px]">💰 {{ hero.price }} • {{ hero.kids }} • 📍 L{{ hero.floor }}</p>
        <!-- F1b ticket: benefit −20% gede -->
        <div class="mt-3 p-3 bg-gradient-to-r from-[#FFF7ED] to-[#FFE4E6]" style="border-radius:12px;border:2px solid #FECDD3;border-top:none">
          <span class="text-[12px] font-semibold text-[#EA580C]">−20% ahorro</span>
          <span class="text-[11px] ml-2 font-medium text-[#A3E635]">BEST</span>
        </div>
        <p v-if="claimed" class="text-xs text-center mt-2" style="color:#047857">🎟️ Voucher: {{ claimed }}</p>
        <p v-else-if="claimNote" class="text-xs text-center mt-2" style="color:#c2410c">{{ claimNote }}</p>
        <div class="flex gap-2.5 mt-3">
          <a :href="hero.maps" target="_blank" class="flex-1 text-center text-white p-[15px] rounded-2xl font-extrabold text-sm" style="background:#18181b">📍 Maps tenant →</a>
          <button class="flex-1 p-[15px] rounded-2xl font-extrabold text-sm bg-white border-2 border-gray-200" title="Login untuk simpan" @click="claimNote = '🔒 Login 10 detik untuk simpan — gratis.'">💾</button>
        </div>
        <p class="text-[11.5px] text-gray-500 mt-2 text-center"><u>Lapor tutup/buka</u> • <u>Share ke temen</u> • Quota makan {{ quotaLabel }} tersisa</p>
      </div>
    </div>
    <!-- end F1b -->

    <!-- V12 gift surprise: grad cream-rose + border pink + pill rose Buka (meta tested) -->
    <div class="rounded-[14px] p-3 flex gap-2 items-center mt-2.5" :style="{ background: vGift.bg, border: '1px solid ' + vGift.border }">
      <div class="text-[26px]">🎁</div>
      <div class="flex-1 text-[13px] font-bold">Ada <b>−20%</b> buat lu<br><small class="font-normal text-gray-500">{{ hero.name }} · {{ mallLabel }} L{{ hero.floor }} · hari ini</small></div>
      <button class="font-extrabold text-[13px] rounded-full px-[14px] py-2 cursor-pointer" :style="{ background: vGift.goBg, color: vGift.goColor }" @click="claim()">Buka →</button>
    </div>
    <p v-if="claimed" class="text-xs text-center mt-2" style="color:#047857">🎟️ Voucher: {{ claimed }}</p>
    <p v-else-if="claimNote" class="text-xs text-center mt-2" style="color:#c2410c">{{ claimNote }}</p>

    <div class="flex gap-2.5 mt-3">
      <a :href="hero.maps" target="_blank" class="flex-1 text-center text-white p-[15px] rounded-2xl font-extrabold text-sm" style="background:#18181b">📍 Maps tenant →</a>
      <button class="flex-1 p-[15px] rounded-2xl font-extrabold text-sm bg-white border-2 border-gray-200" title="Login untuk simpan" @click="claimNote = '🔒 Login 10 detik untuk simpan — gratis.'">💾</button>
    </div>
    <p class="text-[11.5px] text-gray-500 mt-2 text-center"><u>Lapor tutup/buka</u> • <u>Share ke temen</u> • Quota makan {{ quotaLabel }} tersisa</p>
  </div>
</div>
</template>

<script setup lang="ts">
import type { TenantRecommendation } from '~/types'
import { getMallShortLabel } from '~/utils/quiz-logic'
const route = useRoute()
const { data, pending, error, refresh } = await useFetch<{ recommendations: TenantRecommendation[], quota_remaining?: number }>('/api/makan/recommend', {
  method: 'POST',
  body: route.query
})
const list = computed(() => data.value?.recommendations || [])
const idx = ref(0)
const claimed = ref('')
const claimNote = ref('')
const errMsg = computed(() => (error.value as unknown as { data?: { message?: string }, message?: string })?.data?.message || (error.value as unknown as { message?: string })?.message || 'Gagal generate.')
const errorMessage = computed(() => String(errMsg.value))
const isWall = computed(() => /login/i.test(errorMessage.value) || (error.value as unknown as { statusCode?: number })?.statusCode === 403)
// Quota real: sisa dari response POST (quota_remaining). Anon limit makan 2x → "4/5" static yang lama itu bohong.
const quotaLeft = computed(() => data.value?.quota_remaining)
const quotaLabel = computed(() => isWall.value ? '0/2 habis 🔒' : (quotaLeft.value ?? 2) + '/2')
const mallSlug = computed(() => String(route.query.mall_slug || route.query.mall || ''))
const mallLabel = computed(() => (mallSlug.value ? getMallShortLabel(mallSlug.value) : 'Mall'))
// V12 gift surprise: meta grad cream-rose + pill rose (helper tested).
const vGift = getMallShortLabel('gift')
const hero = computed(() => {
  const r = list.value[idx.value] || ({} as TenantRecommendation)
  return { name: r.name || '—', reason: r.reason || '—', price: r.price_range || '—', floor: (r as { lantai?: string }).lantai || '?', halal: (r as { halal?: boolean | null }).halal ?? null, kids: (r as { kids_friendly?: boolean }).kids_friendly ? '👶 kids' : '—', maps: r.maps_url || '#' }
})
// F1b ticket-based claim design: solid border atas, dashed bawah, benefit −20% gede
async function claim() {
  claimNote.value = '🔒 Login 10 detik untuk klaim voucher — anti-farming, gratis.'
}
</script>