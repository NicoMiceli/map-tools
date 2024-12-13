<template>
  <div class="space-y-4">
    <div>
      <label class="block text-white mb-2">Starting Point</label>
      <input
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
export default {
  name: 'LocationInput',
  props: {
    origin: String,
    destination: String
  },
  emits: ['update:origin', 'update:destination']
}
</script> 