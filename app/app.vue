<!-- app.vue — Layout GLOBAL (header + <NuxtPage/> + footer).
  Semua pages/*.vue di-render di dalam <NuxtPage/>. Mau ubah navbar/footer global? Edit file ini aja. -->
<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white sticky top-0 z-40 shadow-sm">
      <div class="container mx-auto px-4 py-3 flex justify-between items-center max-w-4xl">
        <NuxtLink to="/" class="font-bold text-gray-900">🗓️ Weekend Planner</NuxtLink>
        <div class="flex gap-4 text-sm font-semibold">
          <NuxtLink to="/makan" class="text-orange-600">🍜 Makan</NuxtLink>
          <NuxtLink to="/mall/grand-indonesia" class="text-gray-600 hidden sm:inline">🏬 Mall</NuxtLink>
        </div>
      </div>
    </header>
    <NuxtPage />
    <footer class="text-center text-xs text-gray-400 py-8">
      Weekend Planner MVP • $0/month • Nuxt 4 + Supabase + Hermes-combo
    </footer>
  </div>
</template>
