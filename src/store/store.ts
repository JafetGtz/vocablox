import {configureStore} from '@reduxjs/toolkit'
import {persistStore, persistReducer} from 'redux-persist'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {combineReducers} from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import settingsReducer from './slices/settingsSlice'
import notesReducer from '../features/notes/models/notesSlice'
import personalNotesReducer from '../features/notes/models/personalNotesSlice'
import flashQuizReducer from '../features/games/flashQuiz/flashQuizSlice'
import hangmanReducer from '../features/games/hangman/hangmanSlice'
import memorandumReducer from '../features/games/memorandum/memorandumSlice'
import userWordsReducer from '../features/userWords/userWordsSlice'
import focusReducer from '../features/focus/focusSlice'

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['settings', 'notes', 'personalNotes', 'userWords'] // Persist settings, notes, personal notes, and user words
}

const rootReducer = combineReducers({
  auth: authReducer,
  settings: settingsReducer,
  notes: notesReducer,
  personalNotes: personalNotesReducer,
  flashQuiz: flashQuizReducer,
  hangman: hangmanReducer,
  memorandum: memorandumReducer,
  userWords: userWordsReducer,
  focus: focusReducer
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE']
      }
    })
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
