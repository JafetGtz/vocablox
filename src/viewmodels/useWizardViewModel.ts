// src/viewmodels/useWizardViewModel.ts
import { useSelector, useDispatch } from 'react-redux'
import { useNavigation, CommonActions } from '@react-navigation/native'
import { useMemo, useCallback, useRef, useEffect } from 'react'
import { RootState } from '@/store/store'
import {
  nextWizardStep,
  prevWizardStep,
  setWizardStep,
  completeWizard,
  resetWizard,
  updateBackground,
  toggleCategory,
  updateWeeklyTarget,
  updateBurstsAndTimes,
  updateStreakGoal,
  updateProfile,
  wizardSaveStart,
  wizardSaveSuccess,
  wizardSaveFailure
} from '@/store/slices/settingsSlice'
import { upsertSettings } from '@/services/auth/settingsServices'
import { useAuth } from './useAuthViewModel'
import NotificationModule from '@/services/notificationService'
import { supabase } from '@/services/supebase'

export const useWizardViewModel = () => {
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const { user } = useAuth()
  const { wizard, data, loading, error } = useSelector((state: RootState) => state.settings)
  
  // Extract wizard-specific saving state
  const wizardSaving = wizard.saving
  const wizardSaveError = wizard.saveError
  
  // Use refs to avoid re-renders when these values change
  const userRef = useRef(user)
  const dataRef = useRef(data)
  
  useEffect(() => {
    userRef.current = user
  }, [user])
  
  useEffect(() => {
    dataRef.current = data
  }, [data])

  const screenMap = [
    'StepWelcome',
    'StepBackground',
    'StepNameMotivation',
    'StepCategories',
    'StepWeeklyTarget',
    'StepBurstsAndTimes',
    'StepStreakGoal',
    'StepSummary'
  ]

  const navigationHelpers = useMemo(() => ({
    canGoNext: wizard.currentStep < wizard.totalSteps - 1,
    canGoBack: wizard.currentStep > 0,
    isLastStep: wizard.currentStep === wizard.totalSteps - 1
  }), [wizard.currentStep, wizard.totalSteps])

  const nextStep = useCallback(() => {
    if (wizard.currentStep < wizard.totalSteps - 1) {
      dispatch(nextWizardStep())
    }
  }, [wizard.currentStep, wizard.totalSteps, dispatch])

  const prevStep = useCallback(() => {
    if (wizard.currentStep > 0) {
      dispatch(prevWizardStep())
    }
  }, [wizard.currentStep, dispatch])

  const goToStep = useCallback((step: number) => {
    if (step >= 0 && step < wizard.totalSteps) {
      dispatch(setWizardStep(step))
    }
  }, [wizard.totalSteps, dispatch])

  const setBackground = useCallback((background: string) => {
    dispatch(updateBackground(background))
  }, [dispatch])

  const setCategories = useCallback((categories: string[]) => {
    const currentCategories = dataRef.current.categories || []
    currentCategories.forEach(cat => dispatch(toggleCategory(cat)))
    categories.forEach(cat => dispatch(toggleCategory(cat)))
  }, [dispatch])

  const toggleCategorySelection = useCallback((categoryId: string) => {
    dispatch(toggleCategory(categoryId))
  }, [dispatch])

  const setWeeklyTarget = useCallback((target: 10 | 30 | 40 | 50) => {
    dispatch(updateWeeklyTarget(target))
  }, [dispatch])

  const setBurstsAndTimes = useCallback((config: {
    bursts_per_day: 1 | 2 | 3
    active_windows: ('morning' | 'afternoon' | 'evening')[]
    window_times: {
      morning?: string
      afternoon?: string
      evening?: string
    }
  }) => {
    dispatch(updateBurstsAndTimes(config))
  }, [dispatch])

  const setStreakGoal = useCallback((days: number) => {
    dispatch(updateStreakGoal(days))
  }, [dispatch])

  const setProfile = useCallback((profile: {
    nickname?: string
    timezone?: string
    motivational?: string
  }) => {
    dispatch(updateProfile(profile))
  }, [dispatch])

  const saveAndComplete = useCallback(async () => {
    const currentUser = userRef.current
    const currentData = dataRef.current

    if (!currentUser) {
      console.log('No user found')
      return false
    }

    try {
      dispatch(wizardSaveStart())

      const settingsToSave = {
        ...currentData,
        user_id: currentUser.id,
        wizard_completed: true
      }

      console.log('Saving settings:', JSON.stringify(settingsToSave, null, 2))

      const result = await upsertSettings(settingsToSave as any)
      console.log('Settings saved successfully:', result)

      dispatch(completeWizard())
      dispatch(wizardSaveSuccess(result))

      // Programar notificaciones después de completar wizard
      try {
        console.log('Setting up notifications...')

        // Verificar permisos
        const canSchedule = await NotificationModule.checkExactAlarmPermission()
        if (!canSchedule) {
          console.log('Requesting exact alarm permission...')
          await NotificationModule.requestExactAlarmPermission()
        }

        // Solicitar ignorar optimización de batería
        await NotificationModule.requestIgnoreBatteryOptimization()

        // Obtener palabras de Supabase
        const { data: words, error: wordsError } = await supabase
          .from('words')
          .select('*')
          .in('category', result.categories || [])
          .limit(100)

        if (!wordsError && words && words.length > 0) {
          await NotificationModule.saveWords(words)
          console.log(`Saved ${words.length} words to native storage`)
        }

        // Programar notificaciones
        const notifResult = await NotificationModule.scheduleNotifications({
          categories: result.categories || [],
          active_windows: result.active_windows || ['morning'],
          window_times: result.window_times || { morning: '08:00' },
          words_per_burst: result.words_per_burst || 2,
          nickname: result.nickname || 'Usuario'
        })

        console.log('Notifications scheduled:', notifResult)
      } catch (notifError) {
        console.error('Error setting up notifications:', notifError)
        // No bloqueamos el flujo si fallan las notificaciones
      }

      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Main' }],
        })
      )

      return true
    } catch (error) {
      console.error('Error in saveAndComplete:', error)
      console.error('Error type:', typeof error)
      console.error('Error details:', JSON.stringify(error, null, 2))

      let errorMessage = 'Error saving settings'
      if (error instanceof Error) {
        errorMessage = error.message
      } else if (typeof error === 'string') {
        errorMessage = error
      } else if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = String(error.message)
      }

      dispatch(wizardSaveFailure(errorMessage))
      return false
    }
  }, [dispatch, navigation])

  const reset = useCallback(() => {
    dispatch(resetWizard())
  }, [dispatch])

  // Memoize actions object to prevent re-renders
  const actions = useMemo(() => ({
    nextStep,
    prevStep,
    goToStep,
    setBackground,
    setCategories,
    toggleCategorySelection,
    setWeeklyTarget,
    setBurstsAndTimes,
    setStreakGoal,
    setProfile,
    saveAndComplete,
    reset
  }), [
    nextStep,
    prevStep,
    goToStep,
    setBackground,
    setCategories,
    toggleCategorySelection,
    setWeeklyTarget,
    setBurstsAndTimes,
    setStreakGoal,
    setProfile,
    saveAndComplete,
    reset
  ])

  return {
    wizard,
    data,
    loading: wizardSaving, // Use wizard-specific saving state instead of general loading
    error: wizardSaveError, // Use wizard-specific error instead of general error
    navigation: navigationHelpers,
    actions
  }
}