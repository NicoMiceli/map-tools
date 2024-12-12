<template>
  <div class="space-y-4">
    <div id="map" ref="mapElement" class="h-96 w-full rounded-lg shadow-md"></div>
    
    <div v-if="timeOptimizedRoute && timeOptimizedRoute.length" class="space-y-4">
      <div>
        <h3 class="text-xl font-semibold">Time-optimized Route</h3>
        <p>Total time: {{ formatTime(totalTime) }}</p>
        <div class="mt-2">
          <RouteTable :route="timeOptimizedRoute" type="Time-optimized" />
          <a
            :href="createGoogleMapsLink(timeOptimizedRoute)"
            target="_blank"
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
import { onMounted, ref, watch } from 'vue'
import RouteTable from './RouteTable.vue'

export default {
  name: 'RouteResults',
  components: {
    RouteTable
  },
  props: {
    timeOptimizedRoute: Array,
    distanceOptimizedRoute: Array,
    totalTime: Number,
    totalDistance: Number
  },
  setup(props, { emit }) {
    const mapElement = ref(null)

    onMounted(() => {
      setTimeout(() => {
        if (mapElement.value) {
          emit('map-ready')
        }
      }, 0)
    })

    return {
      mapElement,
      formatTime(seconds) {
        return `${(seconds / 60).toFixed(2)} minutes`
      },
      formatDistance(meters) {
        return `${(meters / 1000).toFixed(2)} km`
      },
      createGoogleMapsLink(waypoints) {
        const baseUrl = "https://www.google.com/maps/dir/?api=1"
        const waypointsEncoded = waypoints
          .map(point => encodeURIComponent(point))
          .join('|')
        return `${baseUrl}&waypoints=${waypointsEncoded}`
      }
    }
  }
}
</script> 