# Google Analytics Tracking Specification

**Application:** Better Paths  
**Last Updated:** November 1, 2025  
**GA Property ID:** G-XXJJE1MSSY

## Overview

This document defines all Google Analytics events tracked in the Better Paths application. Events follow a consistent naming pattern to enable easy aggregation and reporting.

## Event Types Summary

| Event Name | Purpose | Total Events |
|------------|---------|--------------|
| `form_interact` | Track when users focus on form fields | 10+ (dynamic) |
| `form_complete` | Track when users complete form fields | 10+ (dynamic) |
| `autocomplete_select` | Track Google autocomplete selections | 5+ (dynamic) |
| `button_click` | Track all button interactions | 7 |
| `route_success` | Track successful route calculations | 1 |

---

## 1. Form Interaction Events

**Event Name:** `form_interact`

Triggered when a user focuses on a form field (focus event).

| Label | Component | Field | Trigger | Example |
|-------|-----------|-------|---------|---------|
| `origin` | LocationInput | Starting Point | User clicks/focuses on origin input | `{ event: 'form_interact', label: 'origin' }` |
| `destination` | LocationInput | Final Destination | User clicks/focuses on destination input | `{ event: 'form_interact', label: 'destination' }` |
| `num_errands` | ErrandsList | Number of errands | User clicks/focuses on number input | `{ event: 'form_interact', label: 'num_errands' }` |
| `errand_1` | ErrandsList | Errand 1 | User clicks/focuses on first errand input | `{ event: 'form_interact', label: 'errand_1' }` |
| `errand_2` | ErrandsList | Errand 2 | User clicks/focuses on second errand input | `{ event: 'form_interact', label: 'errand_2' }` |
| `errand_3` | ErrandsList | Errand 3 | User clicks/focuses on third errand input | `{ event: 'form_interact', label: 'errand_3' }` |
| `errand_N` | ErrandsList | Errand N | User clicks/focuses on Nth errand input (dynamic) | `{ event: 'form_interact', label: 'errand_4' }` |
| `custom_time_toggle` | TransportOptions | Schedule for later checkbox | User toggles custom time checkbox | `{ event: 'form_interact', label: 'custom_time_toggle', checked: true }` |

**Additional Parameters:**
- `checked` (boolean) - Only for `custom_time_toggle`, indicates checkbox state

---

## 2. Form Completion Events

**Event Name:** `form_complete`

Triggered when a user completes a form field and it contains a value (blur event with value).

| Label | Component | Field | Trigger | Example |
|-------|-----------|-------|---------|---------|
| `origin` | LocationInput | Starting Point | User enters origin and leaves field | `{ event: 'form_complete', label: 'origin' }` |
| `destination` | LocationInput | Final Destination | User enters destination and leaves field | `{ event: 'form_complete', label: 'destination' }` |
| `num_errands` | ErrandsList | Number of errands | User changes number and leaves field | `{ event: 'form_complete', label: 'num_errands' }` |
| `errand_1` | ErrandsList | Errand 1 | User enters first errand and leaves field | `{ event: 'form_complete', label: 'errand_1' }` |
| `errand_2` | ErrandsList | Errand 2 | User enters second errand and leaves field | `{ event: 'form_complete', label: 'errand_2' }` |
| `errand_3` | ErrandsList | Errand 3 | User enters third errand and leaves field | `{ event: 'form_complete', label: 'errand_3' }` |
| `errand_N` | ErrandsList | Errand N | User enters Nth errand and leaves field (dynamic) | `{ event: 'form_complete', label: 'errand_5' }` |
| `transport_mode` | TransportOptions | Mode of Transportation | User selects transport mode | `{ event: 'form_complete', label: 'transport_mode', value: 'driving' }` |
| `departure_date` | TransportOptions | Departure Date | User selects date and leaves field | `{ event: 'form_complete', label: 'departure_date' }` |
| `departure_time` | TransportOptions | Departure Time | User selects time and leaves field | `{ event: 'form_complete', label: 'departure_time' }` |

