import { RootState } from '@/store/store'
import { createSelector } from '@reduxjs/toolkit'

// Base selectors
export const selectNotesState = (state: RootState) => state.notes

export const selectNotes = (state: RootState) => state.notes.notes
export const selectCollections = (state: RootState) => state.notes.collections
export const selectNotesLoading = (state: RootState) => state.notes.loading
export const selectNotesError = (state: RootState) => state.notes.error

// Memoized selectors
export const selectNotesByCollection = createSelector(
  [selectNotes, (state: RootState, collectionId: string) => collectionId],
  (notes, collectionId) => notes.filter(note => note.collectionId === collectionId)
)

export const selectFavoriteNotes = createSelector(
  [selectNotes],
  (notes) => notes.filter(note => note.isFavorite)
)

export const selectCollectionsWithCount = createSelector(
  [selectCollections, selectNotes],
  (collections, notes) => 
    collections.map(collection => ({
      ...collection,
      count: notes.filter(note => note.collectionId === collection.id).length
    }))
)

export const selectNoteById = createSelector(
  [selectNotes, (state: RootState, noteId: string) => noteId],
  (notes, noteId) => notes.find(note => note.id === noteId)
)

export const selectCollectionById = createSelector(
  [selectCollections, (state: RootState, collectionId: string) => collectionId],
  (collections, collectionId) => collections.find(collection => collection.id === collectionId)
)

// Personal Notes selectors
export const selectPersonalNotesState = (state: RootState) => state.personalNotes
export const selectPersonalNotes = (state: RootState) => state.personalNotes.personalNotes
export const selectPersonalNotesLoading = (state: RootState) => state.personalNotes.loading
export const selectPersonalNotesError = (state: RootState) => state.personalNotes.error

// Memoized selectors for personal notes
export const selectPersonalNotesForWord = createSelector(
  [selectPersonalNotes, (state: RootState, word: string) => word],
  (personalNotes, word) => personalNotes.filter(note => note.word.toLowerCase() === word.toLowerCase())
)

export const selectPersonalNoteById = createSelector(
  [selectPersonalNotes, (state: RootState, noteId: string) => noteId],
  (personalNotes, noteId) => personalNotes.find(note => note.id === noteId)
)

export const selectPersonalNotesCount = createSelector(
  [selectPersonalNotes],
  (personalNotes) => personalNotes.length
)

export const selectPersonalNotesByDateDesc = createSelector(
  [selectPersonalNotes],
  (personalNotes) => [...personalNotes].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
)

export const selectFilteredPersonalNotes = createSelector(
  [selectPersonalNotesByDateDesc, (state: RootState, searchTerm: string) => searchTerm],
  (personalNotes, searchTerm) => {
    if (!searchTerm.trim()) {
      return personalNotes
    }

    const normalizedSearchTerm = searchTerm.toLowerCase()
    return personalNotes.filter(note =>
      note.title.toLowerCase().includes(normalizedSearchTerm) ||
      note.content.toLowerCase().includes(normalizedSearchTerm)
    )
  }
)