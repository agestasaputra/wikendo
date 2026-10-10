# 22-PRD-Addendum-Auth-State-Home — Pembeda Before/After Login di Index (Greeting + Avatar + Logout)

- Status: DRAFT → nunggu "Gas slicing" dari Agesta (request 11 Okt 2026: "Iyaaa boleh, gas!").
- Scope: `app/composables/useAuth.ts` (BARU) + `app/app.vue` + `app/pages/index.vue` SAJA. PRD Final tidak diutak-atik.
- Yang EKSEKUSI slicing: Agesta sendiri (AI cuma siapkan Addendum + test TDD RED).

## Kenapa (WHY)
- Login sekarang = sukses teknis tapi nol rasanya. User bayar effort (daftar + verifikasi + klik Google)
  tapi pulang ke home yang sama persis kayak anon → aktivasi bocor di titik paling mahal.
- Bukti audit 11 Okt: `app.vue` pakai `v-if="!isLoggedIn"` tapi NOL script/composable (undefined terus
  → header selalu render Login/Register walau sudah login). `index.vue` sapaan hardcode
  `Halo, teman Wikendo` + `GET /api/quota` hardcode `isLoggedIn:false` (wallet nggak pernah 2+5).
  NOL `signOut`, NOL avatar/dropdown, NOL `onAuthStateChange` (reload = state ilang).
- Sapaan nama + quota login yang kelihatan = reward psikologis → user klik quiz ke-2 → ngunci
  voucher claim wajib-login (anti-farming) + repeat quiz. Tanpa ini retention nggak jalan.

## Apa (WHAT — versi mini, $0, tanpa infra baru)
1. **Session jadi sumber kebenaran** — `app/composables/useAuth.ts` BARU:
   `getSession()` pas load + `onAuthStateChange()` buat update. Expose `isLoggedIn, email, displayName, signOut`.
   `displayName`: Google `user_metadata.full_name` > `name` > fallback prefix email
   (`siskadptr@gmail.com` → `Siskadptr`). Field Nama TIDAK dibalikin ke form (takeout 10 Okt tetap).
2. **Greeting di index** — anon tetap `Halo, teman Wikendo`; login `Halo, {firstName}` (first name doang,
   jangan full email). Hero sub ikut state: anon `Gratis hari ini — login buka 2 + 5` → login
   `Sisa kamu: X tempat • Y makan` (angka masih dari `/api/quota` cookie dulu; quota server session-aware = slice berikutnya).
3. **Header 2-state diperpanjang** (SOP §8: `isLoggedIn ? Bell : Tombol Login`, `max-w-md` tetap):
   after-login kanan = **avatar initial (S) + Bell 🔔**. Klik avatar → dropdown mini: email (display grey),
   `Riwayat`, `Wishlist (Segera)`, `Keluar` merah. Logout JANGAN tombol gede di header (ikut Tokped/Shopee/Linear).
4. **Logout real** — `supabaseBrowser().auth.signOut()` → clear state → `router.push('/')`. Tanpa confirm modal (MVP).

## Scope guard (JANGAN dibangun di slice ini)
- `/profile` full page (edit nama/foto/ganti password) → BACKLOG.
- Foto avatar Google → initial aja dulu (hemat bandwidth + logic).
- `GET /api/quota` session-aware (baca access_token) → slice berikutnya, JANGAN dicampur biar slice ini kecil.
- Idle 1:1 tetap (slicing §8): anon render HARUS sama persis kayak sekarang.

## Kriteria DONE (buat Agesta checklist pas slicing)
- [ ] `useAuth.ts` ada + expose `isLoggedIn/email/displayName/signOut` + listener auth.
- [ ] Header anon = Login/Register (sama kayak sekarang); login = avatar initial + Bell + dropdown (email/Riwayat/Wishlist/Keluar).
- [ ] Index anon = `Halo, teman Wikendo`; login = `Halo, {nama}` + hero sub login-aware.
- [ ] Klik Keluar → balik `/` sebagai anon (header Login/Register lagi).
- [ ] Test `auth-state-home.test.ts` diaktifkan (hapus `.skip`) → GREEN semua → full suite hijau → lint 0 error → build sukses → push + prod 200.

## Verifikasi (TDD)
- Test BARU `app/tests/auth-state-home.test.ts` 11 assert (composable 4 + header 4 + home 3).
- Status saat Addendum ditulis: RED by design (file `useAuth.ts` belum ada + `app.vue`/`index.vue` belum wiring)
  → file di-commit dalam kondisi `describe.skip` biar main tetap hijau; Agesta hapus `.skip` pas mulai slicing buat lihat RED-nya.
