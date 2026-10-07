<!-- pages/mall/[slug].vue → GET /mall/:slug (Direktori SEO, mockup H kombo 15).
  APA: search + filter chip (halal/budget/lantai/misi) + kartu tenant + CTA quiz pre-filled. Tanpa login/quota/LLM.
  KENAPA: SEO gratis ("makan halal GI murah") → direktori → quiz → voucher = 1 funnel tanpa iklan (Addendum 09 v1.3).
  Contoh: /mall/grand-indonesia → tap "Cariin yang cocok" → /makan?mall=grand-indonesia (Q1 ke-skip). -->
<template>
  <div class="max-w-md mx-auto px-4 pb-10" style="background:#fffdf9">
    <p class="text-xs text-gray-500 pt-3 mb-1">Home / Mall / {{ slug }}</p>
    <div class="flex justify-between items-center">
      <h1 class="text-xl font-extrabold">🏬 {{ mallName }}</h1>
      <span class="text-xs font-bold text-gray-500">{{ tenants.length }} tenant</span>
    </div>
    <p class="text-[13px] text-gray-500">Direktori kuliner curated • tanpa login/quota/LLM • SSR SEO</p>

    <!-- Search -->
    <div class="bg-[#f4f4f5] rounded-xl px-3.5 py-2.5 text-[13px] text-gray-500 mt-3 flex gap-2 items-center">
      🔍 <input v-model="keyword" placeholder="Cari tenant… mis. kopi, ramen" class="bg-transparent outline-none flex-1 text-ink placeholder:text-gray-400">
    </div>

    <!-- Filter chip (mockup H): halal + budget + misi. Server-side via query, client keyword via util tested. -->
    <div class="flex gap-1.5 flex-wrap my-2.5">
      <button class="text-[11.5px] font-bold rounded-full px-3 py-1.5 bg-white border-[1.5px]" :style="fHalal ? 'background:#18181b;color:#fff;border-color:#18181b' : 'border-color:#e4e4e7'" @click="fHalal = !fHalal; reload()">✅ Halal</button>
      <button class="text-[11.5px] font-bold rounded-full px-3 py-1.5 bg-white border-[1.5px]" :style="fBudget ? 'background:#18181b;color:#fff;border-color:#18181b' : 'border-color:#e4e4e7'" @click="fBudget = !fBudget; reload()">💰 50–100rb</button>
      <button class="text-[11.5px] font-bold rounded-full px-3 py-1.5 bg-white border-[1.5px]" :style="fKids ? 'background:#18181b;color:#fff;border-color:#18181b' : 'border-color:#e4e4e7'" @click="fKids = !fKids; reload()">👶 Kids</button>
      <button class="text-[11.5px] font-bold rounded-full px-3 py-1.5 bg-white border-[1.5px]" :style="fMission ? 'background:#18181b;color:#fff;border-color:#18181b' : 'border-color:#e4e4e7'" @click="fMission = !fMission; reload()">☕ Nongkrong</button>
    </div>

    <!-- CTA jembatan direktori → quiz (pre-filled Q1) -->
    <NuxtLink :to="`/makan?mall=${slug}`" class="block text-center text-white rounded-[14px] p-[15px] font-extrabold text-[14.5px] mt-1" style="background:#ee2c4b;min-height:56px">
      ✨ Cariin yang cocok → (quiz 20 dtk)
    </NuxtLink>

    <!-- Kartu tenant (mockup H): emoji + promo + nama + meta halal -->
    <div class="flex flex-col gap-2.5 mt-3">
      <div v-for="t in filtered" :key="t.name" class="border border-gray-100 rounded-2xl p-2.5 bg-white flex gap-2.5 items-center">
        <div class="w-[62px] h-[62px] flex-none rounded-xl flex items-center justify-center text-3xl" style="background:#fff7ed">🍜</div>
        <div class="text-[13px]">
          <span v-if="t.promo" class="inline-block text-white text-[10.5px] font-extrabold px-2 py-0.5 rounded-md mb-1" style="background:#ee2c4b">{{ t.promo }}</span>
          <br v-if="t.promo">
          <b>{{ t.name }}{{ t.lantai ? ' L' + t.lantai : '' }}</b>
          <p class="text-xs text-gray-500">{{ t.cat || t.category || 'Kuliner' }} • {{ t.halal === true ? '✅ Halal' : t.halal === false ? '⚠️ Non-halal' : '❓ Belum terverifikasi' }}{{ t.needs_survey ? ' • 📋 Perlu survey' : '' }}</p>
        </div>
      </div>
      <p v-if="!filtered.length" class="text-center text-sm text-gray-500 py-8">Tidak ada tenant cocok. Coba ubah filter.</p>
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
  promo?: string
  budget_tier?: string
}

const route = useRoute()
const slug = route.params.slug as string
const mallName = computed(() => ({ 'grand-indonesia': 'Grand Indonesia', 'central-park': 'Central Park', 'kota-kasablanka': 'Kota Kasablanka', 'pondok-indah-mall': 'Pondok Indah Mall', 'aeon-bsd': 'Aeon BSD' } as Record<string, string>)[slug] || slug)
const keyword = ref('')
const fHalal = ref(false)
const fBudget = ref(false)
const fKids = ref(false)
const fMission = ref(false)

const query = computed(() => ({
  ...(fHalal.value ? { halal: 'true' } : {}),
  ...(fBudget.value ? { budget: 'menengah' } : {}),
  ...(fKids.value ? { kids: 'true' } : {}),
  ...(fMission.value ? { mission: 'nongkrong_lama' } : {})
}))
const { data, refresh } = await useFetch<TenantItem[]>(() => `/api/malls/${slug}/tenants`, { query })
function reload() { refresh() }
// SEO direktori: title + description per-mall (funnel Google → tenant → quiz).
useHead({
  title: `Direktori Kuliner ${mallName.value} — Wikendo`,
  meta: [
    { name: 'description', content: `List tenant ${mallName.value} curated: halal, budget, kids-friendly. Males scroll? Quiz 20 detik → 5 tenant + voucher.` }
  ]
})
const tenants = computed(() => data.value || [])
const filtered = computed(() => filterTenantsByKeyword(tenants.value, keyword.value))
</script>
