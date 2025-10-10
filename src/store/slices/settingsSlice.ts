// src/store/slices/settingsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { UserSettings } from '@/services/auth/settingsServices'

export interface SettingsState {
    data: Partial<UserSettings>
    loading: boolean
    error: string | null
    customBackgrounds: Array<{id: string, name: string, type: 'image', value: any, preview: any}>
    wizard: {
        currentStep: number
        totalSteps: number
        isCompleted: boolean
        saving: boolean
        saveError: string | null
    }
}

const initialState: SettingsState = {
    data: {
        background: 'azul',
        nickname: '',
        motivational: '',
        categories: [],
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        weekly_words_target: 10,
        bursts_per_day: 1,
        active_windows: ['morning'],
        window_times: { morning: '08:00' },
        streak_goal_days: 7,
        daily_words: 2,
        words_per_burst: 2,
        wizard_completed: false,
        // Text customization settings
        text_colors: {
            word: '#FFFFFF',
            meaning: '#E0E0E0',
            example: '#CCCCCC'
        },
        text_sizes: {
            word: 'large',
            meaning: 'medium',
            example: 'small'
        },
        text_visibility: {
            word: true,
            meaning: true,
            example: true
        }
    },
    loading: false,
    error: null,
    customBackgrounds: [],
    wizard: {
        currentStep: 0,
        totalSteps: 8,
        isCompleted: false,
        saving: false,
        saveError: null,
    }
}

