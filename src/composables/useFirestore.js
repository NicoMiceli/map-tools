import { ref } from 'vue';
import { db } from '../firebaseConfig';
import {
    collection,
    addDoc,
    getDocs,
    doc,
    deleteDoc,
    updateDoc,
    query,
    where,
    serverTimestamp
} from 'firebase/firestore';

export function useFirestore() {
    const loading = ref(false);
    const error = ref(null);

    /**
     * Create a new errands list
     * @param {string} userId - Auth user ID
     * @param {string} listName - Display name for the list
     * @param {Array} errands - Array of errand strings
     */
    const saveErrandsList = async (userId, listName, errands) => {
        loading.value = true;
        error.value = null;
        try {
            const docRef = await addDoc(collection(db, 'users', userId, 'errands_lists'), {
                name: listName,
                errands: errands,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });
            return { id: docRef.id, name: listName, errands };
        } catch (e) {
            console.error('Error saving list:', e);
            error.value = e.message;
            throw e;
        } finally {
            loading.value = false;
        }
    };

    /**
     * Get all errands lists for a user
     * @param {string} userId 
     */
    const getErrandsLists = async (userId) => {
        loading.value = true;
        error.value = null;
        try {
            const q = query(collection(db, 'users', userId, 'errands_lists'));
            const querySnapshot = await getDocs(q);
            const lists = [];
            querySnapshot.forEach((doc) => {
                lists.push({ id: doc.id, ...doc.data() });
            });
            return lists;
        } catch (e) {
            console.error('Error fetching lists:', e);
            error.value = e.message;
            throw e;
        } finally {
            loading.value = false;
        }
    };

    /**
     * Update an existing errands list
     * @param {string} userId 
     * @param {string} listId 
     * @param {string} listName 
     * @param {Array} errands 
     */
    const updateErrandsList = async (userId, listId, listName, errands) => {
        loading.value = true;
        error.value = null;
        try {
            const docRef = doc(db, 'users', userId, 'errands_lists', listId);
            await updateDoc(docRef, {
                name: listName,
                errands: errands,
                updatedAt: serverTimestamp()
            });
            return { id: listId, name: listName, errands };
        } catch (e) {
            console.error('Error updating list:', e);
            error.value = e.message;
            throw e;
        } finally {
            loading.value = false;
        }
    };

    /**
     * Delete an errands list
     * @param {string} userId 
     * @param {string} listId 
     */
    const deleteErrandsList = async (userId, listId) => {
        loading.value = true;
        error.value = null;
        try {
            await deleteDoc(doc(db, 'users', userId, 'errands_lists', listId));
        } catch (e) {
            console.error('Error deleting list:', e);
            error.value = e.message;
            throw e;
        } finally {
            loading.value = false;
        }
    };

    return {
        loading,
        error,
        saveErrandsList,
        getErrandsLists,
        updateErrandsList,
        deleteErrandsList
    };
}
