<template>
  <div class="space-y-4">
    <div>
      <div class="flex justify-between items-center mb-2">
        <label class="block bg-gradient-to-r from-pink-500 to-yellow-500 bg-clip-text text-transparent">
          Starting Point
        </label>
        <button 
          @click="setHomeAddress('origin')"
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
        ref="originInput"
        type="text"
        :value="origin"
        @input="$emit('update:origin', $event.target.value)"
        class="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        placeholder="Enter starting address"
      />
    </div>
    <div>
      <div class="flex justify-between items-center mb-2">
        <label class="block bg-gradient-to-r from-pink-500 to-yellow-500 bg-clip-text text-transparent">
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
        class="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        placeholder="Enter destination address"
      />
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

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

    const setHomeAddress = (field) => {
      emit(`update:${field}`, HOME_ADDRESS)
    }

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
      }
    }

    onMounted(() => {
      setTimeout(() => {
        initializeAutocomplete(originInput.value, 'update:origin')
        initializeAutocomplete(destinationInput.value, 'update:destination')
      }, 100)
    })

    return {
      originInput,
      destinationInput,
      setHomeAddress
    }
  }
}
</script> 