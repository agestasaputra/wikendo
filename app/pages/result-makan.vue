<!-- pages/result-makan.vue → GET /result-makan (Hasil TENANT).
  Baca query → POST /api/makan/recommend → render 5 kartu tenant + badge Halal/Hype + tombol Maps.
  Kontrak split total: halaman ini HANYA tenant, tidak ada tempat wisata (lihat Addendum v1.1). -->
<template>
  <div class="container mx-auto px-4 py-6 max-w-3xl">
    <h1 class="text-2xl font-bold mb-1">🍜 Rekomendasi Makan</h1>
    <p class="text-sm text-gray-500 mb-4">Top 5 tenant murni — tidak campur tempat wisata.</p>
    <div v-if="pending" class="text-center py-16"><div class="text-6xl animate-pulse mb-4">🍜✨</div><p>Filter tenant + ranking LLM...</p></div>
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-xl p-4 text-red-800">{{ error }}</div>
    <div v-else class="space-y-4">
      <div v-for="(r, i) in data?.recommendations" :key="i" class="bg-white rounded-2xl shadow-sm border p-5">
        <div class="flex justify-between mb-2">
          <span class="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-lg">#{{ i + 1 }}</span>
          <div class="flex gap-1">
            <span v-if="r.halal === true" class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">✅ Halal</span>
            <span v-else-if="r.halal === false" class="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">⚠️ Non-halal</span>
            <span v-else class="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">❓ Belum terverifikasi</span>
            <span v-if="r.hype_tiktok === true" class="bg-pink-100 text-pink-700 text-xs px-2 py-1 rounded-full">🔥 Hype</span>
            <span v-if="r.needs_survey" class="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">📋 Perlu survey</span>
          </div>
        </div>
        <h3 class="text-xl font-bold">{{ r.name }}</h3>
        <p class="text-sm text-gray-500">[{{ r.category }} • Lt.{{ r.lantai }}] • 💰 {{ r.price_range }}</p>
        <p class="text-gray-700 text-sm my-2">💡 {{ r.reason }}</p>
        <a :href="r.maps_url" target="_blank" class="block text-center bg-gray-900 text-white text-sm font-semibold py-2.5 rounded-xl">📍 Maps • Lt.{{ r.lantai }}</a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TenantRecommendation } from '~/types'
const route = useRoute()
const { data, pending, error } = await useFetch<{ recommendations: TenantRecommendation[] }>('/api/makan/recommend', {
  method: 'POST',
  body: route.query
})
</script>
