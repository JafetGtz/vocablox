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