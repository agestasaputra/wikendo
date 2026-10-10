import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'

/**
 * button-loading.test.ts — Spinner + disabled semua tombol yang request API (10 Okt 2026).
 * APA: baca .vue sebagai teks, assert tiap tombol API punya loading state (spinner + :disabled).
 * KENAPA: cegah double-klik (double signUp = email ganda, double resend = spam, double OAuth = popup ganda)
 * + UX feedback. Request Agesta pre-E2E: semua tombol API wajib spinner + disable saat request.
 * Scope: register (Daftar+Google), login (Masuk+Google+Lupa?), check-email (Kirim ulang),
 * result/result-makan (Coba lagi), mall hub+detail (chip filter + Coba lagi).
 * Idle state tetap 1:1 slicing (spinner cuma muncul pas loading, via v-if).
 */

const PAGES = path.resolve(__dirname, '../pages')

function read(p: string): string {
  return fs.readFileSync(path.join(PAGES, p), 'utf-8')
}

function spinCount(s: string): number {
  return (s.match(/animate-spin/g) || []).length
}

describe('auth buttons — spinner + disabled (anti double-submit)', () => {
  it('register: CTA Daftar punya spinner + disabled saat loading', () => {
    const s = read('register.vue')
    expect(s).toContain(':disabled=')
    expect(s).toContain('Tunggu…')
    expect(s).toContain('Daftar →')
    expect(spinCount(s)).toBeGreaterThanOrEqual(2)
  })

  it('register: tombol Google punya loading sendiri + disabled (anti double OAuth)', () => {
    const s = read('register.vue')
    expect(s).toContain('googleLoading')
    expect(s).toContain(':disabled="loading || googleLoading"')
    expect(s).toContain('Lanjutkan dengan Google')
  })

  it('register: handler jaga double-submit via early-return guard', () => {
    const s = read('register.vue')
    expect(s).toContain('if (loading.value) return')
    expect(s).toContain('googleLoading.value = true')
  })

  it('login: Masuk punya spinner + disabled saat loading', () => {
    const s = read('login.vue')
    expect(s).toContain(':disabled=')
    expect(s).toContain('Tunggu…')
    expect(s).toContain('Masuk →')
    expect(spinCount(s)).toBeGreaterThanOrEqual(3)
  })

  it('login: tombol Google + Lupa? punya loading sendiri + disabled', () => {
    const s = read('login.vue')
    expect(s).toContain('googleLoading')
    expect(s).toContain('forgotLoading')
    expect(s).toContain('Lupa?')
    expect(s).toContain('Lanjutkan dengan Google')
  })

  it('check-email: Kirim ulang punya spinner + disabled saat mengirim', () => {
    const s = read('check-email.vue')
    expect(s).toContain(':disabled="loading"')
    expect(s).toContain('Mengirim…')
    expect(s).toContain('Kirim ulang')
    expect(spinCount(s)).toBeGreaterThanOrEqual(1)
  })
})

describe('content buttons — disabled saat fetch (anti double-fetch)', () => {
  it('result + result-makan: tombol Coba lagi disabled saat pending', () => {
    for (const f of ['result.vue', 'result-makan.vue']) {
      const s = read(f)
      expect(s).toContain('Coba lagi')
      expect(s).toContain(':disabled="pending"')
    }
  })

  it('mall hub + detail: chip filter disabled saat pending (anti race reset)', () => {
    for (const f of ['mall/index.vue', 'mall/[slug].vue']) {
      const s = read(f)
      expect(s).toContain(':disabled="pending"')
      expect(s).toContain('Coba lagi')
    }
  })
})
