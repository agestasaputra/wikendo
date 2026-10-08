<!-- pages/mall/[slug].vue → GET /mall/:slug (Direktori SEO, S2c Foto Tenant + S2b infinity).
APA: search + filter chip (halal/budget/misi) + kartu tenant foto + CTA quiz pre-filled, thumb 46px + badge promo overlay, bg paper #F5F5F4 + infinity 10/page (sentinel + skeleton 2 row + sticky count "10/40").
KENAPA: S2b infinity — 40 tenant sekaligus berat di HP kentang → 10/page, SSR page-1 tetap (SEO aman), lanjut client. CTA quiz + search + chips STICKY biar nggak kelempar scroll. Filter server-side (reset page); keyword client-side di atas item termuat (spec S2b: filtered = keyword(client) + page(server)).
Token lock: ink tetap #0C0A09, rose tetap #E11D48, paper tetap #F5F5F4. -->
<template>
<div class="max-w-md mx-auto px-4 pb-10" style="background:#F5F5F4">
  <p class="text-xs text-gray-500 pt-3 mb-1">Home / Mall / {{ slug }}</p>
  <div class="flex justify-between items-center">
    <h1 class="text-xl font-extrabold">🏬 {{ mallName }}</h1>
    <span class="text-xs font-bold text-gray-500">{{ pending ? '…' : `${tenants.length}/${total || tenants.length} tenant` }}</span>
  </div>

  <p class="text-[13px] text-gray-500">Direktori kuliner curated • tanpa login/quota/LLM • SSR SEO</p>

  <!-- Sticky: search + chips + CTA (S2b spec: nggak kelempar scroll) -->
  <div class="sticky top-0 pt-2 pb-2" style="background:#F5F5F4">
    <div class="bg-[#f4f4f5] rounded-xl px-3.5 py-2.5 text-[13px] text-gray-500 flex gap-2 items-center">
      🔍 <input v-model="keyword" placeholder="Cari tenant… mis. kopi, ramen" class="bg-transparent outline-none flex-1 text-ink placeholder:text-gray-400">
    </div>

    <!-- Filter chip (mockup H): halal + budget + misi. Server-side via query, ganti filter = reset page. -->
    <div class="flex gap-1.5 flex-wrap my-2.5">
      <button class="text-[11.5px] font-bold rounded-full px-3 py-1.5 bg-white border-[1.5px]" :style="fHalal ? 'background:#18181b;color:#fff;border-color:#18181b' : 'border-color:#e4e4e7'" @click="fHalal = !fHalal; reload()">✅ Halal</button>
      <button class="text-[11.5px] font-bold rounded-full px-3 py-1.5 bg-white border-[1.5px]" :style="fBudget ? 'background:#18181b;color:#fff;border-color:#18181b' : 'border-color:#e4e4e7'" @click="fBudget = !fBudget; reload()">💰 50–100rb</button>
      <button class="text-[11.5px] font-bold rounded-full px-3 py-1.5 bg-white border-[1.5px]" :style="fKids ? 'background:#18181b;color:#fff;border-color:#18181b' : 'border-color:#e4e4e7'" @click="fKids = !fKids; reload()">👶 Kids</button>
      <button class="text-[11.5px] font-bold rounded-full px-3 py-1.5 bg-white border-[1.5px]" :style="fMission ? 'background:#18181b;color:#fff;border-color:#18181b' : 'border-color:#e4e4e7'" @click="fMission = !fMission; reload()">☕ Nongkrong</button>
    </div>

    <!-- CTA jembatan direktori → quiz (pre-filled Q1) -->
    <NuxtLink :to="`/makan?mall=${slug}`" class="block text-center text-white rounded-[14px] p-[15px] font-extrabold text-[14.5px] mt-1" style="background:#E11D48;min-height:56px">
      ✨ Cariin yang cocok → (quiz 20 dtk)
    </NuxtLink>
  </div>

  <!-- Kartu tenant (mockup S2c Foto Tenant): thumb foto 46px + badge promo overlay -->
  <AppLoader v-if="pending" variant="mall" />
  <div v-else-if="error" class="rounded-2xl p-4 text-sm font-bold mt-3" style="background:#fef2f2;border:1px solid #fecaca;color:#991b1b">
    Gagal muat tenant.<br><button class="underline mt-1" @click="reload()">Coba lagi →</button>
  </div>
  <div v-else class="flex flex-col gap-2.5 mt-3">
    <div v-for="t in filtered" :key="t.name" class="border border-gray-100 rounded-2xl p-2.5 bg-white flex gap-2.5 items-center">
      <div class="w-[46px] h-[46px] flex-none rounded-flex flex items-center justify-center font-bold text-[12px]" :style="{ background: t.promo ? '#FFF7ED' : '#F5F5F4', color: t.promo ? '#E11D48' : '#18181b' }">
        {{ t.emoji || '🍜' }}
      </div>
      <div class="text-[13px]">
        <span v-if="t.promo" class="inline-block text-white text-[10.5px] font-extrabold px-2 py-0.5 rounded-md mb-1" :style="{ background: '#E11D48', color: '#fff' }">{{ t.promo }}</span>
        <br v-if="t.promo">
        <b>{{ t.name }}{{ t.lantai ? ' L' + t.lantai : '' }}</b>
        <p class="text-xs text-gray-500">{{ t.cat || t.category || 'Kuliner' }} • {{ t.halal === true ? '✅ Halal' : t.halal === false ? '⚠️ Non-halal' : '❓ Belum terverifikasi' }}{{ t.needs_survey ? ' • 📋 Perlu survey' : '' }}</p>
      </div>
    </div>
    <p v-if="!filtered.length" class="text-center text-sm text-gray-500 py-8">Tidak ada tenant cocok. Coba ubah filter.</p>
    <!-- Skeleton 2 row pas nambah page (S2b spec) -->
    <div v-if="loadingMore" class="flex flex-col gap-2.5" aria-live="polite">
      <div v-for="i in 2" :key="i" class="border border-gray-100 rounded-2xl p-2.5 bg-white flex gap-2.5 items-center animate-pulse">
        <div class="w-[46px] h-[46px] flex-none rounded-xl" style="background:#F5F5F4" />
        <div class="flex-1"><div class="h-4 rounded w-2/3" style="background:#F5F5F4" /><div class="h-3 rounded w-1/3 mt-1.5" style="background:#F5F5F4" /></div>
      </div>
    </div>
    <!-- Sentinel infinity scroll -->
    <div v-if="hasMore" ref="sentinel" class="text-center text-xs text-gray-400 py-3">Muat tenant berikut… ({{ tenants.length }}/{{ total }})</div>
    <p v-else-if="tenants.length" class="text-center text-xs text-gray-400 py-2">Semua {{ total }} tenant tampil ✅</p>
  </div>
