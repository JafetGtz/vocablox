import { createSlice, PayloadAction, nanoid } from '@reduxjs/toolkit'
import {
  PersonalNotesState,
  PersonalNote,
  CreatePersonalNotePayload,
  UpdatePersonalNotePayload
} from './types'

const initialState: PersonalNotesState = {
  personalNotes: [],
  loading: false,
  error: null,
}

const personalNotesSlice = createSlice({
  name: 'personalNotes',
  initialState,
  reducers: {
    // Loading states
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    clearError: (state) => {
      state.error = null
    },

    // Personal Notes CRUD
    addPersonalNote: (state, action: PayloadAction<CreatePersonalNotePayload>) => {
      const newNote: PersonalNote = {
        id: nanoid(),
        ...action.payload,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      state.personalNotes.push(newNote)
    },

    updatePersonalNote: (state, action: PayloadAction<UpdatePersonalNotePayload>) => {
      const { id, ...updates } = action.payload
      const noteIndex = state.personalNotes.findIndex(note => note.id === id)
      if (noteIndex !== -1) {
        state.personalNotes[noteIndex] = {
          ...state.personalNotes[noteIndex],
          ...updates,
          updatedAt: new Date().toISOString(),
        }
      }
    },

    deletePersonalNote: (state, action: PayloadAction<string>) => {
      state.personalNotes = state.personalNotes.filter(note => note.id !== action.payload)
    },

    // Get notes for a specific word
    getPersonalNotesForWord: (state, action: PayloadAction<string>) => {
      // This is handled by selectors, but we can add any specific logic here if needed
      state.error = null
    },

    // Bulk operations
    clearAllPersonalNotes: (state) => {
      state.personalNotes = []
    },

    // Sync operations (for future use)
    syncPersonalNotesStart: (state) => {
      state.loading = true
      state.error = null
    },

    syncPersonalNotesSuccess: (state, action: PayloadAction<PersonalNote[]>) => {
      state.personalNotes = action.payload
      state.loading = false
      state.error = null
    },

    syncPersonalNotesFailure: (state, action: PayloadAction<string>) => {
      state.loading = false
      state.error = action.payload
    },
  },
})

export const {
  setLoading,
  setError,
  clearError,
  addPersonalNote,
  updatePersonalNote,
  deletePersonalNote,
  getPersonalNotesForWord,
  clearAllPersonalNotes,
  syncPersonalNotesStart,
  syncPersonalNotesSuccess,
  syncPersonalNotesFailure,
} = personalNotesSlice.actions

export default personalNotesSlice.reducer