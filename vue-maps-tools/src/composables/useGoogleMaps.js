import { ref } from 'vue'
import { Loader } from '@googlemaps/js-api-loader'

export function useGoogleMaps(apiKey) {
  const google = ref(null)
  const directionsService = ref(null)
  const map = ref(null)
  const directionsRenderer = ref(null)

  const initGoogleMaps = async () => {
    console.log('Initializing Google Maps with API key:', apiKey)
    const loader = new Loader({
      apiKey,
      version: "weekly",
      libraries: ["places", "routes", "geometry"]
    })

    try {
      google.value = await loader.load()
      console.log('Google Maps loaded successfully')
      
      // Check if Places API is available
      if (!google.value.maps.places) {
        throw new Error('Places API not available. Please ensure it is enabled in the Google Cloud Console.')
      }
      
      directionsService.value = new google.value.maps.DirectionsService()
      directionsRenderer.value = new google.value.maps.DirectionsRenderer()
      
      // Wait for the map element to be available
      let attempts = 0
      const maxAttempts = 10
      
      while (attempts < maxAttempts) {
        const mapElement = document.getElementById("map")
        if (mapElement) {
          map.value = new google.value.maps.Map(mapElement, {
            zoom: 12,
            center: { lat: 39.9526, lng: -75.1652 }
          })
          
          directionsRenderer.value.setMap(map.value)
          console.log('Map initialized successfully')
          return google.value
        }
        
        await new Promise(resolve => setTimeout(resolve, 100))
        attempts++
      }
      
      throw new Error('Map element not found after multiple attempts')
    } catch (error) {
      console.error('Error initializing Google Maps:', error)
      if (error.message.includes('ApiNotActivatedMapError')) {
        throw new Error('Google Places API is not enabled. Please enable it in the Google Cloud Console.')
      }
      throw error
    }
  }

  const calculateRoute = async (waypoints, mode, departureTime) => {
    if (!google.value || !directionsService.value) {
      console.error('Google Maps not initialized')
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
    const waypoints = [origin, ...errands, destination]
    
    try {
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
    calculateRoutes
  }
} 