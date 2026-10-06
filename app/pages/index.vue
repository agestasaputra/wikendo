<!-- pages/index.vue → GET / (Landing, SSR).
  Hero + 2 CTA: 🗺️ /quiz (Plan) dan 🍜 /makan (Mall). Halaman statis, tanpa fetch. -->
<template>
  <div>
    <section class="bg-gradient-to-br from-cyan-600 to-cyan-800 text-white py-16 px-4 text-center">
      <h1 class="text-3xl md:text-4xl font-bold mb-3">Bingung Weekend Mau Kemana?</h1>
      <p class="text-xl text-white/90 mb-6">Quiz 30 detik → dapatkan 5 rekomendasi tempat cocok</p>
      <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
        <NuxtLink to="/quiz" class="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-4 rounded-xl shadow-lg text-lg">
          🗺️ Cari Tempat Weekend →
        </NuxtLink>
        <NuxtLink to="/makan" class="bg-white/95 hover:bg-white text-gray-900 font-semibold px-8 py-4 rounded-xl shadow-lg text-lg">
          🍜 Lagi di Mall, Laper?
        </NuxtLink>
      </div>
      <p class="text-white/70 text-sm mt-4">Quiz makan 20 detik → 5 tenant • quota terpisah 5x/hari</p>
    </section>
    <section class="py-16 px-4 bg-white text-center max-w-2xl mx-auto">
      <h2 class="text-2xl font-bold text-gray-900 mb-6">Siap nemuin tempat weekend seru?</h2>
      <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
        <NuxtLink to="/quiz" class="bg-orange-500 text-white font-semibold px-8 py-4 rounded-xl">🗺️ Mulai Quiz Tempat →</NuxtLink>
        <NuxtLink to="/makan" class="border-2 border-orange-500 text-orange-500 px-8 py-4 rounded-xl">🍜 Cari Makan di Mall</NuxtLink>
      </div>
      <p class="text-sm text-gray-500 mt-4">Result tidak dicampur: tempat ya tempat, makan ya makan.</p>
    </section>
  </div>
</template>
