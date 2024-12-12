<template>
  <div class="space-y-4">
    <h2 class="text-xl font-semibold">Enter your errands</h2>
    <div>
      <label class="block text-sm font-medium text-gray-700">Number of errands</label>
      <input
        type="number"
        :value="numErrands"
        @input="updateNumErrands"
        min="1"
        max="10"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
      />
    </div>
    <div class="space-y-2">
      <div v-for="(_, index) in Array(numErrands)" :key="index">
        <label class="block text-sm font-medium text-gray-700">Errand {{ index + 1 }}</label>
        <input
          type="text"
          :value="errands[index]"
          @input="updateErrand(index, $event.target.value)"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          :placeholder="getDefaultAddress(index)"
        />
      </div>
    </div>
  </div>
</template>

<script>
const DEFAULT_ADDRESSES = [
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
      return index < DEFAULT_ADDRESSES.length ? DEFAULT_ADDRESSES[index] : "Enter address"
    }
  }
}
</script> 