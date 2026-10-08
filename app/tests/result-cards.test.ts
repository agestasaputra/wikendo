import { describe, it, expect } from 'vitest'
import { getResultTempatMeta, getResultMakanMeta } from '../utils/quiz-logic'

/**
 * result-cards.test.ts — Test R3b (tempat photo+lime) + F1b (makan tiket).
 * KENAPA file ini ada: slicing 1:1 dari 3 screenshot (Rooftop Senayan #1 BEST
 * + Kopi Kekinian BEST MATCH + direktori GI 10/40). Token dikunci Agesta:
 * R3b lime=nilai + ember=strip + ink=aksi, F1b tiket dashed + benefit gede +
 * pill Klaim kecil, bg paper #F5F5F4 + ink #0C0A09. Pure helpers biar pages 1 sumber.
 */

describe('getResultTempatMeta (R3b photo + lime)', () => {
  it('strip ember #EA580C + badge BEST lime #A3E635 teks ink', () => {
    const m = getResultTempatMeta()
    expect(m.strip).toBe('#EA580C')
    expect(m.bestBg).toBe('#A3E635')
    expect(m.bestColor).toBe('#0C0A09')
  })

  it('tombol aksi ink #0C0A09 + page paper #F5F5F4 + kartu putih', () => {
    const m = getResultTempatMeta()
    expect(m.actionBg).toBe('#0C0A09')
    expect(m.actionColor).toBe('#fff')
    expect(m.pageBg).toBe('#F5F5F4')
    expect(m.cardBg).toBe('#fff')
  })

  it('chip Lainnya aktif ink + teks lime', () => {
    const m = getResultTempatMeta()
    expect(m.moreBg).toBe('#0C0A09')
    expect(m.moreColor).toBe('#A3E635')
  })
})

describe('getResultMakanMeta (F1b tiket voucher)', () => {
  it('tiket ink #0C0A09 + diskon lime #A3E635 + border dashed pink #FECDD3', () => {
    const m = getResultMakanMeta()
    expect(m.ticketBg).toBe('#0C0A09')
    expect(m.discountColor).toBe('#A3E635')
    expect(m.ticketBorder).toBe('#FECDD3')
  })

  it('tombol Klaim rose #E11D48 + BEST lime + halal mint', () => {
    const m = getResultMakanMeta()
    expect(m.claimBg).toBe('#E11D48')
    expect(m.claimColor).toBe('#fff')
    expect(m.bestBg).toBe('#A3E635')
    expect(m.halalBg).toBe('#ECFDF5')
    expect(m.halalColor).toBe('#047857')
  })

  it('page paper #F5F5F4 + kartu putih (token lock)', () => {
    const m = getResultMakanMeta()
    expect(m.pageBg).toBe('#F5F5F4')
    expect(m.cardBg).toBe('#fff')
  })
})
