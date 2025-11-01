/**
 * Google Analytics tracking composable
 * Provides a clean interface for tracking events throughout the app
 */

/**
 * Track a custom event in Google Analytics
 * @param {string} eventName - The event name (e.g., 'form_interact', 'button_click')
 * @param {Object} eventParams - Additional parameters for the event
 * @param {string} eventParams.label - Label identifying the specific element
 * @param {string} [eventParams.value] - Optional value parameter
 * @param {Object} [eventParams.custom] - Any additional custom parameters
 */
export function trackEvent(eventName, eventParams = {}) {
  try {
    // Check if gtag is available
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, eventParams)
      console.log(`[Analytics] ${eventName}:`, eventParams)
    } else {
      console.warn('[Analytics] gtag not available')
    }
  } catch (error) {
    console.error('[Analytics] Error tracking event:', error)
  }
}

/**
 * Track form field interactions (focus events)
 * @param {string} fieldLabel - The field identifier
 */
export function trackFormInteract(fieldLabel) {
  trackEvent('form_interact', { label: fieldLabel })
}

/**
 * Track form field completion (blur with value)
 * @param {string} fieldLabel - The field identifier
 * @param {string} [value] - Optional value to track
 */
export function trackFormComplete(fieldLabel, value = null) {
  const params = { label: fieldLabel }
  if (value) {
    params.value = value
  }
  trackEvent('form_complete', params)
}

/**
 * Track autocomplete selections
 * @param {string} fieldLabel - The field identifier (should end with '_autocomplete')
 * @param {string} [selectedValue] - The selected value
 */
export function trackAutocompleteSelect(fieldLabel, selectedValue = null) {
  const params = { label: fieldLabel }
  if (selectedValue) {
    params.value = selectedValue
  }
  trackEvent('autocomplete_select', params)
}

/**
 * Track button clicks
 * @param {string} buttonLabel - The button identifier
 * @param {Object} [additionalParams] - Any additional parameters
 */
export function trackButtonClick(buttonLabel, additionalParams = {}) {
  trackEvent('button_click', { label: buttonLabel, ...additionalParams })
}

/**
 * Track successful route calculation
 * @param {Object} routeData - Data about the calculated route
 */
export function trackRouteSuccess(routeData) {
  trackEvent('route_success', {
    label: 'route_calculated',
    num_errands: routeData.numErrands,
    transport_mode: routeData.transportMode,
    custom_time_used: routeData.customTimeUsed,
    total_time_seconds: routeData.totalTime,
    total_distance_meters: routeData.totalDistance
  })
}

/**
 * Composable hook for using analytics in Vue components
 */
export function useAnalytics() {
  return {
    trackEvent,
    trackFormInteract,
    trackFormComplete,
    trackAutocompleteSelect,
    trackButtonClick,
    trackRouteSuccess
  }
}

