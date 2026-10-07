<!-- pages/quiz.vue → GET /quiz (Quiz TEMPAT swipe, mockup B-C kombo 5+10+15).
  APA: 1 layar 1 tanya + progress + opt-card + tombol 56px Orange #f97316, base #fffdf9.
  KENAPA: 1 keputusan kecil per layar = completion >70% (PRD §4). Engine sama dipakai quiz makan → codebase 1x.
  Contoh: tap opsi langsung next (tanpa tombol Lanjut) — quota kepake pas Generate, bukan per tanya. -->
<template>
  <div class="max-w-md mx-auto px-4 pb-10 min-h-[80vh] flex flex-col" style="background:#fffdf9">
    <div class="flex justify-between items-center font-bold text-[13px] py-3">
      <NuxtLink to="/" class="text-ink">← 🗺️ Quiz tempat</NuxtLink>
      <span class="text-gray-500">{{ step + 1 }}/{{ questions.length }} • ⏱ 30 dtk</span>
    </div>
    <div class="h-2 bg-[#ececec] rounded-full overflow-hidden">
      <div class="h-full rounded-full transition-all" style="background:linear-gradient(90deg,#f97316,#fb923c)" :style="{ width: progress + '%' }" />
    </div>
    <h3 class="text-[21px] font-extrabold mt-3">{{ q.question }}</h3>
    <p class="text-[13px] text-gray-500 mb-2">Tap 1 — nggak ada jawaban salah</p>
    <div class="flex flex-col gap-2 mt-1">
      <button
        v-for="o in q.options"
        :key="o.value"
        class="w-full bg-white rounded-[20px] p-[14px] font-bold text-sm flex gap-2.5 items-center cursor-pointer text-left border-2 transition-colors"
        :style="answers[q.id] === o.value ? 'border-color:#f97316;background:#fff7ed' : 'border-color:#ececec'"
        style="min-height:56px"
        @click="select(o.value)"
      >
        <span class="text-2xl">{{ o.icon }}</span>
        <span>{{ o.label }} <small class="font-normal text-gray-500">{{ o.desc }}</small></span>
      </button>
    </div>
    <div class="flex-1" />
    <p class="text-center text-xs text-gray-400 mt-4">Quota kepake pas Generate, bukan per tanya</p>
    <button v-if="step > 0" class="mt-2 text-gray-500 text-sm" @click="step--">← Kembali</button>
  </div>
</template>

<script setup lang="ts">
import { progressPercent, isLastStep } from '~/utils/quiz-logic'
const questions = [
  { id: 'mood', question: 'Weekend ini pengen yang gimana? 🧭', options: [
    { icon: '🧘', label: 'Santai / Healing', desc: 'Slow living, recharge', value: 'santai' },
    { icon: '🎉', label: 'Seru / Hype', desc: 'Ramai, FOMO, viral', value: 'seru' },
    { icon: '🍜', label: 'Kulineran', desc: 'Makan enak', value: 'kuliner' },
    { icon: '🌿', label: 'Alam / Outdoor', desc: 'Hijau, udara segar', value: 'alam' }
  ]},
  { id: 'companion', question: 'Dengan siapa? 👯', options: [
    { icon: '🧘', label: 'Sendiri', desc: 'Me time', value: 'sendiri' },
    { icon: '💑', label: 'Pasangan', desc: 'Pasangan / teman', value: 'berdua' },
    { icon: '👥', label: 'Teman 2–4', desc: '3+ orang', value: 'rame' },
    { icon: '👨‍👩‍👧', label: 'Keluarga', desc: 'Anak / ortu', value: 'keluarga' }
  ]},
  { id: 'budget', question: 'Budget per orang? 💰', options: [
    { icon: '💰', label: 'Hemat', desc: '< Rp 50.000', value: 'hemat' },
    { icon: '💰💰', label: 'Menengah', desc: 'Rp 50-150rb', value: 'menengah' },
    { icon: '💰💰💰', label: 'Leluasa', desc: '> Rp 150.000', value: 'leluasa' }
  ]},
  { id: 'location', question: 'Area mana? 📍', options: [
    { icon: '📍', label: 'Jakarta Selatan', desc: 'Jaksel hype', value: 'jaksel' },
    { icon: '📍', label: 'Jakarta Pusat', desc: 'Jakpus klasik', value: 'jakpus' },
    { icon: '📍', label: 'Jakarta Barat', desc: 'Jakbar cozy', value: 'jakbar' },
    { icon: '📍', label: 'Bebas / Fleksibel', desc: 'Dimana aja oke', value: 'bebas' }
  ]},
  { id: 'time', question: 'Kapan mau jalan? ⏰', options: [
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
