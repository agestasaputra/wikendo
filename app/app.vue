<!-- app.vue — Layout GLOBAL kombo 5+10+15 (Addendum 09 v1.3 APPROVED).
  APA: header sticky + <NuxtPage/> + footer, base hangat #fffdf9 + font Plus Jakarta Sans.
  KENAPA: 1 layout dipakai 6 pages (Home, 2 quiz, 2 result, direktori) → konsisten + hemat.
  Contoh: mau ubah navbar/footer global? Edit file ini aja. -->
<template>
  <div class="min-h-screen bg-base text-ink" style="font-family:'Plus Jakarta Sans',system-ui,sans-serif">
    <header class="bg-white sticky top-0 z-40 shadow-sm">
      <div class="container mx-auto px-4 py-3 flex justify-between items-center max-w-md">
        <NuxtLink to="/" class="flex items-center" aria-label="Wikendo — beranda"><img src="/brand-icon-day.png" alt="Wikendo" width="32" height="32" class="rounded-lg" /></NuxtLink>
        <button type="button" aria-label="Notifikasi" class="text-lg leading-none">🔔</button>
      </div>
    </header>
    <NuxtPage />
    <footer class="text-center text-xs text-gray-400 py-8">
      Wikendo MVP • $0/month • Nuxt 4 + Supabase + Hermes-combo
    </footer>
  </div>
</template>