const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        updatePartial: (state, action: PayloadAction<Partial<UserSettings>>) => {
            state.data = { ...state.data, ...action.payload }
        },
        loadStart: (state) => {
            state.loading = true
            state.error = null
        },
        loadSuccess: (state, action: PayloadAction<UserSettings>) => {
            state.data = action.payload
            state.wizard.isCompleted = action.payload.wizard_completed || false
            state.loading = false
            state.error = null
            // Preserve customBackgrounds when loading from server (they're stored locally only)
            // Don't overwrite customBackgrounds that were loaded from AsyncStorage
        },
        loadFailure: (state, action: PayloadAction<string>) => {
            state.loading = false
            state.error = action.payload
        },
        saveStart: (state) => {
            state.loading = true
            state.error = null
        },
        saveSuccess: (state, action: PayloadAction<UserSettings>) => {
            state.data = action.payload
            state.loading = false
            state.error = null
            // Preserve customBackgrounds when saving to server (they're stored locally only)
            // Don't overwrite customBackgrounds that were loaded from AsyncStorage
        },
        saveFailure: (state, action: PayloadAction<string>) => {
            state.loading = false
            state.error = action.payload
        },
        clearSettings: (state) => {
            state.data = initialState.data
            state.loading = false
            state.error = null
            state.customBackgrounds = []
            state.wizard = initialState.wizard
        },
        // Wizard actions
        nextWizardStep: (state) => {
            if (state.wizard.currentStep < state.wizard.totalSteps - 1) {
                state.wizard.currentStep += 1
            }
        },
        prevWizardStep: (state) => {
            if (state.wizard.currentStep > 0) {
                state.wizard.currentStep -= 1
            }
        },
        setWizardStep: (state, action: PayloadAction<number>) => {
            const step = action.payload
            if (step >= 0 && step < state.wizard.totalSteps) {
                state.wizard.currentStep = step
            }
        },
        completeWizard: (state) => {
            state.wizard.isCompleted = true
            state.data.wizard_completed = true
        },
        resetWizard: (state) => {
            state.wizard.currentStep = 0
            state.wizard.isCompleted = false
            state.wizard.saving = false
            state.wizard.saveError = null
            state.data.wizard_completed = false
        },
        // Wizard-specific save actions
        wizardSaveStart: (state) => {
            state.wizard.saving = true
            state.wizard.saveError = null
        },
        wizardSaveSuccess: (state, action: PayloadAction<UserSettings>) => {
            state.data = action.payload
            state.wizard.saving = false
            state.wizard.saveError = null
            // Preserve customBackgrounds when saving wizard to server (they're stored locally only)
            // Don't overwrite customBackgrounds that were loaded from AsyncStorage
        },
        wizardSaveFailure: (state, action: PayloadAction<string>) => {
            state.wizard.saving = false
            state.wizard.saveError = action.payload
        },
        // Settings-specific actions
        updateBackground: (state, action: PayloadAction<string>) => {
            state.data.background = action.payload
        },
        toggleCategory: (state, action: PayloadAction<string>) => {
            const category = action.payload
            const categories = state.data.categories || []
            const exists = categories.includes(category)
            if (exists) {
                state.data.categories = categories.filter(c => c !== category)
            } else {
                state.data.categories = [...categories, category]
            }
        },
        updateCategories: (state, action: PayloadAction<string[]>) => {
            state.data.categories = action.payload
        },
        updateWeeklyTarget: (state, action: PayloadAction<10 | 30 | 40 | 50>) => {
            state.data.weekly_words_target = action.payload
            // Recalculate derived values
            const daily_words = Math.ceil(action.payload / 7)
            const words_per_burst = Math.ceil(daily_words / state.data.bursts_per_day)
            state.data.daily_words = daily_words
            state.data.words_per_burst = words_per_burst
        },
        updateBurstsAndTimes: (state, action: PayloadAction<{
            bursts_per_day: 1 | 2 | 3
            active_windows: ('morning' | 'afternoon' | 'evening')[]
            window_times: {
                morning?: string
                afternoon?: string
                evening?: string
            }
        }>) => {
            const { bursts_per_day, active_windows, window_times } = action.payload
            state.data.bursts_per_day = bursts_per_day
            state.data.active_windows = active_windows
            state.data.window_times = window_times
            // Recalculate words_per_burst
            const daily_words = Math.ceil(state.data.weekly_words_target / 7)
            state.data.words_per_burst = Math.ceil(daily_words / bursts_per_day)
        },
        updateStreakGoal: (state, action: PayloadAction<number>) => {
            state.data.streak_goal_days = action.payload
        },
        updateProfile: (state, action: PayloadAction<{
            nickname?: string
            timezone?: string
            motivational?: string
        }>) => {
            const { nickname, timezone, motivational } = action.payload
            if (nickname !== undefined) state.data.nickname = nickname
            if (timezone !== undefined) state.data.timezone = timezone
            if (motivational !== undefined) state.data.motivational = motivational
        },
        // Custom background actions
        addCustomBackground: (state, action: PayloadAction<{id: string, name: string, type: 'image', value: any, preview: any}>) => {
            state.customBackgrounds.push(action.payload)
        },
        removeCustomBackground: (state, action: PayloadAction<string>) => {
            state.customBackgrounds = state.customBackgrounds.filter(bg => bg.id !== action.payload)
        },
        setCustomBackgrounds: (state, action: PayloadAction<Array<{id: string, name: string, type: 'image', value: any, preview: any}>>) => {
            state.customBackgrounds = action.payload
        },
        // Text customization actions
        updateTextColor: (state, action: PayloadAction<{element: 'word' | 'meaning' | 'example', color: string}>) => {
            const { element, color } = action.payload
            if (!state.data.text_colors) {
                state.data.text_colors = {
                    word: '#FFFFFF',
                    meaning: '#E0E0E0',
                    example: '#CCCCCC'
                }
            }
            state.data.text_colors[element] = color
        },
        updateTextSize: (state, action: PayloadAction<{element: 'word' | 'meaning' | 'example', size: 'small' | 'medium' | 'large'}>) => {
            const { element, size } = action.payload
            if (!state.data.text_sizes) {
                state.data.text_sizes = {
                    word: 'large',
                    meaning: 'medium',
                    example: 'small'
                }
            }
            state.data.text_sizes[element] = size
        },
        updateTextVisibility: (state, action: PayloadAction<{element: 'word' | 'meaning' | 'example', visible: boolean}>) => {
            const { element, visible } = action.payload
            if (!state.data.text_visibility) {
                state.data.text_visibility = {
                    word: true,
                    meaning: true,
                    example: true
                }
            }
            state.data.text_visibility[element] = visible
        },
    },
})

export const {
    updatePartial,
    loadStart,
    loadSuccess,
    loadFailure,
    saveStart,
    saveSuccess,
    saveFailure,
    clearSettings,
    // Wizard actions
    nextWizardStep,
    prevWizardStep,
    setWizardStep,
    completeWizard,
    resetWizard,
    wizardSaveStart,
    wizardSaveSuccess,
    wizardSaveFailure,
    // Settings actions
    updateBackground,
    toggleCategory,
    updateCategories,
    updateWeeklyTarget,
    updateBurstsAndTimes,
    updateStreakGoal,
    updateProfile,
    // Custom background actions
    addCustomBackground,
    removeCustomBackground,
    setCustomBackgrounds,
    // Text customization actions
    updateTextColor,
    updateTextSize,
    updateTextVisibility,
} = settingsSlice.actions

export default settingsSlice.reducer
