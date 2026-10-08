import { describe, it, expect } from 'vitest'
import { getMallName, getMallShortLabel, shortArea, formatLantai, categoryEmoji, tenantAvatarBg, tenantPromoBadge, tenantRating, priceShort, tenantHalalLabel, buildDirCountLabel, getTenantCardMeta } from '../utils/quiz-logic'

/**
 * mall.test.ts — Test helper nama mall (TDD RED dulu).
 * KENAPA file ini ada: mapping slug→nama dipakai 3 tempat (mall/index.vue,
 * mall/[slug].vue, result-makan.vue) → 1 helper biar tambah mall ke-6
 * cukup edit 1 tempat, bukan 3 file. Pure, tanpa baca route/DB.
 */
describe('getMallName (slug → nama lengkap)', () => {
  it('5 slug valid → nama lengkap', () => {
    expect(getMallName('grand-indonesia')).toBe('Grand Indonesia')
    expect(getMallName('central-park')).toBe('Central Park')
    expect(getMallName('kota-kasablanka')).toBe('Kota Kasablanka')
    expect(getMallName('pondok-indah-mall')).toBe('Pondok Indah Mall')
    expect(getMallName('aeon-bsd')).toBe('Aeon BSD')
  })

  it('slug ngaco → fallback slug as-is (tidak crash)', () => {
    expect(getMallName('mall-ngaco')).toBe('mall-ngaco')
  })
})

describe('getMallShortLabel (slug → label chip/pendek)', () => {
  it('nama panjang disingkat (GI, CP, Kokas, PIM, Aeon)', () => {
    expect(getMallShortLabel('grand-indonesia')).toBe('GI')
    expect(getMallShortLabel('central-park')).toBe('CP')
    expect(getMallShortLabel('kota-kasablanka')).toBe('Kokas')
    expect(getMallShortLabel('pondok-indah-mall')).toBe('PIM')
    expect(getMallShortLabel('aeon-bsd')).toBe('Aeon')
  })

  it('slug ngaco → fallback slug as-is', () => {
    expect(getMallShortLabel('mall-ngaco')).toBe('mall-ngaco')
  })
})

/**
 * Slot S2c/D1 1:1 (TDD RED dulu, slicing 8 Okt 2026).
 * KENAPA: desain D1/S2c pakai area pendek, lantai L-prefix, thumb emoji+warna,
 * badge promo hyphen, rating ★, label halal, pill count infinity.
 * DB real tanpa kolom rating/promo → helper pure deterministik
 * (flag adaptasi di PROGRESS, bukan data bohong).
 */
describe('shortArea (area full → pendek 1:1 D1)', () => {
  it('ambil segmen terpendek (Thamrin, Grogol)', () => {
    expect(shortArea('Thamrin / Menteng')).toBe('Thamrin')
    expect(shortArea('Tanjung Duren / Grogol')).toBe('Grogol')
  })

  it('area tunggal as-is, kosong → string kosong', () => {
    expect(shortArea('BSD City')).toBe('BSD City')
    expect(shortArea('')).toBe('')
    expect(shortArea(undefined)).toBe('')
  })
})

describe('formatLantai (lantai DB → label kartu S2c)', () => {
  it('angka → prefix L (1→L1, 3A→L3A)', () => {
    expect(formatLantai('1')).toBe('L1')
    expect(formatLantai('3')).toBe('L3')
    expect(formatLantai('3A')).toBe('L3A')
    expect(formatLantai('5')).toBe('L5')
  })

  it('kode gedung as-is (LG, GF, UG, G, nama area)', () => {
    expect(formatLantai('LG')).toBe('LG')
    expect(formatLantai('GF')).toBe('GF')
    expect(formatLantai('UG')).toBe('UG')
    expect(formatLantai('G')).toBe('G')
    expect(formatLantai('Foodprint')).toBe('Foodprint')
    expect(formatLantai('Tribeca')).toBe('Tribeca')
    expect(formatLantai('')).toBe('')
  })
})

describe('categoryEmoji + tenantAvatarBg (thumb S2c)', () => {
  it('3 kategori mock S2c: kopi maroon, japanese charcoal, healthy hijau', () => {
    expect(categoryEmoji('kopi')).toBe('☕')
    expect(categoryEmoji('japanese')).toBe('🍜')
    expect(categoryEmoji('healthy')).toBe('🥗')
    expect(tenantAvatarBg('kopi')).toBe('#7C2D12')
    expect(tenantAvatarBg('japanese')).toBe('#1C1917')
    expect(tenantAvatarBg('healthy')).toBe('#15803D')
  })

  it('kategori ngaco → fallback (tidak crash)', () => {
    expect(categoryEmoji('ngaco')).toBe('🍜')
    expect(tenantAvatarBg('ngaco')).toBe('#44403C')
    expect(categoryEmoji('')).toBe('🍜')
  })
})

describe('tenantPromoBadge (badge -20% S2c, hyphen biasa)', () => {
  it('hype=true → -20% (hyphen-minus U+002D)', () => {
    expect(tenantPromoBadge(true)).toBe('-20%')
  })

  it('hype false/null → null (tanpa badge)', () => {
    expect(tenantPromoBadge(false)).toBeNull()
    expect(tenantPromoBadge(null)).toBeNull()
  })
})

describe('tenantRating (slot ★ S2c, deterministik dari nama)', () => {
  it('selalu 4.7/4.8/4.9 + stabil untuk nama sama', () => {
    const r = tenantRating('Kopi Kekinian')
    expect(['4.7', '4.8', '4.9']).toContain(r)
    expect(tenantRating('Kopi Kekinian')).toBe(r)
  })
})

describe('priceShort (Rp 50-90rb → 50-90rb)', () => {
  it('buang prefix Rp', () => {
    expect(priceShort('Rp 50-90rb')).toBe('50-90rb')
    expect(priceShort('50-100rb')).toBe('50-100rb')
    expect(priceShort('')).toBe('')
  })
})

describe('tenantHalalLabel (label halal S2c)', () => {
  it('true→✅ Halal, false→⚠️ Non-halal, null→❓', () => {
    expect(tenantHalalLabel(true)).toBe('✅ Halal')
    expect(tenantHalalLabel(false)).toBe('⚠️ Non-halal')
    expect(tenantHalalLabel(null)).toBe('❓')
  })
})

describe('buildDirCountLabel (pill infinity S2c)', () => {
  it('10/40 → 🟢 10/40 tenant · scroll untuk 10 berikutnya ↓', () => {
    expect(buildDirCountLabel(10, 40)).toBe('🟢 10/40 tenant · scroll untuk 10 berikutnya ↓')
  })
})

describe('getTenantCardMeta (1 sumber thumb S2c)', () => {
  it('kopi → emoji ☕ + bg maroon', () => {
    expect(getTenantCardMeta('kopi')).toEqual({ emoji: '☕', bg: '#7C2D12' })
  })
})
