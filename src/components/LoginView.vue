<template>
  <div class="min-h-screen bg-gradient-to-r from-slate-800 to-indigo-900 text-white flex flex-col items-center justify-center p-4">
    <div class="bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-xl p-8 max-w-md w-full text-center space-y-8">
      <div>
        <h1 class="text-5xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-yellow-500 bg-clip-text text-transparent">
          Better Paths
        </h1>
        <p class="text-gray-300">
          Find the best route for your errands. Please sign in to continue.
        </p>
      </div>

      <div class="flex justify-center">
        <LoginButton />
      </div>
    </div>
  </div>
</template>

<script setup>
import LoginButton from './LoginButton.vue'
</script>
