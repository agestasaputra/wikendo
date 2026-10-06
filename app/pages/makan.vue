<!-- pages/makan.vue → GET /makan (Quiz MAKAN, 4 pertanyaan ~20 detik).
  Q1 mall (wajib, 5 mall V1) → Q2 misi → Q3 budget → Q4 rombongan + toggle Halal-only & Kids.
  PRE-FILL: dibuka dari direktori (/makan?mall=slug-valid) → Q1 di-skip (getMakanStartStep).
  Selesai → redirect /result-makan?mall_slug=..&mission=..&halal_only=..&kids_friendly=.. -->
<template>
  <div class="container mx-auto px-4 py-8 max-w-2xl">
    <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
      <div class="bg-orange-500 h-2 rounded-full transition-all" :style="{ width: progress + '%' }"/>
    </div>
    <p class="text-sm text-gray-600 mb-6">Pertanyaan {{ step + 1 }} dari {{ questions.length }} • ~20 detik</p>
    <h2 class="text-2xl font-bold mb-6">🍜 {{ q.question }}</h2>
    <div class="space-y-3">
      <button
        v-for="o in q.options"
        :key="o.value"
        class="w-full bg-white border-2 border-gray-200 rounded-xl p-4 text-left hover:border-orange-500"
        @click="select(o.value)"
      >
        <div class="flex items-center gap-4">
          <span class="text-3xl">{{ o.icon }}</span>
          <div><div class="font-semibold">{{ o.label }}</div><div class="text-sm text-gray-600">{{ o.desc }}</div></div>
        </div>
      </button>
    </div>
    <div v-if="q.toggles" class="flex gap-3 mt-4">
      <button :class="halalOnly ? 'border-green-600 bg-green-50' : 'border-gray-200'" class="flex-1 border-2 rounded-xl py-3 font-semibold text-sm" @click="halalOnly = !halalOnly">✅ Halal only: {{ halalOnly ? 'ON' : 'OFF' }}</button>
      <button :class="kidsFriendly ? 'border-cyan-600 bg-cyan-50' : 'border-gray-200'" class="flex-1 border-2 rounded-xl py-3 font-semibold text-sm" @click="kidsFriendly = !kidsFriendly">👨‍👩‍👧 Kids: {{ kidsFriendly ? 'ON' : 'OFF' }}</button>
    </div>
    <button v-if="step > 0" class="mt-4 text-gray-500 text-sm" @click="step--">← Kembali</button>
  </div>
</template>

<script setup lang="ts">
import { progressPercent, isLastStep, getMakanStartStep } from '~/utils/quiz-logic'
const route = useRoute()
const questions = [
  { id: 'mall_slug', question: 'Mau makan di mall mana?', options: [
    { icon: '🏬', label: 'Grand Indonesia', desc: 'Thamrin, Jakpus', value: 'grand-indonesia' },
    { icon: '🏬', label: 'Central Park', desc: 'Grogol, Jakbar', value: 'central-park' },
    { icon: '🏬', label: 'Kota Kasablanka', desc: 'Tebet, Jaksel', value: 'kota-kasablanka' },
    { icon: '🏬', label: 'Pondok Indah Mall', desc: 'PIM, Jaksel', value: 'pondok-indah-mall' },
    { icon: '🏬', label: 'Aeon BSD', desc: 'BSD, Tangerang', value: 'aeon-bsd' }
  ]},
  { id: 'mission', question: 'Misi makan kali ini?', options: [
    { icon: '⚡', label: 'Makan Cepat', desc: 'Laper, langsung makan', value: 'makan_cepat' },
    { icon: '☕', label: 'Nongkrong Lama', desc: 'Ngobrol, kerja, kopi', value: 'nongkrong_lama' },
    { icon: '👨‍👩‍👧', label: 'Keluarga', desc: 'Ajak anak / rame', value: 'keluarga' },
    { icon: '🧘', label: 'Healing', desc: 'Me time, santai', value: 'healing' }
  ]},
  { id: 'budget_tier', question: 'Budget per orang?', options: [
    { icon: '💰', label: 'Hemat', desc: '< Rp 50.000', value: 'hemat' },
    { icon: '💰💰', label: 'Menengah', desc: 'Rp 50-150rb', value: 'menengah' },
    { icon: '💰💰💰', label: 'Leluasa', desc: '> Rp 150.000', value: 'leluasa' }
  ]},
  { id: 'companion', question: 'Rombongan + pantangan?', toggles: true, options: [
    { icon: '🧘', label: 'Sendiri', desc: 'Me time', value: 'sendiri' },
    { icon: '💑', label: 'Berdua', desc: 'Pasangan / teman', value: 'berdua' },
    { icon: '👥', label: 'Rame-rame', desc: '3+ orang', value: 'rame' }
  ]}
]
const validSlugs = questions[0].options.map(o => o.value)
const startStep = getMakanStartStep(route.query.mall as string | undefined, validSlugs)
const step = ref(startStep)
const answers = reactive<Record<string, string>>(
  route.query.mall ? { mall_slug: route.query.mall as string } : {}
)
const halalOnly = ref(false)
const kidsFriendly = ref(false)
const q = computed(() => questions[step.value])
const progress = computed(() => progressPercent(step.value, questions.length))
const router = useRouter()
function select(v: string) {
  answers[questions[step.value].id] = v
  if (!isLastStep(step.value, questions.length)) step.value++
  else router.push({ path: '/result-makan', query: { ...answers, halal_only: String(halalOnly.value), kids_friendly: String(kidsFriendly.value) } })
}
</script>
