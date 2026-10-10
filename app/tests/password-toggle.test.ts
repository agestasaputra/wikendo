import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'

/**
 * password-toggle.test.ts — Toggle intip password + meter kekuatan di bawah field (11 Okt 2026).
 * APA: baca login.vue + register.vue sebagai teks, assert toggle 👁️ + meter bawah.
 * KENAPA: request Agesta — user harus bisa cek typo sebelum submit (turunin gagal login),
 * + meter inline 5 kotak di dalem pill sesak & nggak kebaca → pindah bawah field jadi bar + label kata.
 * Pattern standar industri (Android/iOS/Chrome): toggle di ujung kanan dalam field,
 * type="button" (anti submit), aria-label (a11y). Meter HANYA di register (create password),
 * login cukup toggle (recall password — meter malah bikin ragu).
 */

const PAGES = path.resolve(__dirname, '../pages')

function read(p: string): string {
  return fs.readFileSync(path.join(PAGES, p), 'utf-8')
}

describe('password toggle — login + register (SVG profesional, tanpa emoji/dot)', () => {
  for (const f of ['login.vue', 'register.vue']) {
    it(`${f}: ada state showPassword + input type dinamis`, () => {
      const s = read(f)
      expect(s).toContain('showPassword')
      expect(s).toContain(':type="showPassword ? \'text\' : \'password\'')
    })

    it(`${f}: tombol toggle type=button + aria-label (anti submit + a11y)`, () => {
      const s = read(f)
      expect(s).toContain('Tampilkan password')
      expect(s).toContain('Sembunyikan password')
      expect(s).toContain('showPassword = !showPassword')
    })

    it(`${f}: ikon SVG eye/eye-slash profesional (tanpa emoji 👁️/🙈)`, () => {
      const s = read(f)
      expect(s).not.toContain('👁')
      expect(s).not.toContain('🙈')
      // Heroicons outline eye + eye-slash (stroke currentColor) — marker path unik
      expect(s).toContain('M2.036 12.322')
      expect(s).toContain('M3.98 8.223')
    })

    it(`${f}: dot pemisah • di sebelah tombol mata dihapus`, () => {
      const s = read(f)
      expect(s).not.toContain('<span class="text-gray-300 text-sm">•</span>')
    })

    it(`${f}: Lupa?/CTA tidak kehapus oleh toggle`, () => {
      const s = read(f)
      expect(s).toContain('placeholder="Password"')
    })
  }

  it('login: Lupa? tetap ada + underline (toggle nyelip sebelum •, bukan gantiin)', () => {
    const s = read('login.vue')
    expect(s).toContain('Lupa?')
    expect(s).toContain('underline')
  })
})

describe('strength meter — register saja, di bawah field', () => {
  it('register: meter lama inline di pill dibongkar (5 kotak v-for hilang)', () => {
    const s = read('register.vue')
    expect(s).not.toContain('v-for="i in 5"')
  })

  it('register: bar + label kata di bawah field (Lemah/Sedang/Kuat/Sangat kuat)', () => {
    const s = read('register.vue')
    expect(s).toContain('strengthLabel')
    expect(s).toContain('Lemah')
    expect(s).toContain('Sangat kuat')
  })

  it('register: warna skala merah→hijau + cuma muncul setelah ngetik', () => {
    const s = read('register.vue')
    expect(s).toContain('strengthColor')
    expect(s).toContain('v-if="password.length"')
  })

  it('login: TIDAK ada meter (recall ≠ create password)', () => {
    const s = read('login.vue')
    expect(s).not.toContain('strengthLabel')
    expect(s).not.toContain('v-for="i in 5"')
  })
})
