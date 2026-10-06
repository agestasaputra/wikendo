// tailwind.config.ts — Token brand: primary cyan #0891b2, accent orange #f97316.
// Pakai sebagai class (bg-primary, text-accent, bg-orange-500). Tambah warna baru di sini biar konsisten.
/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0891b2',
          700: '#0e7490'
        },
        accent: {
          DEFAULT: '#f97316'
        }
      }
    }
  },
  plugins: []
}
