import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'

/**
 * mall-entry.test.ts — Test entrypoint Mall di Home (M1+M3, lock Agesta 9 Okt).
 * KENAPA file ini ada: /mall yatim (nol pintu dari Home). M1: ikon Event mati
 * jadi ikon Mall 🏬 ber-link /mall. M3: kartu direktori Mall Terdekat
 * (5 mall • 200 tenant → tanpa login) di bawah Rekomendasi, link /mall.
 * Test RED dulu: baca pages/index.vue sebagai teks, assert struktur lock.
 */
const HOME = path.resolve(__dirname, '../pages/index.vue')

describe('entrypoint Mall di Home (M1+M3)', () => {
  it('M1: ikon Mall 🏬 ber-link /mall (Event mati diganti)', () => {
    const s = fs.readFileSync(HOME, 'utf-8')
    expect(s).toContain('to="/mall"')
    expect(s).toContain('🏬')
    expect(s).not.toContain('>Event<')
    expect(s).not.toContain('🎡')
  })

  it('M3: kartu Mall Terdekat ada (count + tanpa login) + link /mall', () => {
    const s = fs.readFileSync(HOME, 'utf-8')
    expect(s).toContain('Mall Terdekat')
    expect(s).toContain('5 mall')
    expect(s).toContain('200 tenant')
    expect(s).toContain('tanpa login')
  })

  it('minimal 2 pintu /mall (M1 ikon + M3 kartu)', () => {
    const s = fs.readFileSync(HOME, 'utf-8')
    const n = (s.match(/to="\/mall"/g) || []).length
    expect(n).toBeGreaterThanOrEqual(2)
  })
})
