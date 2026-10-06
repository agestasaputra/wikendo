<!-- pages/mall/[slug].vue → GET /mall/:slug (Direktori 1 mall, tanpa login/quota/LLM).
  [slug] = dynamic route: 1 file melayani grand-indonesia, central-park, dst (route.params.slug).
  Fetch GET /api/malls/:slug/tenants → search client-side (filterTenantsByKeyword, tested).
  Banner gradient → /makan?mall=slug (jembatan direktori → quiz, Q1 ke-skip otomatis).
  TenantItem lokal = bentuk ringkas buat list; bentuk lengkap ada di TenantRecommendation (types/). -->
<template>
  <div class="container mx-auto px-4 py-6 max-w-4xl">
    <p class="text-xs text-gray-500 mb-2">Home / Mall / {{ slug }}</p>
    <h1 class="text-2xl font-bold">🏬 Direktori Kuliner {{ mallName }}</h1>
    <p class="text-sm text-gray-600">{{ tenants.length }} tenant curated • tanpa login/quota/LLM</p>
    <div class="bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-2xl p-5 mt-4">
      <div class="font-bold">Males scroll {{ tenants.length }} tenant?</div>
      <NuxtLink :to="`/makan?mall=${slug}`" class="inline-block bg-white text-gray-900 font-bold px-5 py-3 rounded-xl text-sm mt-2">🍜 Cariin yang cocok →</NuxtLink>
    </div>
    <input v-model="keyword" placeholder="🔍 Cari tenant... mis. kopi, ramen" class="w-full border rounded-xl px-4 py-2.5 text-sm mt-4">
    <div class="grid sm:grid-cols-2 gap-3 mt-4">
      <div v-for="t in filtered" :key="t.name" class="bg-white rounded-2xl border p-4">
        <h3 class="font-bold">{{ t.name }}</h3>
        <p class="text-xs text-gray-500">[{{ t.cat }} • Lt.{{ t.lantai }}] • 💰 {{ t.price }}</p>
        <div class="flex flex-wrap gap-1 mt-2">
          <span v-if="t.halal === true" class="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">✅ Halal</span>
          <span v-else-if="t.halal === false" class="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full">⚠️ Non-halal</span>
          <span v-else class="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">❓ Belum terverifikasi</span>
          <span v-if="t.needs_survey" class="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full">📋 Perlu survey</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { filterTenantsByKeyword } from '~/utils/quiz-logic'
interface TenantItem {
  name: string
  cat?: string
  category?: string
  lantai?: string
  price?: string
  price_range?: string
  mission?: string[]
  halal?: boolean | null
  hype_tiktok?: boolean | null
  needs_survey?: boolean
}

const route = useRoute()
const slug = route.params.slug as string
const mallName = computed(() => ({ 'grand-indonesia': 'Grand Indonesia', 'central-park': 'Central Park', 'kota-kasablanka': 'Kota Kasablanka', 'pondok-indah-mall': 'Pondok Indah Mall', 'aeon-bsd': 'Aeon BSD' } as Record<string, string>)[slug] || slug)
const keyword = ref('')
const { data } = await useFetch<TenantItem[]>(`/api/malls/${slug}/tenants`)
const tenants = computed(() => data.value || [])
const filtered = computed(() => filterTenantsByKeyword(tenants.value, keyword.value))
</script>
