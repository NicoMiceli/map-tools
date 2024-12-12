<template>
  <div class="space-y-4">
    <div>
      <label class="block text-sm font-medium text-gray-700">Starting Point</label>
      <input
        type="text"
        :value="origin"
        @input="$emit('update:origin', $event.target.value)"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        placeholder="Enter starting address"
      />
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-700">Ending Point</label>
      <input
        type="text"
        :value="destination"
        @input="$emit('update:destination', $event.target.value)"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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