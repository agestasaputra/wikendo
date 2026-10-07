<!-- pages/result.vue → GET /result (Result TEMPAT deck, mockup D kombo 5).
  APA: 1 hero deck fokus + Navigasi/Simpan/Share + mini-deck geser + quota note. Base #fffdf9, kartu 24px.
  KENAPA: fokus 1 hero → CTR Maps >50% (PRD §4). Lock Split: TEMPAT saja, 0 tenant. Simpan = login wall momen #2.
  Contoh: tap "Lainnya →" geser deck 1→5 tanpa fetch ulang. -->
<template>
  <div class="max-w-md mx-auto px-4 pb-10" style="background:#fffdf9">
    <div class="flex justify-between items-center font-bold text-[13px] py-3">
      <span>← Hasil buatmu 🎉</span>
      <span class="text-gray-500">Quota {{ quotaLabel }}</span>
    </div>

    <AppLoader v-if="pending" variant="tempat" />
    <div v-else-if="error" class="rounded-2xl p-4 text-sm font-bold" :style="isWall ? 'background:#fff7ed;border:2px solid #f97316;color:#9a3412' : 'background:#fef2f2;border:1px solid #fecaca;color:#991b1b'">
      <template v-if="isWall">🔒 Quota anon habis (1x/hari). Login 10 detik → quota jadi 2x/hari, gratis.<br><NuxtLink to="/" class="underline">Login / balik Home →</NuxtLink></template>
      <template v-else>{{ errorMessage }}<br><button class="underline mt-1" @click="refresh()">Coba lagi → (quota nggak kepotong)</button></template>
    </div>
    <div v-else-if="list.length" class="flex flex-col">
      <div class="bg-white overflow-hidden shadow-lg" style="border-radius:24px;border:1px solid #eee">
        <div class="h-[150px] flex items-center justify-center text-[56px]" :style="'background:' + hero.bg">{{ hero.emoji }}</div>
        <div class="p-[14px_16px]">
          <span class="inline-block text-[11px] font-extrabold px-2.5 py-1 rounded-full mr-1.5 mb-2" style="background:#fff7ed;color:#c2410c">★ #{{ idx + 1 }}{{ idx === 0 ? ' BEST' : '' }}</span>
          <span class="inline-block text-[11px] font-extrabold px-2.5 py-1 rounded-full mb-2" style="background:#ecfeff;color:#0e7490">🏛️ {{ hero.category }}</span>
          <div class="font-extrabold text-[17px]">{{ hero.name }}</div>
          <p class="text-[12.5px] text-gray-600 my-1.5">Kenapa cocok: {{ hero.reason }}</p>
          <p class="text-[12.5px]">💰 {{ hero.cost }} • 📍 {{ hero.area }} • ⏰ best {{ hero.time }}</p>
          <div class="flex gap-2.5 mt-3">
            <a :href="mapsUrl" target="_blank" class="flex-1 text-center text-white p-[15px] rounded-2xl font-extrabold text-sm" style="background:#18181b;min-height:56px">📍 Navigasi →</a>
            <button class="flex-1 p-[15px] rounded-2xl font-extrabold text-sm bg-white border-2 border-gray-200" title="Login untuk simpan (momen #2)" @click="wallNote = true">💾</button>
            <button class="flex-1 p-[15px] rounded-2xl font-extrabold text-sm bg-white border-2 border-gray-200" @click="share()">⤴</button>
          </div>
          <p v-if="wallNote" class="text-xs text-center mt-2" style="color:#c2410c">🔒 Login 10 detik untuk simpan — quota reset tiap hari, gratis.</p>
        </div>
      </div>
      <div class="flex gap-2 mt-3">
        <div v-for="(r, i) in minis" :key="i" class="flex-1 bg-white border border-gray-200 rounded-[14px] p-2.5 text-center text-xs font-bold text-gray-600">② {{ r }}</div>
        <div class="flex-1 rounded-[14px] p-2.5 text-center text-xs font-extrabold text-white cursor-pointer" style="background:#18181b" @click="next()">Lainnya →</div>
      </div>
      <p class="text-xs text-gray-500 mt-2.5 text-center">Kartu {{ idx + 1 }}/{{ list.length }} • generate ulang = quota habis • <u>lihat semua ↓</u></p>
      <div class="flex flex-col gap-2 mt-3">
        <div v-for="(r, i) in list" :key="i" class="bg-white rounded-2xl border p-4 text-sm">
          <b>#{{ i + 1 }} {{ r.name }}</b> <span class="text-gray-500">[{{ r.category }} • {{ r.location_area }}]</span>
          <p class="text-gray-600 text-[13px] mt-1">💡 {{ r.reason }} • 💰 {{ r.estimated_cost }} • ⏰ {{ r.best_time }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TempatRecommendation } from '~/types'
const route = useRoute()
const { data, pending, error, refresh } = await useFetch<{ recommendations: TempatRecommendation[], quota_remaining?: number }>('/api/tempat/recommend', {
  method: 'POST',
  body: route.query
})
const list = computed(() => data.value?.recommendations || [])
const idx = ref(0)
const wallNote = ref(false)
const errMsg = computed(() => (error.value as unknown as { data?: { message?: string }, message?: string })?.data?.message || (error.value as unknown as { message?: string })?.message || 'Gagal generate.')
const errorMessage = computed(() => String(errMsg.value))
const isWall = computed(() => /login/i.test(errorMessage.value) || (error.value as unknown as { statusCode?: number })?.statusCode === 403)
// Quota real: sisa dari response POST (quota_remaining). Anon limit tempat 1x → sukses = 0/1 (habis hari ini, jujur).
const quotaLeft = computed(() => data.value?.quota_remaining)
const quotaLabel = computed(() => isWall.value ? '1/1 habis 🔒' : (quotaLeft.value ?? 1) + '/1')
const hero = computed(() => {
  const r = list.value[idx.value] || ({} as TempatRecommendation)
  return { name: r.name || '—', category: r.category || 'tempat', reason: r.reason || '—', cost: (r as { estimated_cost?: string }).estimated_cost || '—', area: (r as { location_area?: string }).location_area || '—', time: (r as { best_time?: string }).best_time || '—', emoji: ['🏛️', '☕', '🌳', '🎡', '🌊'][idx.value % 5], bg: ['linear-gradient(140deg,#ffedd5,#fdba74)', 'linear-gradient(140deg,#fef3c7,#fcd34d)', 'linear-gradient(140deg,#dcfce7,#86efac)', 'linear-gradient(140deg,#e0e7ff,#a5b4fc)', 'linear-gradient(140deg,#cffafe,#67e8f9)'][idx.value % 5] }
})
const minis = computed(() => list.value.slice(1, 3).map(r => (r.name || '').slice(0, 10)))
const mapsUrl = computed(() => 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent((hero.value.name || '') + ' Jakarta'))
function next() { if (list.value.length) idx.value = (idx.value + 1) % list.value.length }
function share() {
  const t = hero.value.name + ' via Wikendo'
  if (navigator.share) navigator.share({ title: t, text: t, url: location.href }).catch(() => {})
  else { navigator.clipboard?.writeText(location.href); wallNote.value = true }
}
</script>
