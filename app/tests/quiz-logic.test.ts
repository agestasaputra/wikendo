import { describe, it, expect } from 'vitest'
import {
  progressPercent,
  isLastStep,
  getMakanStartStep,
  filterTenantsByKeyword,
  buildMapsUrl
} from '../utils/quiz-logic'

const VALID_SLUGS = [
  'grand-indonesia',
  'central-park',
  'kota-kasablanka',
  'pondok-indah-mall',
  'aeon-bsd'
]

describe('progressPercent', () => {
  it('step 0 dari 5 = 20%', () => {
    expect(progressPercent(0, 5)).toBe(20)
  })

  it('step terakhir dari 5 = 100%', () => {
    expect(progressPercent(4, 5)).toBe(100)
  })

  it('step 0 dari 4 (quiz makan) = 25%', () => {
    expect(progressPercent(0, 4)).toBe(25)
  })
})

describe('isLastStep', () => {
  it('true kalau step terakhir', () => {
    expect(isLastStep(4, 5)).toBe(true)
  })

  it('false kalau masih ada pertanyaan', () => {
    expect(isLastStep(0, 5)).toBe(false)
  })
})

describe('getMakanStartStep (pre-fill dari direktori)', () => {
  it('skip Q1 (return 1) kalau ?mall= valid', () => {
    expect(getMakanStartStep('grand-indonesia', VALID_SLUGS)).toBe(1)
  })

  it('mulai dari 0 kalau ?mall= tidak ada', () => {
    expect(getMakanStartStep(undefined, VALID_SLUGS)).toBe(0)
  })

  it('mulai dari 0 kalau ?mall= slug ngaco', () => {
    expect(getMakanStartStep('mall-ngaco', VALID_SLUGS)).toBe(0)
  })
})

describe('filterTenantsByKeyword (search direktori)', () => {
  const tenants = [
    { name: 'Kopi Kenangan' },
    { name: 'Ramen Seirock-ya' },
    { name: 'KOPI KENANGAN' }
  ]

  it('case-insensitive', () => {
    expect(filterTenantsByKeyword(tenants, 'kopi')).toHaveLength(2)
  })

  it('keyword kosong = semua', () => {
    expect(filterTenantsByKeyword(tenants, '')).toHaveLength(3)
  })

  it('tidak ketemu = array kosong', () => {
    expect(filterTenantsByKeyword(tenants, 'sushi')).toHaveLength(0)
  })
})

describe('buildMapsUrl', () => {
  it('bikin URL Google Maps yang bener', () => {
    expect(buildMapsUrl('Kopi Kenangan', 'grand-indonesia'))
      .toBe('https://www.google.com/maps/search/' + encodeURIComponent('Kopi Kenangan grand-indonesia'))
  })
})
