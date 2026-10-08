import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'

/**
 * header-layout.test.ts — Test layout header global (app.vue) + sapaan Home.
 * KENAPA file ini ada: Agesta minta 9 Okt — (1) lebar header disamain kayak
 * content (max-w-md, bukan max-w-4xl), (2) menu nav header (Tempat/Makan/Mall)
 * dihapus, (3) icon notifikasi 🔔 pindah dari Home ke kanan header global.
 * Test RED dulu: baca file .vue sebagai teks, assert struktur yang diminta.
 */
const APP_VUE = path.resolve(__dirname, '../app.vue')
const HOME = path.resolve(__dirname, '../pages/index.vue')

describe('header global (app.vue)', () => {
  it('lebar header = content (max-w-md, bukan max-w-4xl)', () => {
    const s = fs.readFileSync(APP_VUE, 'utf-8')
    expect(s).toContain('max-w-md')
    expect(s).not.toContain('max-w-4xl')
  })

  it('menu nav Tempat/Makan/Mall dihapus dari header', () => {
    const s = fs.readFileSync(APP_VUE, 'utf-8')
    expect(s).not.toContain('to="/quiz"')
    expect(s).not.toContain('to="/makan"')
    expect(s).not.toContain('to="/mall"')
  })

  it('icon notifikasi 🔔 ada di kanan header global (ketika sudah login)', () => {
    const s = fs.readFileSync(APP_VUE, 'utf-8')
    // Cek 🔔 ada di file (ada di header block) + button Login/Register ada buat user blum login
    expect(s).toContain('🔔')
    expect(s).toContain('Login')
    expect(s).toContain('Register')
  })
})

describe('sapaan Home (pages/index.vue)', () => {
  it('icon 🔔 sudah pindah (tidak duplikat di Home)', () => {
    const s = fs.readFileSync(HOME, 'utf-8')
    expect(s).not.toContain('🔔')
  })
})
