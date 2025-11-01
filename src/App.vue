<template> 
<!-- bg-gradient-to-r from-slate-800 to-indigo-900  -->
<!-- bg-gradient-to-r from-emerald-500 to-emerald-900  -->
  <div class="min-h-screen bg-gradient-to-r from-slate-800 to-indigo-900 text-white">
    <div class="container mx-auto px-4 max-w-4xl pt-12">
      <h1 class="text-5xl font-bold mb-8 bg-gradient-to-r from-pink-500 to-yellow-500 bg-clip-text text-transparent text-center">
        Better Paths
      </h1>
      <p class="mb-8 text-gray-200 text-center">Find the best route for your errands and other stuff you have to do.</p>
      
      <div class="bg-gray-800/50 backdrop-blur-sm rounded-lg shadow p-6 space-y-6">
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

        <button elevation="24"
          @click="calculateRoutes"
          :disabled="isLoading"
          class="w-full bg-gradient-to-r from-pink-500 to-yellow-500 text-white px-4 py-2 rounded hover:from-pink-600 hover:to-yellow-600 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          {{ isLoading ? 'Calculating...' : 'Calculate Best Routes' }}
        </button>

        <RouteResults
          v-if="showResults"
          :timeOptimizedRoute="timeOptimizedRoute"
          :distanceOptimizedRoute="distanceOptimizedRoute"
          :totalTime="totalTime"
          :totalDistance="totalDistance"
          @map-ready="handleMapReady"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import LocationInput from './components/LocationInput.vue'
import ErrandsList from './components/ErrandsList.vue'
import TransportOptions from './components/TransportOptions.vue'
import RouteResults from './components/RouteResults.vue'
import { useGoogleMaps } from './composables/useGoogleMaps'
import { useAnalytics } from './composables/useAnalytics'

export default {
  name: 'App',
  components: {
    LocationInput,
    ErrandsList,
    TransportOptions,
    RouteResults
  },
  setup() {
    const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    console.log('API Key loaded:', API_KEY ? 'Yes' : 'No')
    
    const { initGoogleMaps, calculateRoutes: calculateGoogleRoutes } = useGoogleMaps(API_KEY)
    const { trackButtonClick, trackRouteSuccess, trackError } = useAnalytics()

    // Initialize all reactive references
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
    const mapReady = ref(false)

    // Initialize Google Maps as soon as the component mounts
    onMounted(async () => {
      if (!import.meta.env.VITE_GOOGLE_MAPS_API_KEY) {
        console.error('Google Maps API key not found in environment variables')
        trackError('api_key_missing', {
          error_message: 'Google Maps API key not found in environment variables',
          error_type: 'configuration',
          context: 'app_initialization'
        })
        return
      }
      try {
        await initGoogleMaps()
        console.log('Google Maps initialized successfully')
      } catch (error) {
        console.error('Failed to initialize Google Maps:', error)
        trackError('maps_init_failed', {
          error_message: error.message || 'Failed to initialize Google Maps',
          error_type: 'maps_initialization',
          context: 'app_mount'
        })
      }
    })

    const handleMapReady = async () => {
      try {
        // Add a small delay to ensure DOM is ready
        await new Promise(resolve => setTimeout(resolve, 100))
        await initGoogleMaps()
        mapReady.value = true
      } catch (error) {
        console.error('Failed to initialize Google Maps:', error)
        trackError('maps_init_failed', {
          error_message: error.message || 'Failed to initialize Google Maps',
          error_type: 'maps_initialization',
          context: 'map_ready_handler'
        })
      }
    }

    const calculateRoutes = async () => {
      if (isLoading.value) return
      
      // Track button click
      trackButtonClick('calculate_routes')
      
      isLoading.value = true
      showResults.value = true

      try {
        await new Promise(resolve => setTimeout(resolve, 100))
        
        await initGoogleMaps()
        
        // Filter out empty errands
        const validErrands = errands.value.filter(errand => errand && errand.trim())
        
        if (validErrands.length === 0) {
          trackError('validation_no_errands', {
            error_message: 'No valid errand addresses entered',
            error_type: 'validation',
            context: 'route_calculation'
          })
          alert('Please enter at least one valid errand address')
          return
        }

        if (!origin.value || !destination.value) {
          trackError('validation_missing_locations', {
            error_message: 'Missing origin or destination address',
            error_type: 'validation',
            context: 'route_calculation',
            has_origin: !!origin.value,
            has_destination: !!destination.value
          })
          alert('Please enter both origin and destination addresses')
          return
        }

        const departureDateTime = useCustomTime.value
          ? new Date(`${departureDate.value}T${departureTime.value}`)
          : new Date(Date.now() + 30 * 60000)

        console.log('Calculating routes with:', {
          origin: origin.value,
          destination: destination.value,
          errands: validErrands,
          mode: transportMode.value,
          time: departureDateTime
        })

        const results = await calculateGoogleRoutes({
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
          
          // Track successful route calculation
          trackRouteSuccess({
            numErrands: validErrands.length,
            transportMode: transportMode.value,
            customTimeUsed: useCustomTime.value,
            totalTime: totalTime.value,
            totalDistance: totalDistance.value
          })
        }
      } catch (error) {
        console.error('Route calculation error:', error)
        trackError('route_calculation_failed', {
          error_message: error.message || 'Route calculation failed',
          error_type: 'calculation',
          context: 'route_calculation',
          transport_mode: transportMode.value,
          num_errands: errands.value.filter(e => e && e.trim()).length
        })
        alert(`Failed to calculate routes: ${error.message}`)
      } finally {
        isLoading.value = false
      }
    }

    onMounted(() => {
      document.documentElement.classList.add('dark')
    })

    return {
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
      calculateRoutes,
      isLoading,
      handleMapReady
    }
  }
}
</script> 