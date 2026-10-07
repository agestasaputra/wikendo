<!-- app.vue — Layout GLOBAL kombo 5+10+15 (Addendum 09 v1.3 APPROVED).
  APA: header sticky + <NuxtPage/> + footer, base hangat #fffdf9 + font Plus Jakarta Sans.
  KENAPA: 1 layout dipakai 6 pages (Home, 2 quiz, 2 result, direktori) → konsisten + hemat.
  Contoh: mau ubah navbar/footer global? Edit file ini aja. -->
<template>
  <div class="min-h-screen bg-base text-ink" style="font-family:'Plus Jakarta Sans',system-ui,sans-serif">
    <header class="bg-white sticky top-0 z-40 shadow-sm">
      <div class="container mx-auto px-4 py-3 flex justify-between items-center max-w-4xl">
        <NuxtLink to="/" class="font-extrabold text-ink text-lg">Wikendo<span class="text-tempat">.</span></NuxtLink>
        <nav class="flex gap-4 text-sm font-bold">
          <NuxtLink to="/quiz" class="text-tempat">🗺️ Tempat</NuxtLink>
          <NuxtLink to="/makan" class="text-makan">🍜 Makan</NuxtLink>
          <NuxtLink to="/mall" class="text-gray-500 hidden sm:inline">🏬 Mall</NuxtLink>
        </nav>
      </div>
    </header>
    <NuxtPage />
    <footer class="text-center text-xs text-gray-400 py-8">
      Wikendo MVP • $0/month • Nuxt 4 + Supabase + Hermes-combo
    </footer>
  </div>
</template>
