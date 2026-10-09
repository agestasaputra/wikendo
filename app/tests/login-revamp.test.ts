import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'

/**
 * login-revamp.test.ts — Slicing 100% halaman /login ikut screenshot terakhir (9 Okt 2026).
 * APA: baca app/pages/login.vue sebagai teks, assert 9 elemen image 1:1 + wiring fitur.
 * KENAPA: SOP §8 slicing 100% — beda 1 teks = BELUM DONE. RED dulu by design,
 * lalu GREEN pas login.vue di-slice persis + disesuaikan fitur (quota real, Supabase, Google, Lupa?).
 * Image ref: /home/ubuntu/.hermes/cache/images/img_bf220165c52b.jpg
 * Urutan image: banner hitam quota → Google → Email → Password•Lupa? → Masuk → pill → Daftar.
 */
const LOGIN = path.resolve(__dirname, '../pages/login.vue')

function readLogin(): string {
  return fs.readFileSync(LOGIN, 'utf-8')
}

describe('login revamp 100% image — struktur + teks persis', () => {
  it('container mobile max-w-md + background abu muda #F2F2F2 (bukan body/root)', () => {
    const s = readLogin()
    expect(s).toContain('max-w-md mx-auto px-4 pb-10')
    expect(s).toContain('#F2F2F2')
  })

  it('tanpa header lokal duplikat (header global sudah di app.vue, image mulai dari banner)', () => {
    const s = readLogin()
    expect(s).not.toContain('<header')
  })

  it('banner hitam: QUOTA HABIS • reset 00.00 + angka sisa + Login gratis → buka 2 + 5', () => {
    const s = readLogin()
    expect(s).toContain('QUOTA HABIS')
    expect(s).toContain('reset 00.00')
    expect(s).toContain('Login gratis')
    expect(s).toContain('buka 2 + 5')
    // angka sisa dinamis ikut quota real (fallback 0 • 0 kayak image)
    expect(s).toContain('/api/quota')
    expect(s).toContain('0 • 0')
  })

  it('tombol Lanjut dengan Google (putih, rounded pill)', () => {
    const s = readLogin()
    expect(s).toContain('Lanjut dengan Google')
    expect(s).toContain('rounded-full')
  })

  it('field Email + field Password • Lupa? (Lupa? underline)', () => {
    const s = readLogin()
    expect(s).toContain('Email')
    expect(s).toContain('Password')
    expect(s).toContain('Lupa?')
    expect(s).toContain('underline')
  })

  it('CTA utama hitam: Masuk → (panah kanan)', () => {
    const s = readLogin()
    expect(s).toContain('Masuk →')
  })

  it('pill info: 10 detik • quota reset tiap hari • gratis', () => {
    const s = readLogin()
    expect(s).toContain('10 detik')
    expect(s).toContain('quota reset tiap hari')
    expect(s).toContain('gratis')
  })

  it('footer: Belum punya akun? Daftar (link ke /register)', () => {
    const s = readLogin()
    expect(s).toContain('Belum punya akun?')
    expect(s).toContain('Daftar')
    expect(s).toContain('to="/register"')
  })
})

describe('login revamp — wiring fitur app (bukan mock)', () => {
  it('login email+password via Supabase signInWithPassword + hormati ?redirect=', () => {
    const s = readLogin()
    expect(s).toContain('signInWithPassword')
    expect(s).toContain('redirect')
  })

  it('tombol Google via Supabase signInWithOAuth provider google', () => {
    const s = readLogin()
    expect(s).toContain('signInWithOAuth')
    expect(s).toContain('google')
  })

  it('Lupa? via Supabase resetPasswordForEmail', () => {
    const s = readLogin()
    expect(s).toContain('resetPasswordForEmail')
  })
})
