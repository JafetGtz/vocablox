// src/viewmodels/useSettingsViewModel.ts
import { useCallback, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import * as service from '@/services/auth/settingsServices';
import {
  updatePartial,
  loadStart,
  loadSuccess,
  loadFailure,
  saveStart,
  saveSuccess,
  saveFailure,
  clearSettings,
} from '@/store/slices/settingsSlice'

export function useSettingsViewModel() {
  const dispatch = useAppDispatch()
  const { data, loading, error, wizard } = useAppSelector((s) => s.settings)
  // Obtener el usuario directamente de Redux en lugar de useAuth()
  const user = useAppSelector((s) => s.auth.user)

  const load = useCallback(async () => {
    if (!user) return
    dispatch(loadStart())
    try {
      const settings = await service.fetchSettings(user.id)
      dispatch(loadSuccess(settings))
    } catch (err: any) {
      // If settings don't exist (new user), that's okay - wizard will handle it
      if (err.message.includes('No rows') || err.message.includes('not found')) {
        dispatch(loadFailure('New user - no settings found'))
      } else {
        dispatch(loadFailure(err.message))
      }
    }
  }, [dispatch, user])

  // Auto-load settings when user logs in (only if wizard is completed)
  // This effect is now redundant as SettingsInitializer handles this
  // but kept as backup for direct usage of this hook
  useEffect(() => {
    if (user && !data.user_id && !loading && wizard.isCompleted) {
      load()
    }
  }, [user, data.user_id, loading, wizard.isCompleted, load])

  const save = useCallback(
    async (partial: Partial<service.UserSettings>) => {
      if (!user) return
      // Guardamos primero en Redux partialmente
      dispatch(updatePartial({ user_id: user.id, ...partial }))
      dispatch(saveStart())
      try {
        // Subimos al servidor sólo los campos que haya cambiado
        const full = await service.upsertSettings({
          user_id: user.id,
          ...(data as service.UserSettings),
          ...partial,
        })
        dispatch(saveSuccess(full))
      } catch (err: any) {
        dispatch(saveFailure(err.message))
      }
    },
    [dispatch, user, data]
  )

  const clear = useCallback(() => {
    dispatch(clearSettings())
  }, [dispatch])

  return { data, loading, error, wizard, load, save, clear }
}
