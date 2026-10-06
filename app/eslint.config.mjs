// eslint.config.mjs — Config ESLint 9 via withNuxt() (@nuxt/eslint).
// Aturan ngikut best practice Nuxt/Vue/TS otomatis. Custom rules taruh di objek withNuxt({...}).
// Perintah: npm run lint (cek) / npm run lint:fix (auto-fix).
// https://eslint.nuxt.com/packages/module
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  // Custom rules lu taruh di sini, contoh:
  // rules: {
  //   'vue/no-multiple-template-root': 'off'
  // }
})
