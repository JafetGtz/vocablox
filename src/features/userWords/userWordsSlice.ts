import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface UserWord {
  id: string
  palabra: string
  significado: string
  ejemplo?: string
  createdAt: string
  updatedAt: string
}

export interface UserWordsState {
  words: UserWord[]
  isEnabled: boolean
  loading: boolean
  error: string | null
}

export interface CreateUserWordPayload {
  palabra: string
  significado: string
  ejemplo?: string
}

export interface UpdateUserWordPayload {
  id: string
  palabra?: string
  significado?: string
  ejemplo?: string
}

const initialState: UserWordsState = {
  words: [],
  isEnabled: true,
  loading: false,
  error: null,
}

const userWordsSlice = createSlice({
  name: 'userWords',
  initialState,
  reducers: {
    addUserWord: (state, action: PayloadAction<CreateUserWordPayload>) => {
      const newWord: UserWord = {
        id: Date.now().toString(),
        ...action.payload,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      state.words.push(newWord)
      state.error = null
    },

    updateUserWord: (state, action: PayloadAction<UpdateUserWordPayload>) => {
      const { id, ...updateData } = action.payload
      const wordIndex = state.words.findIndex(word => word.id === id)

      if (wordIndex !== -1) {
        state.words[wordIndex] = {
          ...state.words[wordIndex],
          ...updateData,
          updatedAt: new Date().toISOString(),
        }
        state.error = null
      } else {
        state.error = 'Palabra no encontrada'
      }
    },

    deleteUserWord: (state, action: PayloadAction<string>) => {
      state.words = state.words.filter(word => word.id !== action.payload)
      state.error = null
    },

    toggleUserWordsEnabled: (state) => {
      state.isEnabled = !state.isEnabled
    },

    setUserWordsEnabled: (state, action: PayloadAction<boolean>) => {
      state.isEnabled = action.payload
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },

    clearError: (state) => {
      state.error = null
    },
  },
})

export const {
  addUserWord,
  updateUserWord,
  deleteUserWord,
  toggleUserWordsEnabled,
  setUserWordsEnabled,
  setLoading,
  setError,
  clearError,
} = userWordsSlice.actions

export default userWordsSlice.reducer