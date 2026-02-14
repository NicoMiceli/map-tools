<template>
  <div v-if="loading">
    <!-- Loading state (optional) -->
  </div>
  <div v-else-if="isAuthenticated" class="flex items-center gap-4">
    <div class="flex items-center gap-2">
      <img 
        v-if="user?.photoURL" 
        :src="user.photoURL" 
        alt="User Avatar" 
        class="w-8 h-8 rounded-full border border-gray-600"
      />
      <span class="text-sm font-medium hidden sm:block">{{ user?.displayName }}</span>
    </div>
    <button 
      @click="logout" 
      class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 transition-colors"
    >
      Sign Out
    </button>
  </div>
  <button 
    v-else 
    @click="login" 
    class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-900 bg-white rounded hover:bg-gray-100 transition-colors"
  >
    <img src="https://www.svgrepo.com/show/475656/google-color.svg" class="w-5 h-5" alt="Google Logo" />
    Sign in with Google
  </button>
</template>

<script setup>
import { useAuth } from '../composables/useAuth'

const { user, isAuthenticated, loading, login, logout } = useAuth()
</script>
