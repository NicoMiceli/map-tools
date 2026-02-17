<template>
  <div class="space-y-4">
    <div v-if="showMap" id="map" ref="mapElement" class="h-96 w-full rounded-lg shadow-md"></div>
    
    <div v-if="timeOptimizedRoute && timeOptimizedRoute.length" class="space-y-4">
      <div>
        <h3 class="text-xl font-semibold">Time-optimized Route</h3>
        <p>Total time: {{ formatTime(totalTime) }}</p>
        <div class="mt-2">
          <RouteTable :route="timeOptimizedRoute" type="Time-optimized" />
          <a
            :href="createGoogleMapsLink(timeOptimizedRoute)"
            target="_blank"
            @click="handleMapLinkClick('time_optimized')"
            class="text-blue-500 hover:text-blue-600"
          >
            Open in Google Maps
          </a>
        </div>
      </div>

      <div>
        <h3 class="text-xl font-semibold">Distance-optimized Route</h3>
        <p>Total distance: {{ formatDistance(totalDistance) }}</p>
        <div class="mt-2">
          <RouteTable :route="distanceOptimizedRoute" type="Distance-optimized" />
          <a
            :href="createGoogleMapsLink(distanceOptimizedRoute)"
            target="_blank"
            @click="handleMapLinkClick('distance_optimized')"
            class="text-blue-500 hover:text-blue-600"
          >
            Open in Google Maps
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue'
import RouteTable from './RouteTable.vue'
import { useAnalytics } from '../composables/useAnalytics'

export default {
  name: 'RouteResults',
  components: {
    RouteTable
  },
  props: {
    timeOptimizedRoute: {
      type: Array,
      default: () => []
    },
    distanceOptimizedRoute: {
      type: Array,
      default: () => []
    },
    totalTime: {
      type: Number,
      default: 0
    },
    totalDistance: {
      type: Number,
      default: 0
    },
    showMap: {
      type: Boolean,
      default: true
    }
  },
  emits: ['map-ready'],
  setup(props, { emit }) {
    const mapElement = ref(null)
    const { trackButtonClick } = useAnalytics()

    onMounted(() => {
      setTimeout(() => {
        if (mapElement.value) {
          emit('map-ready')
        }
      }, 0)
    })

    const handleMapLinkClick = (routeType) => {
      trackButtonClick(`open_${routeType}_map`)
    }

    return {
      mapElement,
      handleMapLinkClick,
      formatTime(seconds) {
        return `${(seconds / 60).toFixed(2)} minutes`
      },
      formatDistance(meters) {
        return `${(meters / 1000).toFixed(2)} km`
      },
      createGoogleMapsLink(waypoints) {
        if (!waypoints || waypoints.length < 2) return '#'
        const origin = encodeURIComponent(waypoints[0])
        const destination = encodeURIComponent(waypoints[waypoints.length - 1])
        const intermediatePoints = waypoints.slice(1, -1)
        const waypointsParam = intermediatePoints.length 
          ? `&waypoints=${intermediatePoints.map(wp => encodeURIComponent(wp)).join('|')}`
          : ''
        return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}${waypointsParam}`
      }
    }
  }
}
</script> 