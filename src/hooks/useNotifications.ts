import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import NotificationModule from '@/services/notificationService'
import { supabase } from '@/services/supebase'

export function useNotifications() {
  const settings = useSelector((state: RootState) => state.settings.data)
  const wizardCompleted = settings.wizard_completed

  useEffect(() => {
    if (wizardCompleted) {
      setupNotifications()
    }
  }, [wizardCompleted])

  const setupNotifications = async () => {
    try {
      console.log('Setting up notifications with settings:', settings)

      // 1. Verificar permisos de alarmas exactas (Android 12+)
      const canSchedule = await NotificationModule.checkExactAlarmPermission()
      if (!canSchedule) {
        console.log('Requesting exact alarm permission...')
        await NotificationModule.requestExactAlarmPermission()
        return
      }

      // 2. Solicitar ignorar optimización de batería
      await NotificationModule.requestIgnoreBatteryOptimization()

      // 3. Obtener palabras de Supabase filtradas por categorías
      const { data: words, error } = await supabase
        .from('words')
        .select('*')
        .in('category', settings.categories || [])
        .limit(100)

      if (error) {
        console.error('Error fetching words:', error)
        return
      }

      // 4. Guardar palabras en almacenamiento nativo
      if (words && words.length > 0) {
        await NotificationModule.saveWords(words)
        console.log(`Saved ${words.length} words to native storage`)
      }

      // 5. Programar notificaciones con configuración del wizard
      const result = await NotificationModule.scheduleNotifications({
        categories: settings.categories || [],
        active_windows: settings.active_windows || ['morning'],
        window_times: settings.window_times || { morning: '08:00' },
        words_per_burst: settings.words_per_burst || 2,
        nickname: settings.nickname || 'Usuario'
      })

      console.log('Notifications scheduled:', result)
    } catch (error) {
      console.error('Error setting up notifications:', error)
    }
  }

  return {
    setupNotifications
  }
}
