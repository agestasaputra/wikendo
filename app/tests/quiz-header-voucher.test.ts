import { describe, it, expect } from 'vitest'
import {
  getQuizHeaderMeta,
  getQuizSegState,
  getVoucherCardMeta
} from '../utils/quiz-logic'

/**
 * quiz-header-voucher.test.ts — Test Q2d/M3d (label putih + dot) + V12 gift.
 * KENAPA file ini ada: gas Q2d+M3d+V12 (board v7) — label "QUIZ TEMPAT/MAKAN"
 * diputihkan (tolak full merah/oranye: gagal AAA), split via dot ember/rose-terang,
 * segmen blok lime, voucher gift surprise. Pure helpers biar pages 1 sumber.
 * Aturan repo: fungsi pure di-test, pages cukup lint+build.
 */
describe('getQuizHeaderMeta (Q2d/M3d label putih + dot)', () => {
  it('tempat → label QUIZ TEMPAT + dot ember-terang #FB923C', () => {
    const m = getQuizHeaderMeta('tempat')
    expect(m.label).toBe('QUIZ TEMPAT')
    expect(m.dot).toBe('#FB923C')
  })

  it('makan → label QUIZ MAKAN + dot rose-terang #FDA4AF', () => {
    const m = getQuizHeaderMeta('makan')
    expect(m.label).toBe('QUIZ MAKAN')
    expect(m.dot).toBe('#FDA4AF')
  })

  it('label + question putih #fff di atas ink #0C0A09 (AAA)', () => {
    const m = getQuizHeaderMeta('tempat')
    expect(m.labelColor).toBe('#fff')
    expect(m.questionColor).toBe('#fff')
    expect(m.headBg).toBe('#0C0A09')
  })

  it('segmen lime #A3E635 (kemajuan), bukan ember/rose (aksi)', () => {
    const m = getQuizHeaderMeta('tempat')
    expect(m.segOn).toBe('#A3E635')
  })

  it('selected tempat ember #EA580C vs makan rose #E11D48 (split)', () => {
    expect(getQuizHeaderMeta('tempat').selBorder).toBe('#EA580C')
    expect(getQuizHeaderMeta('tempat').selBg).toBe('#FFF7ED')
    expect(getQuizHeaderMeta('makan').selBorder).toBe('#E11D48')
    expect(getQuizHeaderMeta('makan').selBg).toBe('#FFE4E6')
  })
})

describe('getQuizSegState (segmen blok, isi = step+1)', () => {
  it('step 0 dari 5 → 1 nyala, 4 mati (Q2d)', () => {
    expect(getQuizSegState(0, 5)).toEqual([true, false, false, false, false])
  })

  it('step 1 dari 4 → 2 nyala (M3d pre-fill mall)', () => {
    expect(getQuizSegState(1, 4)).toEqual([true, true, false, false])
  })

  it('step terakhir → semua nyala', () => {
    expect(getQuizSegState(4, 5)).toEqual([true, true, true, true, true])
  })
})

describe('getVoucherCardMeta (V12 gift surprise)', () => {
  it('gift → bg grad cream-rose + border pink + pill rose', () => {
    const m = getVoucherCardMeta('gift')
    expect(m.bg).toBe('linear-gradient(140deg,#FFF7ED,#FFE4E6)')
    expect(m.border).toBe('#FECDD3')
    expect(m.goBg).toBe('#E11D48')
    expect(m.goColor).toBe('#fff')
  })
})
