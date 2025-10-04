import { RootState } from '@/store/store'
import { createSelector } from '@reduxjs/toolkit'

// Base selectors
export const selectUserWordsState = (state: RootState) => state.userWords

export const selectUserWords = (state: RootState) => state.userWords.words
export const selectUserWordsEnabled = (state: RootState) => state.userWords.isEnabled
export const selectUserWordsFrequency = (state: RootState) => state.userWords.frequency
export const selectUserWordsLoading = (state: RootState) => state.userWords.loading
export const selectUserWordsError = (state: RootState) => state.userWords.error

// Memoized selectors
export const selectUserWordsByDateDesc = createSelector(
  [selectUserWords],
  (words) => [...words].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
)

export const selectUserWordById = createSelector(
  [selectUserWords, (state: RootState, wordId: string) => wordId],
  (words, wordId) => words.find(word => word.id === wordId)
)

export const selectUserWordsCount = createSelector(
  [selectUserWords],
  (words) => words.length
)

export const selectEnabledUserWords = createSelector(
  [selectUserWords, selectUserWordsEnabled],
  (words, isEnabled) => isEnabled ? words : []
)

export const selectFilteredUserWords = createSelector(
  [selectUserWordsByDateDesc, (state: RootState, searchTerm: string) => searchTerm],
  (words, searchTerm) => {
    if (!searchTerm.trim()) {
      return words
    }

    const normalizedSearchTerm = searchTerm.toLowerCase()
    return words.filter(word =>
      word.palabra.toLowerCase().includes(normalizedSearchTerm) ||
      word.significado.toLowerCase().includes(normalizedSearchTerm) ||
      (word.ejemplo && word.ejemplo.toLowerCase().includes(normalizedSearchTerm))
    )
  }
)