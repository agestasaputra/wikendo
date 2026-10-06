// eslint.config.mjs — Config ESLint 10 via withNuxt() (@nuxt/eslint).
// Aturan ngikut best practice Nuxt/Vue/TS otomatis. Custom rules taruh di objek withNuxt({...}).
// Perintah: pnpm lint (cek) / pnpm lint:fix (auto-fix).
// https://eslint.nuxt.com/packages/module
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  // Custom rules lu taruh di sini, contoh:
  // rules: {
  //   'vue/no-multiple-template-root': 'off'
  // }
})