**Additional Parameters:**
- `value` (string) - Optional, contains the selected value (e.g., transport mode)

**Example with Value:**
```json
{
  "event": "form_complete",
  "label": "transport_mode",
  "value": "bicycling"
}
```

---

## 3. Autocomplete Selection Events

**Event Name:** `autocomplete_select`

Triggered when a user selects an address from Google Maps autocomplete dropdown.

| Label | Component | Field | Trigger | Example |
|-------|-----------|-------|---------|---------|
| `origin_autocomplete` | LocationInput | Starting Point | User selects from origin autocomplete | `{ event: 'autocomplete_select', label: 'origin_autocomplete', value: '123 Main St...' }` |
| `destination_autocomplete` | LocationInput | Final Destination | User selects from destination autocomplete | `{ event: 'autocomplete_select', label: 'destination_autocomplete', value: '456 Oak Ave...' }` |
| `errand_1_autocomplete` | ErrandsList | Errand 1 | User selects from first errand autocomplete | `{ event: 'autocomplete_select', label: 'errand_1_autocomplete', value: 'Whole Foods...' }` |
| `errand_2_autocomplete` | ErrandsList | Errand 2 | User selects from second errand autocomplete | `{ event: 'autocomplete_select', label: 'errand_2_autocomplete', value: 'Target Store...' }` |
| `errand_3_autocomplete` | ErrandsList | Errand 3 | User selects from third errand autocomplete | `{ event: 'autocomplete_select', label: 'errand_3_autocomplete', value: 'Post Office...' }` |
| `errand_N_autocomplete` | ErrandsList | Errand N | User selects from Nth errand autocomplete (dynamic) | `{ event: 'autocomplete_select', label: 'errand_7_autocomplete', value: 'Bank...' }` |

**Additional Parameters:**
- `value` (string) - The selected address or place name from autocomplete

**Full Example:**
```json
{
  "event": "autocomplete_select",
  "label": "origin_autocomplete",
  "value": "1515 Walnut St, Philadelphia, PA 19102"
}
```

---

## 4. Button Click Events

**Event Name:** `button_click`

Triggered when a user clicks any button in the application.

| Label | Component | Button | Trigger | Example |
|-------|-----------|--------|---------|---------|
| `save_home` | LocationInput | Save as home (download icon) | User saves current origin as home | `{ event: 'button_click', label: 'save_home' }` |
| `use_home_origin` | LocationInput | Use home for origin (house icon) | User sets saved home as origin | `{ event: 'button_click', label: 'use_home_origin' }` |
| `use_home_destination` | LocationInput | Use home for destination (house icon) | User sets saved home as destination | `{ event: 'button_click', label: 'use_home_destination' }` |
| `load_examples` | ErrandsList | Load Examples | User loads example addresses | `{ event: 'button_click', label: 'load_examples' }` |
| `set_today` | TransportOptions | Today | User sets departure date to today | `{ event: 'button_click', label: 'set_today' }` |
| `calculate_routes` | App | Calculate Best Routes | User initiates route calculation | `{ event: 'button_click', label: 'calculate_routes' }` |
| `open_time_optimized_map` | RouteResults | Open in Google Maps (time) | User opens time-optimized route in Google Maps | `{ event: 'button_click', label: 'open_time_optimized_map' }` |
| `open_distance_optimized_map` | RouteResults | Open in Google Maps (distance) | User opens distance-optimized route in Google Maps | `{ event: 'button_click', label: 'open_distance_optimized_map' }` |

**Example:**
```json
{
  "event": "button_click",
  "label": "calculate_routes"
}
```

---

## 5. Route Success Events

**Event Name:** `route_success`

Triggered when route calculation completes successfully.

| Label | Trigger | Parameters | Example |
|-------|---------|------------|---------|
| `route_calculated` | Routes successfully calculated | See below | See full example below |

**Parameters:**
- `label` (string) - Always "route_calculated"
- `num_errands` (number) - Number of errands included in route
- `transport_mode` (string) - Selected mode: "driving", "walking", "bicycling", or "transit"
- `custom_time_used` (boolean) - Whether user scheduled for a custom time
- `total_time_seconds` (number) - Total route time in seconds
- `total_distance_meters` (number) - Total route distance in meters

