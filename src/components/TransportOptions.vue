<template>
  <div class="space-y-4">
    <h2 class="text-xl font-semibold bg-gradient-to-r from-pink-500 to-yellow-500 bg-clip-text text-transparent">Transportation Details</h2>
    
    <div>
      <label class="block text-sm font-medium text-white">Mode of Transportation</label>
      <select
        :value="transportMode"
        @change="handleTransportModeChange"
        class="mt-1 block rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-700 text-white px-4 py-2"
      >
        <option value="driving">Driving</option>
        <option value="walking">Walking</option>
        <option value="bicycling">Bicycling</option>
        <option value="transit">Transit</option>
      </select>
    </div>

    <div class="space-y-2">
      <label class="block text-sm font-medium text-white">Departure Time</label>
      <div class="mt-1">
        <label class="inline-flex items-center">
          <input
            type="checkbox"
            :checked="useCustomTime"
            @change="handleCustomTimeToggle"
            class="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
          />
          <span class="ml-2 text-sm">Schedule for later?</span>
        </label>
      </div>

      <div v-if="useCustomTime" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div class="relative">
            <label class="block text-sm font-medium text-white">Departure Date</label>
            <input
              type="date"
              :value="currentDate"
              @input="handleDateChange"
              @blur="handleDateBlur"
              :min="currentDate"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-700 text-white"
            />
            <button 
              @click="setToday"
              class="bg-transparent hover:bg-blue-500 text-white font-semibold text-white py-2 px-4 border-blue-500 hover:border-transparent rounded focus:outline-none mt-2"
            >
              Today
            </button>
          </div>
          <div>
            <label class="block text-sm font-medium text-white">Departure Time</label>
            <input
              type="time"
              :value="currentTime"
              @input="handleTimeChange"
              @blur="handleTimeBlur"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-700 text-white"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAnalytics } from '../composables/useAnalytics'

export default {
  name: 'TransportOptions',
  props: {
    transportMode: {
      type: String,
      default: 'driving'
    },
    useCustomTime: {
      type: Boolean,
      default: false
    },
    departureDate: {
      type: Date,
      default: () => new Date()
    },
    departureTime: {
      type: Date,
      default: () => new Date()
    }
  },
  computed: {
    currentDate() {
      return this.formatDate(this.departureDate || new Date())
    },
    currentTime() {
      return this.formatTime(this.departureTime || new Date())
    }
  },
  emits: ['update:transportMode', 'update:useCustomTime', 'update:departureDate', 'update:departureTime'],
  setup() {
    const { trackFormInteract, trackFormComplete, trackButtonClick } = useAnalytics()
    return {
      trackFormInteract,
      trackFormComplete,
      trackButtonClick
    }
  },
  methods: {
    formatDate(date) {
      try {
        return date instanceof Date ? date.toISOString().split('T')[0] : ''
      } catch (e) {
        return new Date().toISOString().split('T')[0]
      }
    },
    formatTime(date) {
      try {
        return date instanceof Date ? date.toTimeString().slice(0, 5) : ''
      } catch (e) {
        return new Date().toTimeString().slice(0, 5)
      }
    },
    handleTransportModeChange(event) {
      const value = event.target.value
      this.$emit('update:transportMode', value)
      this.trackFormComplete('transport_mode', value)
    },
    handleCustomTimeToggle(event) {
      const checked = event.target.checked
      this.$emit('update:useCustomTime', checked)
      this.trackFormInteract('custom_time_toggle', { checked })
    },
    handleDateChange(event) {
      try {
        this.$emit('update:departureDate', new Date(event.target.value))
      } catch (e) {
        console.error('Error handling date change:', e)
      }
    },
    handleDateBlur(event) {
      if (event.target.value) {
        this.trackFormComplete('departure_date')
      }
    },
    handleTimeChange(event) {
      try {
        const [hours, minutes] = event.target.value.split(':')
        const newDate = new Date()
        newDate.setHours(parseInt(hours))
        newDate.setMinutes(parseInt(minutes))
        this.$emit('update:departureTime', newDate)
      } catch (e) {
        console.error('Error handling time change:', e)
      }
    },
    handleTimeBlur(event) {
      if (event.target.value) {
        this.trackFormComplete('departure_time')
      }
    },
    setToday() {
      this.trackButtonClick('set_today')
      this.$emit('update:departureDate', new Date())
    }
  }
}
</script> 