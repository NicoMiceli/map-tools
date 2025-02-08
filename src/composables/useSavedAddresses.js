import { ref, onMounted } from 'vue'

export function useSavedAddresses() {
  const savedHomeAddress = ref('')

  const saveHomeAddress = (address) => {
    try {
      localStorage.setItem('homeAddress', address)
      savedHomeAddress.value = address
      return true
    } catch (error) {
      console.error('Error saving home address:', error)
      return false
    }
  }

  const loadHomeAddress = () => {
    try {
      const address = localStorage.getItem('homeAddress')
      savedHomeAddress.value = address || ''
      return address
    } catch (error) {
      console.error('Error loading home address:', error)
      return ''
    }
  }

  onMounted(() => {
    loadHomeAddress()
  })

  return {
    savedHomeAddress,
    saveHomeAddress,
    loadHomeAddress
  }
} 