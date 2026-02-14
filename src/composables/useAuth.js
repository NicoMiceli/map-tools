import { ref } from 'vue'
import { auth } from '../firebaseConfig'
import { GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged } from 'firebase/auth'

const user = ref(null)
const isAuthenticated = ref(false)
const loading = ref(true)

// Check for bypass on load
const urlParams = new URLSearchParams(window.location.search)
const bypassWithMellon = urlParams.get('bypass') === 'mellon'

if (bypassWithMellon) {
    console.log('Authentication bypassed with Mellon')
    isAuthenticated.value = true
    loading.value = false
    // Mock user for bypass
    user.value = {
        displayName: 'Gandalf',
        email: 'gandalf@middleearth.com',
        photoURL: 'https://ui-avatars.com/api/?name=Gandalf&background=random'
    }
} else {
    // Listen for Firebase auth state changes
    onAuthStateChanged(auth, (firebaseUser) => {
        user.value = firebaseUser
        isAuthenticated.value = !!firebaseUser
        loading.value = false
    })
}

export function useAuth() {
    const login = async () => {
        const provider = new GoogleAuthProvider()
        try {
            await signInWithPopup(auth, provider)
        } catch (error) {
            console.error('Login failed:', error)
            throw error
        }
    }

    const logout = async () => {
        try {
            await firebaseSignOut(auth)
            if (bypassWithMellon) {
                // Remove the bypass parameter to truly sign out
                const newUrl = window.location.pathname
                window.history.pushState({}, '', newUrl)
                window.location.reload()
            }
        } catch (error) {
            console.error('Logout failed:', error)
        }
    }

    return {
        user,
        isAuthenticated,
        loading,
        login,
        logout
    }
}
