# 21-PRD-Addendum-Google-Auth-Satu-Pintu — Label Netral + Redirect Sama + Kunci Checkbox

- Status: APPROVED (Agesta: "Gas fix!", 11 Okt 2026). Lanjutan `docs/20` (Opsi A tombol Google).
- Scope: `app/pages/register.vue` + `app/pages/login.vue` SAJA. PRD Final tidak diutak-atik.

## Kenapa (WHY)
- Fungsi `signInWithOAuth({ provider: 'google' })` di login & register SAMA persis — Supabase yang
  menentukan otomatis: email Google belum ada → user baru dibuat (register), sudah ada → langsung
  masuk (login). Beda label "login vs register" cuma kosmetik dan anti best practice (temuan
  Baymard/Google: user lupa dulu daftar via apa → "gue yang mana ya?" = micro-friction di jalur
  akuisisi utama; social login nurunin abandonment s/d 45%, konversi 2–3x vs form).
- Redirect beda: login hormati `?redirect=` (balik ke quiz yang mengunci), register hardcode `/` →
  user quota-wall yang kepencet Daftar kehilangan konteks quiz.
- Checkbox "Setuju Syarat & Privasi" wajib di form email tapi `handleGoogle()` register tidak
  mengecek `agree` → bypass legal: uncheck tetap bisa daftar via Google.

## Apa (WHAT — satu pintu)
1. Label netral SAMA di dua halaman: **"Lanjutkan dengan Google"** (ikut Google/Supabase/Stripe —
   user tidak perlu ingat dulu daftar via apa). Idle 1:1, spinner `Menghubungkan…` tetap.
2. Redirect SAMA: register baca `route.query.redirect` (SSR-safe `useRoute`, pola sama kayak login)
   + `redirectTo: origin + redirect` (fallback `/`). Footer login `Daftar` preservasi `?redirect=`
   ke `/register` biar rantai tidak putus.
3. Kunci checkbox: `handleGoogle()` register cek `!agree.value` → error inline
   "Centang dulu Setuju Syarat & Privasi biar bisa lanjut." + return sebelum OAuth.
4. Email tetap beda (benar begitu): signUp → `/check-email` vs signIn → redirect — itu dua endpoint
   beda, bukan kosmetik.

## Verifikasi
- TDD: `google-auth-best-practice.test.ts` BARU 8 assert → RED 6 gagal by design → GREEN 8/8.
- Selaras: `login-revamp` (label + footer preservasi) + `register-revamp` + `button-loading` label.
- Full: 200/200 (20 files) + lint 0 error + build ~9.35s + SCAN-CLEAN + prod `/ /register /login` 200.
