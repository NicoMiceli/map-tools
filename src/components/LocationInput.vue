<template>
  <div class="space-y-4">
    <div>
      <label class="block text-white mb-2">Starting Point</label>
      <input
        ref="originInput"
        type="text"
        :value="origin"
        @input="$emit('update:origin', $event.target.value)"
        class="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        placeholder="Enter starting address"
      />
    </div>
    <div>
      <label class="block text-white mb-2">Final Destination</label>
      <input
        ref="destinationInput"
        type="text"
        :value="destination"
        @input="$emit('update:destination', $event.target.value)"
        class="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        placeholder="Enter destination address"
      />
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

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

    const initializeAutocomplete = (element, updateField) => {
      if (!window.google || !element) return

      try {
        const autocomplete = new google.maps.places.Autocomplete(element, {
          types: ['address'],
          componentRestrictions: { country: 'us' },
          fields: ['formatted_address']
        })

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace()
          if (place.formatted_address) {
            emit(updateField, place.formatted_address)
          }
        })
      } catch (error) {
        console.error('Error initializing autocomplete:', error)
        // Don't throw, just log - allows fallback to manual input
      }
    }

    onMounted(() => {
      // Wait for Google Maps to be loaded
      setTimeout(() => {
        initializeAutocomplete(originInput.value, 'update:origin')
        initializeAutocomplete(destinationInput.value, 'update:destination')
      }, 100)
    })

    return {
      originInput,
      destinationInput
    }
  }
}
</script> 