</div>
</template>

<script setup lang="ts">
import { filterTenantsByKeyword, getMallName } from '~/utils/quiz-logic'
import { useInfiniteList } from '~/composables/useInfiniteList'

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
  emoji?: string
}

const route = useRoute()
const slug = route.params.slug as string
const mallName = computed(() => getMallName(slug))
const keyword = ref('')
const fHalal = ref(false)
const fBudget = ref(false)
const fKids = ref(false)
const fMission = ref(false)

// SEO direktori: title + description per-mall (funnel Google → tenant → quiz).
useHead({
  title: `Direktori Kuliner ${mallName.value} — Wikendo`,
  meta: [
    { name: 'description', content: `List tenant ${mallName.value} curated: halal, budget, kids-friendly. Males scroll? Quiz 20 detik → 5 tenant + voucher.` }
  ]
})

// S2b infinity: filter server-side (reset page), keyword client-side (spec: keyword(client) + page(server)).
const list = useInfiniteList<TenantItem>({
  pageSize: 10,
  keyOf: (t) => t.name,
  fetchPage: (limit, offset) => $fetch(`/api/malls/${slug}/tenants`, {
    params: {
      limit,
      offset,
      ...(fHalal.value ? { halal: 'true' } : {}),
      ...(fBudget.value ? { budget: 'menengah' } : {}),
      ...(fKids.value ? { kids: 'true' } : {}),
      ...(fMission.value ? { mission: 'nongkrong_lama' } : {})
    }
  })
})
await list.start()
const { items: tenants, total, hasMore, pending, loadingMore, error } = list

function reload() { return list.reset() }

const sentinel = ref<HTMLDivElement | null>(null)
let observer: IntersectionObserver | null = null
onMounted(() => {
  if (!('IntersectionObserver' in window)) return
  observer = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) list.loadMore()
  }, { rootMargin: '320px' })
  if (sentinel.value) observer.observe(sentinel.value)
})
onUnmounted(() => observer?.disconnect())
// Sentinel pindah tiap page baru → observe ulang.
watch(sentinel, (el, _, onCleanup) => {
  if (el && observer) observer.observe(el)
  onCleanup(() => { if (el && observer) observer.unobserve(el) })
})

const filtered = computed(() => filterTenantsByKeyword(tenants.value, keyword.value))
</script>
