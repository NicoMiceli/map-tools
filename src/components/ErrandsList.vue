<template>
  <div>
  <div class="space-y-4">
    <div class="flex justify-between items-center flex-wrap gap-2">
      <h2 class="text-xl font-semibold bg-gradient-to-r from-pink-500 to-yellow-500 bg-clip-text text-transparent">Enter your errands</h2>
      <div class="space-x-2">
        <button 
          v-if="isAuthenticated"
          @click="openSaveModal"
          class="px-3 py-1 text-sm bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
        >
          Save List
        </button>
        <button 
          v-if="isAuthenticated"
          @click="toggleSavedLists"
          class="px-3 py-1 text-sm bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-colors"
        >
          {{ showSavedLists ? 'Hide Lists' : 'My Lists' }}
        </button>
        <button 
          @click="loadDefaultAddresses"
          class="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Load Examples
        </button>
      </div>
    </div>
    <!-- Saved Lists Inline Section -->
    <div v-if="showSavedLists" class="bg-gray-800 rounded-lg border border-gray-700 p-4 mb-4 animate-fade-in-down">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-bold text-white">Your Saved Lists</h3>
        <button @click="showSavedLists = false" class="text-gray-400 hover:text-white">
          <span class="sr-only">Close</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>

      <div v-if="savedListsLoading" class="text-sm text-gray-400 text-center py-4">Loading saved lists...</div>
      <div v-else-if="savedListsError" class="text-sm text-red-400 text-center py-4">{{ savedListsError }}</div>
      <div v-else-if="savedLists.length === 0" class="text-sm text-gray-400 text-center py-4">No saved lists found. Save your first list above!</div>
      
      <div v-else class="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
        <div v-for="list in savedLists" :key="list.id" class="flex justify-between items-center bg-gray-700/50 p-3 rounded hover:bg-gray-700 transition-colors group">
          <div class="flex-grow">
            <span class="text-white font-medium block">{{ list.name }}</span>
            <span class="text-xs text-gray-400">{{ list.errands.length }} errands</span>
          </div>
          <div class="flex space-x-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
            <button 
              @click="loadList(list)"
              class="p-1.5 text-green-400 hover:text-green-300 hover:bg-green-400/10 rounded transition-colors"
              title="Load List"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </button>
            <button 
              @click="editList(list)"
              class="p-1.5 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/10 rounded transition-colors"
              title="Update List"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button 
              @click="deleteList(list.id)"
              class="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded transition-colors"
              title="Delete List"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div>
      <label class="block text-sm font-medium text-white">Number of errands</label>
      <input
        type="number"
        :value="numErrands"
        @input="updateNumErrands"
        @focus="handleFieldFocus('num_errands')"
        @blur="handleFieldBlur('num_errands', numErrands)"
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
          @focus="handleFieldFocus(`errand_${index + 1}`)"
          @blur="handleFieldBlur(`errand_${index + 1}`, errands[index])"
          class="mt-1 block w-full rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          :placeholder="getDefaultAddress(index)"
        />
      </div>
    </div>
  </div>
    <!-- Saved Lists Modal -->


    <!-- Save/Edit List Modal -->
    <Teleport to="body">
      <div v-if="showSaveModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[9999]">
        <div class="bg-gray-800 p-6 rounded-lg max-w-md w-full border border-gray-700 shadow-xl">
          <h3 class="text-lg font-bold text-white mb-4">{{ isEditing ? 'Update List' : 'Save List' }}</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-white">List Name</label>
              <input 
                v-model="newListName"
                type="text" 
                placeholder="e.g., Weekly Groceries"
                class="mt-1 block w-full rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div class="flex justify-end space-x-2">
              <button 
                @click="closeSaveModal"
                class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button 
                @click="confirmSaveList"
                :disabled="!newListName || firestoreLoading"
                class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ firestoreLoading ? 'Saving...' : (isEditing ? 'Update' : 'Save') }}
              </button>
            </div>
            <div v-if="firestoreError" class="text-sm text-red-400 mt-2">{{ firestoreError }}</div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script>