**Full Example:**
```json
{
  "event": "route_success",
  "label": "route_calculated",
  "num_errands": 3,
  "transport_mode": "driving",
  "custom_time_used": false,
  "total_time_seconds": 1845,
  "total_distance_meters": 12500
}
```

**Example with Custom Time:**
```json
{
  "event": "route_success",
  "label": "route_calculated",
  "num_errands": 5,
  "transport_mode": "bicycling",
  "custom_time_used": true,
  "total_time_seconds": 3600,
  "total_distance_meters": 8200
}
```

---

## Aggregation and Reporting Guidelines

### In Google Analytics 4

#### 1. View All Form Interactions
- **Event Name:** `form_interact`
- **Group by:** Event parameter `label`
- **Use case:** See which fields users engage with most

#### 2. Form Completion Rate
- Compare `form_interact` count vs `form_complete` count for the same label
- **Calculation:** `form_complete / form_interact * 100%`
- **Use case:** Identify fields with low completion rates

#### 3. Autocomplete Usage
- **Event Name:** `autocomplete_select`
- **Group by:** Event parameter `label`
- **Use case:** Measure adoption of autocomplete feature

#### 4. Button Click Funnel
```
button_click (label: calculate_routes)
  → route_success
    → button_click (label: open_time_optimized_map OR open_distance_optimized_map)
```

#### 5. Transport Mode Preferences
- **Event Name:** `route_success`
- **Group by:** Event parameter `transport_mode`
- **Use case:** Understand most popular transport modes

#### 6. Route Complexity
- **Event Name:** `route_success`
- **Group by:** Event parameter `num_errands`
- **Use case:** Understand typical number of stops users plan

#### 7. Feature Adoption: Custom Time Scheduling
- **Event Name:** `route_success`
- **Filter by:** Event parameter `custom_time_used = true`
- **Use case:** Measure adoption of scheduling feature

---

## Event Implementation

All events are tracked using the `useAnalytics` composable located at:
```
src/composables/useAnalytics.js
```

### Available Helper Functions:
- `trackFormInteract(fieldLabel)` - Track form field focus
- `trackFormComplete(fieldLabel, value?)` - Track form field completion
- `trackAutocompleteSelect(fieldLabel, selectedValue?)` - Track autocomplete selection
- `trackButtonClick(buttonLabel, additionalParams?)` - Track button clicks
- `trackRouteSuccess(routeData)` - Track successful route calculation

### Implementation Example:
```javascript
import { useAnalytics } from '../composables/useAnalytics'

const { trackButtonClick } = useAnalytics()

// Track a button click
trackButtonClick('my_button_label')
```

---

## Notes

1. **Dynamic Event Labels:** Errand-related events are dynamic (errand_1, errand_2, etc.) based on the number of errands configured by the user.

2. **Console Logging:** All events are logged to the browser console in development for debugging with the format: `[Analytics] event_name: {params}`

3. **Error Handling:** The analytics composable includes try-catch blocks and checks for gtag availability to prevent errors if Google Analytics fails to load.

4. **Privacy:** No personally identifiable information (PII) is tracked. Addresses are only included in autocomplete events for understanding user behavior, not for identification.

5. **Event Validation:** Events only fire when expected conditions are met (e.g., form_complete only fires if field has a value).

---

## Testing Events

### In Browser Console:
1. Open Developer Tools → Console
2. Look for `[Analytics]` logs when interacting with the app
3. Each interaction should log the event name and parameters

### In Google Analytics:
1. Go to GA4 property
2. Navigate to **Reports** → **Realtime**
3. Interact with the app and see events appear in real-time
4. Check **Event count by Event name** section

### Debug View:
1. Install Google Analytics Debugger extension
2. Enable debug mode
3. See detailed event information in console

---

## Change Log

| Date | Version | Changes |
|------|---------|---------|
| 2025-11-01 | 1.0.0 | Initial implementation with all core events |

