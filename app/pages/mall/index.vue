<!-- pages/mall/index.vue → GET /mall (Index direktori hub, D1 Mall Hub Netral ⭐). -->
APA: list 5 kartu mall (nama + area + jumlah tenant) + 2 CTA per kartu (Lihat Tenant / Cariin yang cocok), label mall INK (#0C0A09), CTA "Cariin" rose (#E11D48), bg paper (#F5F5F4).
KENAPA: D1 "Mall Hub · Netral" — netral layout paling murah dieksekusi, SEO tetap (struktur /mall/:slug), discoverability naik karena tombol aksi rose. Risiko rendah (token udah lock), CTR naik karena warna aksen jelas. Token lock: ink tetap #0C0A09, rose tetap #E11D48, paper tetap #F5F5F4.
<template>
<div class="max-w-md mx-auto px-4 pb-10" style="background:#F5F5F4">
  <p class="text-xs text-gray-500 pt-3 mb-1">Home / Mall</p>
  <div class="flex justify-between items-center">
    <h1 class="text-xl font-extrabold">🏬 Mall</h1>
    <span class="text-xs font-bold text-gray-500">{{ malls.length }} mall</span>
  </div>

  <p class="text-[13px] text-gray-500">Pilih mall → direktori tenant curated • tanpa login/quota/LLM</p>

  <AppLoader v-if="pending" variant="mall" />
  <div v-else-if="error" class="rounded-2xl p-4 text-sm font-bold mt-3" style="background:#fef2f2;border:1px solid #fecaca;color:#991b1b">
    Gagal muat mall.<br><button class="underline mt-1" @click="refresh()">Coba lagi →</button>
  </div>
  <div v-else class="flex flex-col gap-2.5 mt-3">
    <div v-for="m in malls" :key="m.slug" class="bg-white rounded-2xl border border-gray-100 p-4">
      <div class="flex justify-between items-center">
        <div>
          <b class="text-[15px]">{{ mallName(m.slug) }}</b>
          <p class="text-xs text-gray-500">{{ m.area || m.city || '' }}{{ m.total_tenant ? ' • ' + m.total_tenant + ' tenant' : '' }}</p>
        </div>
        <span class="text-[11px] font-extrabold px-2.5 py-1 rounded-full" style="background:#0C0A09;color:#fff">{{ shortLabel(m.slug) }}</span>
      </div>
      <div class="flex gap-2 mt-3">
        <NuxtLink :to="`/mall/${m.slug}`" class="flex-1 text-center bg-white rounded-[14px] p-3 font-extrabold text-[13px] border-2 border-gray-200" style="min-height:56px">
          🏬 Lihat Tenant →
        </NuxtLink>
        <NuxtLink :to="`/makan?mall=${m.slug}`" class="flex-1 text-center text-white rounded-[14px] p-3 font-extrabold text-[13px]" style="background:#E11D48;min-height:56px">
          ✨ Cariin yang cocok →
        </NuxtLink>
      </div>
    </div>
  </div>
</div>
</template>

<script setup lang="ts">
import { getMallName, getMallShortLabel } from '~/utils/quiz-logic'

interface MallItem {
  slug: string
  name: string
  city?: string
  area?: string
  total_tenant?: number
}

const { data, pending, error, refresh } = await useFetch<MallItem[]>('/api/malls')
// SEO hub: /mall = pintu masuk direktori (hub → 5 leaf /mall/:slug, Google suka struktur ini).
useHead({
  title: 'Direktori Kuliner Mall Jakarta — Wikendo',
  meta: [
    { name: 'description', content: 'Direktori kuliner curated 5 mall Jakarta: Grand Indonesia, Central Park, Kokas, PIM, Aeon BSD. Males scroll? Quiz 20 detik → 5 tenant + voucher.' }
  ]
})
const malls = computed(() => data.value || [])
function mallName(slug: string) { return getMallName(slug) }
function shortLabel(slug: string) { return getMallShortLabel(slug) }
</script>