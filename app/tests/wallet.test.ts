import { describe, it, expect } from 'vitest'
import { buildQuotaStatus, buildWalletLabel } from '../utils/quiz-logic'

/**
 * wallet.test.ts — Test label wallet quota home (TDD RED dulu).
 * KENAPA file ini ada: wallet home tadinya static "2 tempat • 5 makan"
 * (limit REGISTER) padahal 100% user sekarang anon (limit 1+2) → scarcity
 * bohong, user ngerasa ditipu pas generate ke-2 ditolak. 1 helper pure:
 * QuotaStatus → { headline sisa, chip per mode, flag habis }.
 * Dipakai: pages/index.vue (wallet) + GET /api/quota (kontrak API §2).
 */
describe('buildWalletLabel (QuotaStatus → label wallet home)', () => {
  it('anon fresh: headline "1 tempat • 2 makan", chip penuh, belum habis', () => {
    const s = buildQuotaStatus({ tempatUsed: 0, makanUsed: 0, isLoggedIn: false })
    expect(buildWalletLabel(s)).toEqual({
      headline: '1 tempat • 2 makan',
      tempatChip: '1/1 tempat',
      makanChip: '2/2 makan',
      exhausted: false
    })
  })

  it('anon tempat habis + makan sisa 1: headline ikut sisa, belum exhausted', () => {
    const s = buildQuotaStatus({ tempatUsed: 1, makanUsed: 1, isLoggedIn: false })
    const w = buildWalletLabel(s)
    expect(w.headline).toBe('0 tempat • 1 makan')
    expect(w.tempatChip).toBe('0/1 tempat')
    expect(w.makanChip).toBe('1/2 makan')
    expect(w.exhausted).toBe(false)
  })

  it('anon habis semua: headline "0 tempat • 0 makan" + exhausted true (momen login CTA)', () => {
    const s = buildQuotaStatus({ tempatUsed: 1, makanUsed: 2, isLoggedIn: false })
    const w = buildWalletLabel(s)
    expect(w.headline).toBe('0 tempat • 0 makan')
    expect(w.exhausted).toBe(true)
  })

  it('register: limit ikut 2+5 (chip "1/2 tempat", "2/5 makan")', () => {
    const s = buildQuotaStatus({ tempatUsed: 1, makanUsed: 3, isLoggedIn: true, resetAt: 'RESET' })
    const w = buildWalletLabel(s)
    expect(w.headline).toBe('1 tempat • 2 makan')
    expect(w.tempatChip).toBe('1/2 tempat')
    expect(w.makanChip).toBe('2/5 makan')
    expect(w.exhausted).toBe(false)
  })
})
