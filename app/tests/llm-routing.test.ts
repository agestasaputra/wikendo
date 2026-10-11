import { describe, it, expect } from 'vitest'
import { buildCfChatUrl, pickLLMProvider, cleanJSON } from '../utils/quiz-logic'

/**
 * llm-routing.test.ts — Opsi 2 CF direct (TDD RED dulu).
 * KENAPA: prod Vercel tak bisa ke localhost:20128 → 500.
 * Solusi: server Vercel tembak CF Workers AI langsung kalau env CF ada,
 * dev lokal tetap hermes-combo localhost. Pure helper biar testable.
 */

describe('buildCfChatUrl (endpoint OpenAI-compatible CF)', () => {
  it('bikin URL .../ai/v1/chat/completions dari accountId', () => {
    expect(buildCfChatUrl('abc123def456'))
      .toBe('https://api.cloudflare.com/client/v4/accounts/abc123def456/ai/v1/chat/completions')
  })

  it('trim spasi accountId', () => {
    expect(buildCfChatUrl('  abc123  '))
      .toBe('https://api.cloudflare.com/client/v4/accounts/abc123/ai/v1/chat/completions')
  })
})

describe('pickLLMProvider (dev/prod split)', () => {
  it('CF kalau accountId + token ada → kind cf + model llama-3.1-8b-instruct-fast', () => {
    const p = pickLLMProvider({ cfAccountId: 'acc123', cfToken: 'tok456', hermesUrl: 'http://127.0.0.1:20128' })
    expect(p.kind).toBe('cf')
    expect(p.url).toBe('https://api.cloudflare.com/client/v4/accounts/acc123/ai/v1/chat/completions')
    expect(p.model).toBe('@cf/meta/llama-3.1-8b-instruct-fast')
  })

  it('hermes fallback kalau CF kosong (dev lokal)', () => {
    const p = pickLLMProvider({ cfAccountId: '', cfToken: '', hermesUrl: 'http://127.0.0.1:20128' })
    expect(p.kind).toBe('hermes')
    expect(p.url).toBe('http://127.0.0.1:20128/v1/chat/completions')
    expect(p.model).toBe('hermes-combo')
  })

  it('hermes fallback kalau cuma salah satu CF ada (aman, anti setengah config)', () => {
    const p = pickLLMProvider({ cfAccountId: 'acc123', cfToken: '', hermesUrl: 'http://127.0.0.1:20128' })
    expect(p.kind).toBe('hermes')
  })
})

describe('cleanJSON (strip markdown fence LLM)', () => {
  it('buang ```json fence + teks prefix', () => {
    const raw = 'Baik! ```json\n{"recommendations":[]}\n```'
    expect(cleanJSON(raw)).toBe('{"recommendations":[]}')
  })

  it('JSON polos tetap utuh', () => {
    expect(cleanJSON('{"a":1}')).toBe('{"a":1}')
  })
})
