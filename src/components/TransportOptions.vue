<template>
  <div class="space-y-4">
    <h2 class="text-xl font-semibold">Transportation Details</h2>
    
    <div>
      <label class="block text-sm font-medium text-white">Mode of Transportation</label>
      <select
        :value="transportMode"
        @change="$emit('update:transportMode', $event.target.value)"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-700 text-white"
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
            @change="$emit('update:useCustomTime', $event.target.checked)"
            class="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
          />
          <span class="ml-2 text-sm">Schedule for later?</span>
        </label>
      </div>

      <div v-if="useCustomTime" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-white">Departure Date</label>
          <input
            type="date"
            :value="currentDate"
            @input="handleDateChange"
            :min="currentDate"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-700 text-white"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-white">Departure Time</label>
          <input
            type="time"
            :value="currentTime"
            @input="handleTimeChange"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-700 text-white"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
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
    handleDateChange(event) {
      try {
        this.$emit('update:departureDate', new Date(event.target.value))
      } catch (e) {
        console.error('Error handling date change:', e)
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
    }
  }
}
</script> 