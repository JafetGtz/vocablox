import { createSlice, PayloadAction, nanoid } from '@reduxjs/toolkit'
import {
  NotesState,
  Note,
  Collection,
  CreateNotePayload,
  UpdateNotePayload,
  CreateCollectionPayload,
  UpdateCollectionPayload
} from './types'
import { defaultCollections } from './defaultData'

const initialState: NotesState = {
  notes: [],
  collections: defaultCollections,
  loading: false,
  error: null,
}

const notesSlice = createSlice({
  name: 'notes',
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

    // Notes CRUD
    addNote: (state, action: PayloadAction<CreateNotePayload>) => {
      const newNote: Note = {
        id: nanoid(),
        ...action.payload,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isFavorite: false,
        tags: [],
      }
      state.notes.push(newNote)
    },

    updateNote: (state, action: PayloadAction<UpdateNotePayload>) => {
      const { id, ...updates } = action.payload
      const noteIndex = state.notes.findIndex(note => note.id === id)
      if (noteIndex !== -1) {
        state.notes[noteIndex] = {
          ...state.notes[noteIndex],
          ...updates,
          updatedAt: new Date().toISOString(),
        }
      }
    },

    deleteNote: (state, action: PayloadAction<string>) => {
      state.notes = state.notes.filter(note => note.id !== action.payload)
    },

    toggleNoteFavorite: (state, action: PayloadAction<string>) => {
      const noteIndex = state.notes.findIndex(note => note.id === action.payload)
      if (noteIndex !== -1) {
        state.notes[noteIndex].isFavorite = !state.notes[noteIndex].isFavorite
        state.notes[noteIndex].updatedAt = new Date().toISOString()
      }
    },

    moveNoteToCollection: (state, action: PayloadAction<{ noteId: string; collectionId: string }>) => {
      const noteIndex = state.notes.findIndex(note => note.id === action.payload.noteId)
      if (noteIndex !== -1) {
        state.notes[noteIndex].collectionId = action.payload.collectionId
        state.notes[noteIndex].updatedAt = new Date().toISOString()
      }
    },

    // Collections CRUD
    addCollection: (state, action: PayloadAction<CreateCollectionPayload>) => {
      const newCollection: Collection = {
        id: nanoid(),
        ...action.payload,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      state.collections.push(newCollection)
    },

    updateCollection: (state, action: PayloadAction<UpdateCollectionPayload>) => {
      const { id, ...updates } = action.payload
      const collectionIndex = state.collections.findIndex(collection => collection.id === id)
      if (collectionIndex !== -1) {
        state.collections[collectionIndex] = {
          ...state.collections[collectionIndex],
          ...updates,
          updatedAt: new Date().toISOString(),
        }
      }
    },

    deleteCollection: (state, action: PayloadAction<string>) => {
      // Move all notes from this collection to the first default collection
      const defaultCollectionId = state.collections[0]?.id
      if (defaultCollectionId) {
        state.notes.forEach(note => {
          if (note.collectionId === action.payload) {
            note.collectionId = defaultCollectionId
            note.updatedAt = new Date().toISOString()
          }
        })
      }
      // Remove the collection
      state.collections = state.collections.filter(collection => collection.id !== action.payload)
    },

    // Bulk operations
    clearAllNotes: (state) => {
      state.notes = []
    },

    clearAllCollections: (state) => {
      state.collections = defaultCollections
      // Move all notes to the first default collection
      const defaultCollectionId = defaultCollections[0].id
      state.notes.forEach(note => {
        note.collectionId = defaultCollectionId
        note.updatedAt = new Date().toISOString()
      })
    },

    // Sync operations (for future Supabase integration)
    syncNotesStart: (state) => {
      state.loading = true
      state.error = null
    },

    syncNotesSuccess: (state, action: PayloadAction<{ notes: Note[]; collections: Collection[] }>) => {
      state.notes = action.payload.notes
      state.collections = action.payload.collections
      state.loading = false
      state.error = null
    },

    syncNotesFailure: (state, action: PayloadAction<string>) => {
      state.loading = false
      state.error = action.payload
    },
  },
})

export const {
  setLoading,
  setError,
  clearError,
  addNote,
  updateNote,
  deleteNote,
  toggleNoteFavorite,
  moveNoteToCollection,
  addCollection,
  updateCollection,
  deleteCollection,
  clearAllNotes,
  clearAllCollections,
  syncNotesStart,
  syncNotesSuccess,
  syncNotesFailure,
} = notesSlice.actions

export default notesSlice.reducer