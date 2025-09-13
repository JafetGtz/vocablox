// src/store/slices/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { User } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  initialized: boolean
}

const initialState: AuthState = {
  user: null,
  initialized: false
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      state.initialized = true
    },
    clearUser: state => {
      state.user = null
      state.initialized = true
    },
    // opcional: si quieres marcar inicializado sin cambiar user
    setInitialized: state => {
      state.initialized = true
    }
  }
})

export const { setUser, clearUser, setInitialized } = authSlice.actions
export default authSlice.reducer
