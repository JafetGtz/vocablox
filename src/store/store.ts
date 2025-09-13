import {configureStore} from '@reduxjs/toolkit'
import {persistStore, persistReducer} from 'redux-persist'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {combineReducers} from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import settingsReducer from './slices/settingsSlice'
import notesReducer from '../features/notes/models/notesSlice'

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['settings', 'notes'] // Persist settings and notes
}

const rootReducer = combineReducers({
  auth: authReducer,
  settings: settingsReducer,
  notes: notesReducer
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
