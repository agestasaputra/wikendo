<!-- pages/result.vue → GET /result (Hasil TEMPAT).
  Baca jawaban dari route.query → POST /api/tempat/recommend → render 5 kartu tempat.
  3 state: pending (loading) → error (403 quota / 500 LLM) → data (Top 5 murni tempat, TIDAK campur tenant). -->
<template>
  <div class="container mx-auto px-4 py-6 max-w-3xl">
    <h1 class="text-2xl font-bold mb-1">🗺️ Rekomendasi Buat Lu</h1>
    <p class="text-sm text-gray-500 mb-4">Top 5 tempat murni — tidak campur tenant makanan.</p>
    <div v-if="pending" class="text-center py-16"><div class="text-6xl animate-pulse mb-4">✨</div><p>Lagi cariin tempat yang cocok...</p></div>
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-xl p-4 text-red-800">{{ error }}</div>
    <div v-else class="space-y-4">
      <div v-for="(r, i) in data?.recommendations" :key="i" class="bg-white rounded-2xl shadow-sm border p-5">
        <span class="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-lg">#{{ i + 1 }}</span>
        <h3 class="text-xl font-bold mt-2">{{ r.name }}</h3>
        <p class="text-sm text-gray-500">[{{ r.category }} • {{ r.location_area }}]</p>
        <p class="text-gray-700 text-sm my-2">💡 {{ r.reason }}</p>
        <p class="text-sm">💰 {{ r.estimated_cost }} • ⏰ {{ r.best_time }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TempatRecommendation } from '~/types'
const route = useRoute()
const { data, pending, error } = await useFetch<{ recommendations: TempatRecommendation[] }>('/api/tempat/recommend', {
  method: 'POST',
  body: route.query
})
</script>
