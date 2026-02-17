import { ref } from 'vue'
import { Loader } from '@googlemaps/js-api-loader'

export function useGoogleMaps(apiKey) {
  const google = ref(null)
  const directionsService = ref(null)
  const map = ref(null)
  const directionsRenderer = ref(null)

  const initGoogleMaps = async () => {
    console.log('initGoogleMaps called with API key:', apiKey ? 'Present' : 'Missing')

    if (window.google?.maps?.places) {
      console.log('Google Maps already loaded, reusing instance')
      google.value = window.google
      // Initialize services if they don't exist
      if (!directionsService.value) {
        try {
          directionsService.value = new google.value.maps.DirectionsService()
          console.log('DirectionsService initialized')
        } catch (error) {
          console.error('Failed to initialize DirectionsService:', error)
        }
      }
      if (!directionsRenderer.value) {
        try {
          directionsRenderer.value = new google.value.maps.DirectionsRenderer()
          console.log('DirectionsRenderer initialized')
        } catch (error) {
          console.error('Failed to initialize DirectionsRenderer:', error)
        }
      }
      return google.value
    }

    try {
      console.log('Creating new Google Maps loader')
      const loader = new Loader({
        apiKey,
        version: "weekly",
        libraries: ["places", "routes"],
        componentRestrictions: { country: "us" }
      })

      const googleMaps = await loader.load()
      console.log('Google Maps loaded successfully')
      window.google = googleMaps
      google.value = googleMaps

      // Initialize services
      try {
        directionsService.value = new google.value.maps.DirectionsService()
        directionsRenderer.value = new google.value.maps.DirectionsRenderer()
        console.log('Services initialized successfully')
      } catch (error) {
        console.error('Failed to initialize services:', error)
        throw error
      }

      // Verify Places API is loaded
      if (!google.value.maps.places) {
        throw new Error('Places API not loaded')
      }

      console.log('Google Maps and Places API loaded successfully')
      return google.value
    } catch (error) {
      console.error('Google Maps initialization error:', {
        message: error.message,
        stack: error.stack,
        apiKeyPresent: !!apiKey
      })
      throw error
    }
  }

  const mountMap = (element) => {
    if (!google.value) {
      console.error('Google Maps API not initialized')
      return
    }
    if (!element) return

    map.value = new google.value.maps.Map(element, {
      zoom: 12,
      center: { lat: 39.9526, lng: -75.1652 },
      disableDefaultUI: false,
      zoomControl: true,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false
    })

    if (directionsRenderer.value) {
      directionsRenderer.value.setMap(map.value)
    }
  }

  const calculateRoute = async (waypoints, mode, departureTime) => {
    // Ensure Google Maps is initialized
    if (!google.value) {
      await initGoogleMaps()
    }

    // Initialize map if not already done - fallback for V1
    if (!map.value) {
      const mapElement = document.getElementById("map")
      if (mapElement) {
        mountMap(mapElement)
      }
    }

    if (!directionsService.value) {
      console.error('Directions service not initialized')
      return null
    }

    // Validate waypoints
    if (!waypoints.length || waypoints.some(wp => !wp)) {
      console.error('Invalid waypoints:', waypoints)
      throw new Error('All waypoints must be non-empty')
    }

    console.log('Calculating route with:', {
      origin: waypoints[0],
      destination: waypoints[waypoints.length - 1],
      intermediatePoints: waypoints.slice(1, -1),
      mode,
      departureTime
    })

    const request = {
      origin: waypoints[0],
      destination: waypoints[waypoints.length - 1],
      waypoints: waypoints.slice(1, -1).map(point => ({
        location: point,
        stopover: true
      })),
      travelMode: google.value.maps.TravelMode[mode.toUpperCase()],
      optimizeWaypoints: true
    }

    // Only add drivingOptions if mode is DRIVING and departureTime is specified
    if (mode.toUpperCase() === 'DRIVING' && departureTime) {
      request.drivingOptions = {
        departureTime: departureTime
      }
    }

    // For transit mode, use transitOptions instead
    if (mode.toUpperCase() === 'TRANSIT' && departureTime) {
      request.transitOptions = {
        departureTime: departureTime
      }
    }

    try {
      const result = await directionsService.value.route(request)
      directionsRenderer.value.setDirections(result)

      let totalDistance = 0
      let totalDuration = 0

      result.routes[0].legs.forEach(leg => {
        totalDistance += leg.distance.value
        totalDuration += leg.duration.value
      })

      const optimizedWaypoints = result.routes[0].waypoint_order.map(
        index => waypoints[index + 1]
      )

      return {
        route: [waypoints[0], ...optimizedWaypoints, waypoints[waypoints.length - 1]],
        totalDistance,
        totalDuration
      }
    } catch (error) {
      console.error('Detailed routing error:', error)
      throw new Error(`Route calculation failed: ${error.message}`)
    }
  }

  const calculateRoutes = async ({
    origin,
    destination,
    errands,
    transportMode,
    departureTime
  }) => {
    try {
      await initGoogleMaps() // Ensure Google Maps is initialized first
      const waypoints = [origin, ...errands, destination]
      const timeResult = await calculateRoute(waypoints, transportMode, departureTime)
      const distanceResult = await calculateRoute(waypoints, transportMode)

      return {
        timeOptimizedRoute: timeResult.route,
        distanceOptimizedRoute: distanceResult.route,
        totalTime: timeResult.totalDuration,
        totalDistance: distanceResult.totalDistance
      }
    } catch (error) {
      console.error('Error calculating routes:', error)
      throw error
    }
  }

  return {
    initGoogleMaps,
    calculateRoutes,
    mountMap,
    map
  }
} 