import { ref, onMounted, watch, computed } from 'vue'
import { useAnalytics } from '../composables/useAnalytics'
import { useAuth } from '../composables/useAuth'
import { useFirestore } from '../composables/useFirestore'

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
  setup(props, { emit }) {
    const errandInputs = ref([])
    const autocompletes = ref([])
    const { trackFormInteract, trackFormComplete, trackAutocompleteSelect, trackButtonClick, trackError } = useAnalytics()
    const { user, isAuthenticated } = useAuth()
    const { 
      saveErrandsList, 
      getErrandsLists, 
      updateErrandsList, 
      deleteErrandsList, 
      loading: firestoreLoading, 
      error: firestoreError 
    } = useFirestore()

    // UI State
    const showSaveModal = ref(false)
    const showSavedLists = ref(false)
    const newListName = ref('')
    const savedLists = ref([])
    const savedListsLoading = ref(false)
    const savedListsError = ref(null)
    const isEditing = ref(false)
    const editingListId = ref(null)

    const initializeAutocomplete = (element, index) => {
      if (!window.google?.maps?.places || !element) return

      try {
        if (autocompletes.value[index]) {
          google.maps.event.clearInstanceListeners(element)
        }

        const autocomplete = new google.maps.places.Autocomplete(element, {
          types: ['establishment'],
          componentRestrictions: { country: 'us' },
          fields: ['formatted_address', 'name', 'geometry'],
          strictBounds: false
        })

        element.setAttribute('data-autocomplete-initialized', 'true')

        autocomplete.addListener('place_changed', () => {
          try {
            const place = autocomplete.getPlace()
            const newErrands = [...props.errands]
            
            if (place.formatted_address) {
              newErrands[index] = place.formatted_address
              trackAutocompleteSelect(`errand_${index + 1}_autocomplete`, place.formatted_address)
            } else if (place.name) {
              newErrands[index] = place.name
              trackAutocompleteSelect(`errand_${index + 1}_autocomplete`, place.name)
            }
            
            emit('update:errands', newErrands)
          } catch (error) {
            console.error('Error handling place selection:', error)
            trackError('autocomplete_selection_error', {
              error_message: error.message || 'Failed to handle place selection',
              error_type: 'autocomplete',
              context: 'errands_list',
              errand_index: index + 1
            })
          }
        })

        // Prevent form submission on enter
        element.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
          }
        })

        autocompletes.value[index] = autocomplete
      } catch (error) {
        console.error('Error initializing autocomplete:', error)
        trackError('autocomplete_init_error', {
          error_message: error.message || 'Failed to initialize autocomplete',
          error_type: 'autocomplete',
          context: 'errands_list',
          errand_index: index + 1
        })
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
      const initializeAutocompletes = () => {
        if (window.google && window.google.maps && window.google.maps.places) {
          errandInputs.value.forEach((input, index) => {
            if (input) {
              initializeAutocomplete(input, index)
            }
          })
        } else {
          // Retry after a short delay
          setTimeout(initializeAutocompletes, 100)
        }
      }

      initializeAutocompletes()
    })

    const handleFieldFocus = (fieldName) => {
      trackFormInteract(fieldName)
    }

    const handleFieldBlur = (fieldName, value) => {
      if (value !== null && value !== undefined && String(value).trim()) {
        trackFormComplete(fieldName)
      }
    }

    // Firestore Actions
    const openSaveModal = () => {
      if (!isAuthenticated.value) {
        alert('Please sign in to save lists.')
        return
      }
      isEditing.value = false
      editingListId.value = null
      newListName.value = ''
      showSaveModal.value = true
    }



    // ... (rest of setup)

    const toggleSavedLists = () => {
      if (!isAuthenticated.value) {
        alert('Please sign in to view saved lists.')
        return
      }
      showSavedLists.value = !showSavedLists.value
      if (showSavedLists.value) {
        fetchSavedLists()
      }
    }

    const fetchSavedLists = async () => {
      if (!user.value) return
      savedListsLoading.value = true
      savedListsError.value = null
      try {
        savedLists.value = await getErrandsLists(user.value.uid)
      } catch (e) {
        savedListsError.value = 'Failed to load saved lists.'
      } finally {
        savedListsLoading.value = false
      }
    }

    const confirmSaveList = async () => {
      if (!user.value || !newListName.value) return
      
      try {
        // Filter out empty errands
        const errandsToSave = props.errands.filter(e => e && e.trim() !== '')
        
        if (isEditing.value && editingListId.value) {
          await updateErrandsList(user.value.uid, editingListId.value, newListName.value, errandsToSave)
        } else {
          await saveErrandsList(user.value.uid, newListName.value, errandsToSave)
        }
        
        closeSaveModal()
        // If saved lists modal is open, refresh logic could trigger here if needed, 
        // but typically user is in "Save" flow, not "Load" flow.
        if (showSavedLists.value) {
          fetchSavedLists()
        }
      } catch (e) {
        // Error handled in composable, but UI error state passed through
      }
    }

    const closeSaveModal = () => {
      showSaveModal.value = false
      newListName.value = ''
      isEditing.value = false
      editingListId.value = null
    }

    const loadList = (list) => {
      emit('update:numErrands', list.errands.length)
      emit('update:errands', [...list.errands])
      showSavedLists.value = false
      trackButtonClick('load_saved_list')
    }

    const editList = (list) => {
      // Load list into main form first? Or just rename?
      // Requirement says "edit... saved errands". 
      // Flow: Load list -> Make Changes -> Update Existing Record.
      // Or: Edit Metadata (Name) + Content.
      // Let's assume: Edit opens the Save Modal pre-filled, effectively renaming or overwriting logic? 
      // BETTER FLOW: User loads a list, modifies it in the main UI, then clicks "Save List" -> logic detects update?
      // OR: "Edit" in modal loads the list AND sets state so next save updates this list.
      
      // Simpler approach for now: "Edit" loads the list into the UI, 
      // and we expect the user to click "Save List" again to update?
      // Actually, let's make "Edit" in the modal just rename for now? 
      // NO, user said "edit and delete". Usually implies changing content.
      
      // Let's try this flow:
      // 1. User clicks "Edit" on a list.
      // 2. We load that list into the form.
      // 3. We open the SAVE modal immediately pre-filled with that list's info, 
      //    but user probably wants to edit errands first.
      
      // Let's implement: Click "Edit" -> Loads list into UI + sets "Editing Mode" for that list ID.
      // Then "Save List" button becomes "Update List 'Name'".
      
      loadList(list) // Load data into form
      isEditing.value = true
      editingListId.value = list.id
      newListName.value = list.name
      
      // We don't open modal immediately, we let them edit on the main screen. 
      // But we need to signal that they are editing.
      // Let's open the save modal immediately to let them confirm the name/intent?
      // No, that hinders editing errands.
      
      // Let's just keep it simple: "Edit" button in modal -> Opens Save Modal with "Update" intent,
      // assuming they might have already loaded it? 
      // Actually, if they want to edit the CONTENT, they should Load -> Modify -> Update.
      // So "Load" does that. 
      // What if "Edit" just renames? 
      
      // Let's stick to the plan: "Edit" button loops them into the "Update" flow.
      // For best UX: "Edit" loads the list and opens the Save modal pre-filled, allowing rename or just confirm update.
      // But they likely want to change the errands.
      
      // Revised "Edit" Flow:
      // Click "Edit" -> Loads list into main UI changes. 
      // Open Save modal to confirm "Yes, I am editing this list".
      showSavedLists.value = false
      openSaveModal()
    }

    const deleteList = async (listId) => {
      if (!confirm('Are you sure you want to delete this list?')) return
      try {
        await deleteErrandsList(user.value.uid, listId)
        fetchSavedLists() // Refresh list
      } catch (e) {
        alert('Failed to delete list.')
      }
    }

    return {
      errandInputs,
      updateNumErrands(event) {
        const value = parseInt(event.target.value)
        emit('update:numErrands', value)
      },
      updateErrand(index, value) {
        const newErrands = [...(props.errands || [])]
        newErrands[index] = value
        emit('update:errands', newErrands)
      },
      getDefaultAddress(index) {
        return index < PLACEHOLDER_ADDRESSES.length ? PLACEHOLDER_ADDRESSES[index] : "Enter address"
      },
      loadDefaultAddresses() {
        trackButtonClick('load_examples')
        emit('update:numErrands', TEST_ADDRESSES.length)
        emit('update:errands', [...TEST_ADDRESSES])
      },
      handleFieldFocus,
      handleFieldBlur,
      isAuthenticated,
      // UI Data/Methods
      showSaveModal,
      showSaveModal,
      showSavedLists,
      toggleSavedLists,
      newListName,
      savedLists,
      savedListsLoading,
      savedListsError,
      firestoreLoading,
      firestoreError,
      openSaveModal,
      openSaveModal,
      closeSaveModal,
      confirmSaveList,
      loadList,
      editList,
      deleteList,
      isEditing
    }
  }
}
</script> 