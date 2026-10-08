import { describe, it, expect } from 'vitest'
import { getHomeHeroMeta } from '../utils/quiz-logic'

/**
 * home-hero.test.ts — Test meta hero home I17 V2 Ember P1.
 * KENAPA file ini ada: slicing full satu halaman dari screenshot V2 Ember
 * (#EA580C strip) ke pages/index.vue — token hero (ink + strip ember +
 * angka lime + pill lime + CTA ink) disatuin di 1 helper pure biar pages
 * 1 sumber kebenaran, bukan hardcode hex di tiap page.
 * Dipakai: pages/index.vue (hero QUOTA HARI INI).
 * Aturan repo: fungsi pure di-test, pages cukup lint+build.
 */
describe('getHomeHeroMeta (I17 V2 Ember P1)', () => {
  it('hero ink #0C0A09 + strip ember #EA580C (V2, bukan orange I2)', () => {
    const m = getHomeHeroMeta()
    expect(m.headBg).toBe('#0C0A09')
    expect(m.strip).toBe('#EA580C')
  })

  it('angka lime-di-gelap #D9F99D + pill lime #A3E635 teks ink', () => {
    const m = getHomeHeroMeta()
    expect(m.numColor).toBe('#D9F99D')
    expect(m.pillBg).toBe('#A3E635')
    expect(m.pillColor).toBe('#0C0A09')
  })

  it('CTA Tempat/Makan ink #0C0A09 (V2 I17), bukan ember/rose', () => {
    const m = getHomeHeroMeta()
    expect(m.ctaBg).toBe('#0C0A09')
    expect(m.ctaColor).toBe('#fff')
  })

  it('page paper #F5F5F4 + kartu putih + badge mint', () => {
    const m = getHomeHeroMeta()
    expect(m.pageBg).toBe('#F5F5F4')
    expect(m.cardBg).toBe('#fff')
    expect(m.tagBg).toBe('#ECFDF5')
    expect(m.tagColor).toBe('#047857')
  })
})
