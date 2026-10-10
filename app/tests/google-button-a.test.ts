import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'

/**
 * google-button-a.test.ts — Opsi A board v10 (lock Agesta "A", 11 Okt 2026).
 * APA: baca login.vue + register.vue sebagai teks, assert tombol Google gaya
 * outline resmi + divider ATAU + logo G 4-warna (bukan lingkaran biru "G").
 * KENAPA: tombol Google kini token-identik dengan pill form (putih+rounded+shadow)
 * → user baca sebagai field pertama, lift social login hilang. Opsi A = perubahan
 * terkecil: border + divider + logo resmi, CTA hitam tetap satu-satunya solid.
 * Board: design/revamp-options-v10.html (opt-A). RED dulu by design → GREEN pas slice.
 */

function readPage(f: string): string {
  return fs.readFileSync(path.resolve(__dirname, '../pages', f), 'utf-8')
}

describe('Opsi A — tombol Google outline + divider ATAU (register + login selaras)', () => {
  for (const f of ['register.vue', 'login.vue']) {
    it(`${f}: tombol Google outline abu #DADCE0 (bukan solid-putih kembaran form)`, () => {
      const s = readPage(f)
      expect(s).toContain('#DADCE0')
    })

    it(`${f}: divider ATAU antara Google dan form email`, () => {
      const s = readPage(f)
      expect(s).toContain('ATAU')
    })

    it(`${f}: logo G 4-warna resmi (kuning #FBBC05 ikut, bukan lingkaran biru "G" imitasi)`, () => {
      const s = readPage(f)
      expect(s).toContain('#FBBC05')
      expect(s).not.toContain('>G</span>')
    })

    it(`${f}: wiring Google utuh (OAuth + loading + label idle)`, () => {
      const s = readPage(f)
      expect(s).toContain('signInWithOAuth')
      expect(s).toContain('googleLoading')
      expect(s).toContain('Menghubungkan…')
    })
  }

  it('CTA hitam tetap satu-satunya solid (Google outline, bukan solid kedua)', () => {
    for (const f of ['register.vue', 'login.vue']) {
      const s = readPage(f)
      expect(s).toContain('#0C0A09')
    }
  })
})
