// vitest.config.ts — Config unit test: environment happy-dom (simulasi browser ringan),
// test file pattern tests/**/*.test.ts. Perintah: npm run test (sekali) / npm run test:watch (watch mode).
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'happy-dom',
    include: ['tests/**/*.test.ts']
  }
})
