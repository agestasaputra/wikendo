# 20-PRD-Addendum-Opsi-A-Google-Button — Outline + Divider ATAU + Logo G Resmi

- Status: APPROVED (Agesta balas "A", 11 Okt 2026). Board: `design/revamp-options-v10.html` opt-A.
- Scope: `app/pages/register.vue` + `app/pages/login.vue` SAJA (selaras satu keluarga auth). PRD Final tidak diutak-atik.

## Kenapa (WHY)
- Tombol Google token-identik dengan pill form (putih + rounded-full + shadow) → user baca sebagai field pertama, bukan aksi → lift social login (−45% abandonment, 2–3x konversi) hilang.
- Logo "G" lingkaran biru imitasi menyalahi branding guideline Google (wajib G 4-warna di atas putih).
- Tanpa pemisah, grup sosial vs form kecampur satu (Gestalt proximity).

## Apa (WHAT — Opsi A)
1. Tombol Google: `border:1.5px solid #DADCE0` (tema outline resmi Google) + logo SVG G 4-warna (`#EA4335/#4285F4/#FBBC05/#34A853`) + shadow dihapus. Rounded + padding + label tetap (idle 1:1).
2. Divider `ATAU` (garis `#D6D3D1` + teks `#A8A29E` 10px tracking-widest, `aria-hidden`) antara Google dan form.
3. CTA hitam `#0C0A09` tetap satu-satunya elemen solid → hierarki "Google = jalan pintas, Daftar/Masuk = aksi utama".
4. Wiring utuh: OAuth + `googleLoading` spinner + `Menghubungkan…` + guard + `:disabled` tetap.

## Verifikasi
- TDD: `google-button-a.test.ts` BARU 9 assert → RED 6 gagal by design → GREEN 9/9.
- Full: 192/192 (19 files) + lint 0 error + build ~9.4s + SCAN-CLEAN + prod `/ /register /login` 200.
