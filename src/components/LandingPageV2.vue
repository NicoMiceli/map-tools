<template>
  <div class="relative h-screen w-screen overflow-hidden bg-slate-900">
    <!-- Full Screen Map Container -->
    <div ref="mapContainer" class="absolute inset-0 z-0 text-slate-900"></div>

    <!-- Floating Sidebar -->
    <div class="absolute top-4 left-4 z-10 w-[400px] bg-white/95 backdrop-blur-md shadow-2xl rounded-2xl flex flex-col max-h-[calc(100vh-2rem)] border border-gray-200 dark:bg-slate-900/95 dark:border-slate-700 dark:text-white transition-all duration-300">
      
      <!-- Header -->
      <div class="p-6 border-b border-gray-200 dark:border-slate-800 shrink-0">
        <h1 class="text-3xl font-bold bg-gradient-to-r from-pink-500 to-yellow-500 bg-clip-text text-transparent">
          Better Paths
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Version 2.0</p>
      </div>

      <!-- Scrollable Content -->
      <div class="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
        <LocationInput 
          v-model:origin="origin"
          v-model:destination="destination"
        />

        <ErrandsList 
          v-model:errands="errands"
          v-model:numErrands="numErrands"
        />

        <TransportOptions
          v-model:transportMode="transportMode"
          v-model:useCustomTime="useCustomTime"
          v-model:departureDate="departureDate"
          v-model:departureTime="departureTime"
        />

        <button
          @click="handleCalculate"
          :disabled="isLoading"
          class="w-full py-4 rounded-xl font-bold text-lg shadow-lg transform transition-all active:scale-[0.98] bg-gradient-to-r from-pink-500 to-yellow-500 text-white hover:from-pink-600 hover:to-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="isLoading" class="flex items-center justify-center gap-2">
            <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Calculating...
          </span>
          <span v-else>Find Best Route</span>
        </button>

        <!-- Results in Sidebar -->
        <div v-if="showResults" class="animate-fade-in-up">
           <RouteResults
            :timeOptimizedRoute="timeOptimizedRoute"
            :distanceOptimizedRoute="distanceOptimizedRoute"
            :totalTime="totalTime"
            :totalDistance="totalDistance"
            :showMap="false"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import LocationInput from './LocationInput.vue'
import ErrandsList from './ErrandsList.vue'
import TransportOptions from './TransportOptions.vue'
import RouteResults from './RouteResults.vue'
import { useGoogleMaps } from '../composables/useGoogleMaps'
import { useAnalytics } from '../composables/useAnalytics'

export default {
  name: 'LandingPageV2',
  components: {
    LocationInput,
    ErrandsList,
    TransportOptions,
    RouteResults
  },
  setup() {
    const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    const { initGoogleMaps, calculateRoutes, mountMap } = useGoogleMaps(API_KEY)
    const { trackButtonClick, trackRouteSuccess, trackError } = useAnalytics()

    const mapContainer = ref(null)
    const origin = ref('')
    const destination = ref('')
    const numErrands = ref(3)
    const errands = ref(Array(3).fill(''))
    const transportMode = ref('driving')
    const useCustomTime = ref(false)
    const departureDate = ref(new Date().toISOString().split('T')[0])
    const departureTime = ref(new Date().toTimeString().slice(0, 5))
    const showResults = ref(false)
    const timeOptimizedRoute = ref([])
    const distanceOptimizedRoute = ref([])
    const totalTime = ref(0)
    const totalDistance = ref(0)
    const isLoading = ref(false)

    onMounted(async () => {
      try {
        await initGoogleMaps()
        if (mapContainer.value) {
          mountMap(mapContainer.value)
        }
      } catch (error) {
        console.error('Failed to initialize map:', error)
      }
    })

    const handleCalculate = async () => {
      if (isLoading.value) return
      
      trackButtonClick('calculate_routes_v2')
      isLoading.value = true
      showResults.value = true

      try {
        // Validation reused from main logic
        const validErrands = errands.value.filter(e => e && e.trim())
        
        if (!origin.value || !destination.value) {
           alert('Please enter origin and destination')
           isLoading.value = false
           return
        }

        const departureDateTime = useCustomTime.value
          ? new Date(`${departureDate.value}T${departureTime.value}`)
          : new Date(Date.now() + 30 * 60000)

        const results = await calculateRoutes({
          origin: origin.value,
          destination: destination.value,
          errands: validErrands,
          transportMode: transportMode.value,
          departureTime: departureDateTime
        })

        if (results) {
          timeOptimizedRoute.value = results.timeOptimizedRoute || []
          distanceOptimizedRoute.value = results.distanceOptimizedRoute || []
          totalTime.value = results.totalTime || 0
          totalDistance.value = results.totalDistance || 0
          
          trackRouteSuccess({
            version: 'v2',
            numErrands: validErrands.length
          })
        }
      } catch (error) {
        console.error('Calculation failed:', error)
        trackError('calculation_failed_v2', { error: error.message })
        alert(error.message)
      } finally {
        isLoading.value = false
      }
    }

    return {
      mapContainer,
      origin,
      destination,
      numErrands,
      errands,
      transportMode,
      useCustomTime,
      departureDate,
      departureTime,
      showResults,
      timeOptimizedRoute,
      distanceOptimizedRoute,
      totalTime,
      totalDistance,
      isLoading,
      handleCalculate
    }
  }
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 20px;
}
.animate-fade-in-up {
  animation: fadeInUp 0.5s ease-out;
}
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
