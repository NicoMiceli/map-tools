<template>
  <div class="overflow-x-auto">
    <table class="min-w-full divide-y divide-gray-600">
      <thead>
        <tr>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
            Stop
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
            Address
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-600">
        <tr v-for="(address, index) in route" :key="index">
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
            {{ index === 0 ? 'Start' : index === route.length - 1 ? 'End' : `Stop ${index}` }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
            {{ address }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'RouteTable',
  props: {
    route: {
      type: Array,
      required: true
    },
    type: {
      type: String,
      required: true
    }
  }
}
</script> 