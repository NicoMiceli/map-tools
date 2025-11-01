<template>
  <div class="space-y-4">
    <div class="grid grid-cols-2 gap-4">
      <div>
        <div class="flex justify-between items-center mb-2">
          <label class="block text-sm font-medium text-white bg-clip-text text-transparent">
            Starting Point
          </label>
            <div class="flex gap-2">
            <button 
              @click="saveCurrentAsHome"
              class="p-2 text-gray-300 hover:text-white transition-colors"
              title="Save starting address as home"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
            </button>
            <button 
              @click="setHomeAddress('origin')"
              class="p-2 text-gray-300 hover:text-white transition-colors"
              :title="savedHomeAddress ? 'Use saved home address' : 'No saved home address'"
              :disabled="!savedHomeAddress"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
                <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
              </svg>
            </button>
          </div>
        </div>
        <input
          ref="originInput"
          type="text"
          :value="origin"
          @input="$emit('update:origin', $event.target.value)"
          @focus="handleFieldFocus('origin')"
          @blur="handleFieldBlur('origin', origin)"
          class="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          placeholder="Enter starting address"
          autocomplete="off"
        />
      </div>

      <div>
        <div class="flex justify-between items-center mb-2">
          <label class="block text-sm font-medium text-white bg-clip-text text-transparent">
            Final Destination
          </label>
          <button 
            @click="setHomeAddress('destination')"
            class="p-2 text-gray-300 hover:text-white transition-colors"
            title="Use home address"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
              <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
            </svg>
          </button>
        </div>
        <input
          ref="destinationInput"
          type="text"
          :value="destination"
          @input="$emit('update:destination', $event.target.value)"
          @focus="handleFieldFocus('destination')"
          @blur="handleFieldBlur('destination', destination)"
          class="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          placeholder="Enter destination address"
          autocomplete="off"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useSavedAddresses } from '../composables/useSavedAddresses'
import { useAnalytics } from '../composables/useAnalytics'

const HOME_ADDRESS = '777 S Broad St, Philadelphia, PA 19147'

export default {
  name: 'LocationInput',
  props: {
    origin: String,
    destination: String
  },
  emits: ['update:origin', 'update:destination'],
  setup(props, { emit }) {
    const originInput = ref(null)
    const destinationInput = ref(null)
    const originAutocomplete = ref(null)
    const destinationAutocomplete = ref(null)
    
    const { savedHomeAddress, saveHomeAddress, loadHomeAddress } = useSavedAddresses()
    const { trackFormInteract, trackFormComplete, trackAutocompleteSelect, trackButtonClick } = useAnalytics()

    const setHomeAddress = (field) => {
      if (savedHomeAddress.value) {
        emit(`update:${field}`, savedHomeAddress.value)
        trackButtonClick(`use_home_${field}`)
      }
    }

    const saveCurrentAsHome = () => {
      trackButtonClick('save_home')
      if (props.origin) {
        const success = saveHomeAddress(props.origin)
        if (success) {
          alert('Home address saved successfully!')
        } else {
          alert('Failed to save home address')
        }
      } else {
        alert('Please enter an address first')
      }
    }

    const initializeAutocomplete = (element, updateField) => {
      if (!window.google?.maps?.places || !element) {
        console.warn('Google Maps Places not loaded yet')
        return null
      }

      try {
        if (element.getAttribute('data-autocomplete-initialized')) {
          google.maps.event.clearInstanceListeners(element)
        }

        const autocomplete = new google.maps.places.Autocomplete(element, {
          types: ['address'],
          componentRestrictions: { country: 'us' },
          fields: ['formatted_address', 'geometry'],
          strictBounds: false
        })

        element.setAttribute('data-autocomplete-initialized', 'true')

        autocomplete.addListener('place_changed', () => {
          try {
            const place = autocomplete.getPlace()
            if (place.formatted_address) {
              emit(updateField, place.formatted_address)
              // Track autocomplete selection
              const fieldName = updateField.replace('update:', '')
              trackAutocompleteSelect(`${fieldName}_autocomplete`, place.formatted_address)
            }
          } catch (error) {
            console.error('Error handling place selection:', error)
          }
        })

        element.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
          }
        })

        return autocomplete
      } catch (error) {
        console.error('Error initializing autocomplete:', error)
        return null
      }
    }

    onMounted(() => {
      const initializeAutocompletes = () => {
        if (window.google?.maps?.places) {
          originAutocomplete.value = initializeAutocomplete(originInput.value, 'update:origin')
          destinationAutocomplete.value = initializeAutocomplete(destinationInput.value, 'update:destination')
        } else {
          setTimeout(initializeAutocompletes, 100)
        }
      }

      initializeAutocompletes()
    })

    const handleFieldFocus = (fieldName) => {
      trackFormInteract(fieldName)
    }

    const handleFieldBlur = (fieldName, value) => {
      if (value && value.trim()) {
        trackFormComplete(fieldName)
      }
    }

    return {
      originInput,
      destinationInput,
      setHomeAddress,
      saveCurrentAsHome,
      savedHomeAddress,
      handleFieldFocus,
      handleFieldBlur
    }
  }
}
</script>

<style scoped>
:deep(.pac-container) {
  background-color: white;
  z-index: 1000;
  border-radius: 0.375rem;
  margin-top: 4px;
}

:deep(.pac-item) {
  padding: 8px;
  cursor: pointer;
}

:deep(.pac-item:hover) {
  background-color: #f3f4f6;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style> 