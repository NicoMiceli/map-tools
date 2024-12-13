<template>
  <div class="space-y-4">
    <div class="flex justify-between items-center">
      <h2 class="text-xl font-semibold text-white">Enter your errands</h2>
      <button 
        @click="loadDefaultAddresses"
        class="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Load Examples
      </button>
    </div>
    <div>
      <label class="block text-sm font-medium text-white">Number of errands</label>
      <input
        type="number"
        :value="numErrands"
        @input="updateNumErrands"
        min="1"
        max="10"
        class="mt-1 block w-full rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      />
    </div>
    <div class="space-y-2">
      <div v-for="(_, index) in Array(numErrands)" :key="index">
        <label class="block text-sm font-medium text-white">Errand {{ index + 1 }}</label>
        <input
          type="text"
          ref="errandInputs"
          :value="errands[index]"
          @input="updateErrand(index, $event.target.value)"
          class="mt-1 block w-full rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          :placeholder="getDefaultAddress(index)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue'

const PLACEHOLDER_ADDRESSES = [
  "Judgy Coffee Shop",
  "Broken Cart Grocery",
  "Forgetful Friend's Place"
]

const TEST_ADDRESSES = [
  "1515 Walnut St, Philadelphia, PA 19102",
  "1700 Chestnut St, Philadelphia, PA 19103",
  "801 S 9th St, Philadelphia, PA 19147"
]

export default {
  name: 'ErrandsList',
  props: {
    numErrands: Number,
    errands: {
      type: Array,
      default: () => []
    }
  },
  emits: ['update:numErrands', 'update:errands'],
  setup(props) {
    const errandInputs = ref([])
    const autocompletes = ref([])

    const initializeAutocomplete = (element, index) => {
      if (!window.google || !element) return

      try {
        // Remove any existing autocomplete
        if (autocompletes.value[index]) {
          google.maps.event.clearInstanceListeners(element)
        }

        const autocomplete = new google.maps.places.Autocomplete(element, {
          types: ['address'],
          componentRestrictions: { country: 'us' },
          fields: ['formatted_address']
        })

        autocomplete.addListener('place_changed', () => {
          try {
            const place = autocomplete.getPlace()
            if (place.formatted_address) {
              const newErrands = [...props.errands]
              newErrands[index] = place.formatted_address
              emit('update:errands', newErrands)
            }
          } catch (error) {
            console.error('Error handling place selection:', error)
          }
        })

        autocompletes.value[index] = autocomplete
      } catch (error) {
        console.error('Error initializing autocomplete:', error)
        // Don't throw, allows fallback to manual input
      }
    }

    // Watch for changes in the number of errands
    watch(() => props.numErrands, () => {
      // Wait for DOM update before initializing new autocomplete fields
      setTimeout(() => {
        errandInputs.value.forEach((input, index) => {
          if (input) {
            initializeAutocomplete(input, index)
          }
        })
      }, 100)
    })

    onMounted(() => {
      // Initialize autocomplete for initial inputs
      setTimeout(() => {
        errandInputs.value.forEach((input, index) => {
          if (input) {
            initializeAutocomplete(input, index)
          }
        })
      }, 100)
    })

    return {
      errandInputs,
      // ... existing methods
    }
  },
  methods: {
    updateNumErrands(event) {
      const value = parseInt(event.target.value)
      this.$emit('update:numErrands', value)
    },
    updateErrand(index, value) {
      const newErrands = [...(this.errands || [])]
      newErrands[index] = value
      this.$emit('update:errands', newErrands)
    },
    getDefaultAddress(index) {
      return index < PLACEHOLDER_ADDRESSES.length ? PLACEHOLDER_ADDRESSES[index] : "Enter address"
    },
    loadDefaultAddresses() {
      this.$emit('update:numErrands', TEST_ADDRESSES.length)
      this.$emit('update:errands', [...TEST_ADDRESSES])
    }
  }
}
</script> 