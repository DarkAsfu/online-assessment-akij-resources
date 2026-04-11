import { createSlice } from '@reduxjs/toolkit'

// Helper functions for localStorage
const getStoredAuthState = () => {
  if (typeof window === 'undefined') return null
  try {
    const stored = localStorage.getItem('authState')
    return stored ? JSON.parse(stored) : null
  } catch (error) {
    console.error('Error reading auth state from localStorage:', error)
    return null
  }
}

const saveAuthState = (state) => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(
      'authState',
      JSON.stringify({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      })
    )
  } catch (error) {
    console.error('Error saving auth state to localStorage:', error)
  }
}

const storedState = getStoredAuthState()

const initialState = {
  user: storedState?.user || null,
  token: storedState?.token || null,
  isAuthenticated: storedState?.isAuthenticated || false,
  isLoading: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload
    },
    setUser: (state, action) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
      state.isLoading = false
      saveAuthState(state)
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.isLoading = false
      localStorage.removeItem('token')
      localStorage.removeItem('authState')
    },
  },
})

export const { setLoading, setUser, logout } = authSlice.actions
export default authSlice.reducer