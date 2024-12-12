<template>
  <div class="space-y-4">
    <div>
      <label class="block text-sm font-medium text-gray-700">Mode of Transportation</label>
      <select
        :value="transportMode"
        @change="$emit('update:transportMode', $event.target.value)"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
      >
        <option value="driving">Driving</option>
        <option value="walking">Walking</option>
        <option value="bicycling">Bicycling</option>
        <option value="transit">Transit</option>
      </select>
    </div>

    <div class="space-y-2">
      <h3 class="text-lg font-medium">Departure Time</h3>
      <div class="flex items-center">
        <input
          type="checkbox"
          :checked="useCustomTime"
          @change="$emit('update:useCustomTime', $event.target.checked)"
          class="rounded border-gray-300"
        />
        <label class="ml-2">Schedule for later?</label>
      </div>

      <div v-if="useCustomTime" class="space-y-2">
        <div>
          <label class="block text-sm font-medium text-gray-700">Select departure date</label>
          <input
            type="date"
            :value="formatDate(departureDate)"
            @input="$emit('update:departureDate', $event.target.value)"
            :min="formatDate(new Date())"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Select departure time</label>
          <input
            type="time"
            :value="formatTime(departureTime)"
            @input="$emit('update:departureTime', $event.target.value)"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
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
    transportMode: String,
    useCustomTime: Boolean,
    departureDate: Date,
    departureTime: Date
  },
  emits: ['update:transportMode', 'update:useCustomTime', 'update:departureDate', 'update:departureTime'],
  methods: {
    formatDate(date) {
      return date.toISOString().split('T')[0]
    },
    formatTime(date) {
      return date.toTimeString().slice(0, 5)
    }
  }
}
</script> 