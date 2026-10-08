import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'

/**
 * brand-assets.test.ts — Test aset logo Day (app icon + header).
 * KENAPA file ini ada: logo D16 Day FINAL LOCK dipasang sebagai app icon
 * (PWA install + apple-touch) + header icon-only (tanpa tulisan, pilihan Agesta).
 * Test RED dulu: public/*.png + site.webmanifest harus ada & non-kosong,
 * manifest valid (name Wikendo + icons 192/512). Pages cukup lint+build.
 */
const PUBLIC = path.resolve(__dirname, '../public')

const REQUIRED_FILES = [
  'brand-icon-day.png',
  'favicon-32.png',
  'apple-touch-icon.png',
  'icon-192.png',
  'icon-512.png',
  'site.webmanifest'
]

describe('brand assets (logo Day icon-only)', () => {
  for (const f of REQUIRED_FILES) {
    it(`${f} ada & non-kosong`, () => {
      const p = path.join(PUBLIC, f)
      expect(fs.existsSync(p), `hilang: public/${f}`).toBe(true)
      expect(fs.statSync(p).size).toBeGreaterThan(0)
    })
  }

  it('site.webmanifest valid: name Wikendo + icons 192/512', () => {
    const raw = fs.readFileSync(path.join(PUBLIC, 'site.webmanifest'), 'utf-8')
    const m = JSON.parse(raw)
    expect(m.name).toContain('Wikendo')
    const sizes = (m.icons || []).map((i: { sizes: string }) => i.sizes)
    expect(sizes).toContain('192x192')
    expect(sizes).toContain('512x512')
  })
})
