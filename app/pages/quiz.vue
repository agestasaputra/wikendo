<!-- pages/quiz.vue → GET /quiz (Quiz TEMPAT, 5 pertanyaan ~30 detik).
  Pola: 1 layar 1 pertanyaan + progress bar + Kembali. State lokal (step/answers) — TIDAK fetch.
  Selesai → redirect /result?mood=..&companion=.. (jawaban via query string).
  Logic progress/last-step dari ~/utils/quiz-logic (sudah di-unit-test). -->
<template>
  <div class="container mx-auto px-4 py-8 max-w-2xl">
    <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
      <div class="bg-orange-500 h-2 rounded-full transition-all" :style="{ width: progress + '%' }"/>
    </div>
    <p class="text-sm text-gray-600 mb-6">Pertanyaan {{ step + 1 }} dari {{ questions.length }} • ~30 detik</p>
    <h2 class="text-2xl font-bold mb-6">{{ q.question }}</h2>
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
    <button v-if="step > 0" class="mt-4 text-gray-500 text-sm" @click="step--">← Kembali</button>
  </div>
</template>

<script setup lang="ts">
import { progressPercent, isLastStep } from '~/utils/quiz-logic'
const questions = [
  { id: 'mood', question: 'Weekend ini lagi pengen yang gimana?', options: [
    { icon: '🧘', label: 'Santai / Healing', desc: 'Slow living, recharge', value: 'santai' },
    { icon: '🎉', label: 'Seru / Hype', desc: 'Ramai, FOMO, viral', value: 'seru' },
    { icon: '🍜', label: 'Kulineran', desc: 'Makan enak', value: 'kuliner' },
    { icon: '🌿', label: 'Alam / Outdoor', desc: 'Hijau, udara segar', value: 'alam' }
  ]},
  { id: 'companion', question: 'Pergi sama siapa?', options: [
    { icon: '🧘', label: 'Sendiri', desc: 'Me time', value: 'sendiri' },
    { icon: '💑', label: 'Berdua', desc: 'Pasangan / teman', value: 'berdua' },
    { icon: '👥', label: 'Rame-rame', desc: '3+ orang', value: 'rame' },
    { icon: '👨‍👩‍👧', label: 'Keluarga', desc: 'Anak / ortu', value: 'keluarga' }
  ]},
  { id: 'budget', question: 'Budget per orang?', options: [
    { icon: '💰', label: 'Hemat', desc: '< Rp 50.000', value: 'hemat' },
    { icon: '💰💰', label: 'Menengah', desc: 'Rp 50-150rb', value: 'menengah' },
    { icon: '💰💰💰', label: 'Leluasa', desc: '> Rp 150.000', value: 'leluasa' }
  ]},
  { id: 'location', question: 'Area mana?', options: [
    { icon: '📍', label: 'Jakarta Selatan', desc: 'Jaksel hype', value: 'jaksel' },
    { icon: '📍', label: 'Jakarta Pusat', desc: 'Jakpus klasik', value: 'jakpus' },
    { icon: '📍', label: 'Jakarta Barat', desc: 'Jakbar cozy', value: 'jakbar' },
    { icon: '📍', label: 'Bebas / Fleksibel', desc: 'Dimana aja oke', value: 'bebas' }
  ]},
  { id: 'time', question: 'Kapan mau jalan?', options: [
    { icon: '☀️', label: 'Siang', desc: 'Siang-sore', value: 'siang' },
    { icon: '🌙', label: 'Malam', desc: 'Malam-minggu', value: 'malam' },
    { icon: '📅', label: 'Fleksibel', desc: 'Kapan aja', value: 'fleksibel' }
  ]}
]
const step = ref(0)
const answers = reactive<Record<string, string>>({})
const q = computed(() => questions[step.value])
const progress = computed(() => progressPercent(step.value, questions.length))
const router = useRouter()
function select(v: string) {
  answers[questions[step.value].id] = v
  if (!isLastStep(step.value, questions.length)) step.value++
  else router.push({ path: '/result', query: { ...answers } })
}
</script>
