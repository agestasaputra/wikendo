/**
 * server/utils/llm.ts — Client LLM Hermes-combo (via 9Router, server-only).
 *
 * APA: callLLM() = POST generik ke /v1/chat/completions; generateTempat() & rankTenants()
 * = wrapper prompt spesifik per mode.
 * KENAPA hemat: kandidat selalu difilter di Supabase DULU (gratis, max 30 rows) → LLM
 * cuma ranking + 1 kalimat reason. LLM tidak pernah list dari nol.
 * Prompt system memaksa LLM balas JSON VALID saja (tanpa disclaimer) supaya JSON.parse langsung.
 * Timeout 15 detik, max_tokens 2000 — kalau timeout/error, handler API yang panggil yang balas 500.
 */
import type { QuizTempatInput, TempatRecommendation, QuizMakanInput, TenantRow, RankResult, LLMChatResponse } from '~/types'

const TEMPAT_SYSTEM = `Kamu asisten rekomendasi weekend Jabodetabek. Balas HANYA JSON valid: {"recommendations":[{"name":"...","category":"...","reason":"... (1 kalimat)","estimated_cost":"Rp ...","location_area":"...","best_time":"...","confidence":"high"}]}. Tepat 5 item, realistis, tanpa disclaimer.`

const MAKAN_SYSTEM = `Kamu asisten ranking tenant mall. Input: daftar kandidat tenant (JSON) + preferensi user. Balas HANYA JSON valid: {"ranking":[{"name":"... (HARUS sama persis dari kandidat)","reason":"... (1 kalimat kenapa cocok)"}]}. Tepat 5 item, urut paling cocok dulu, tanpa disclaimer.`

export async function callLLM(system: string, user: string): Promise<string> {
  const config = useRuntimeConfig()
  const res = await $fetch<LLMChatResponse>(config.hermesApiUrl + '/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${config.hermesApiKey}`, 'Content-Type': 'application/json' },
    body: { model: 'hermes-combo', messages: [{ role: 'system', content: system }, { role: 'user', content: user }], temperature: 0.7, max_tokens: 2000 },
    timeout: 15000
  })
  return res.choices[0].message.content
}

export async function generateTempat(input: QuizTempatInput): Promise<TempatRecommendation[]> {
  const user = `Mood:${input.mood} Teman:${input.companion} Budget:${input.budget} Area:${input.location} Waktu:${input.time || 'fleksibel'}`
  const raw = await callLLM(TEMPAT_SYSTEM, user)
  return JSON.parse(raw).recommendations.slice(0, 5)
}

export async function rankTenants(input: QuizMakanInput, candidates: TenantRow[]): Promise<RankResult[]> {
  const user = `Preferensi: mall=${input.mall_slug} misi=${input.mission} budget=${input.budget_tier} rombongan=${input.companion} halal_only=${!!input.halal_only} kids=${!!input.kids_friendly}\nKandidat:\n${JSON.stringify(candidates.slice(0, 30))}`
  const raw = await callLLM(MAKAN_SYSTEM, user)
  return JSON.parse(raw).ranking.slice(0, 5)
}
