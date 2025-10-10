import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import NotificationModule from '@/services/notificationService'

export function useNotifications() {
  const settings = useSelector((state: RootState) => state.settings.data)
  const wizardCompleted = settings.wizard_completed

  // ELIMINADO: No agendar automáticamente en cada mount
  // Solo verificar si necesita reprogramar cuando ya se completó el wizard antes
  useEffect(() => {
    if (wizardCompleted) {
      checkAndReschedule()
    }
  }, [wizardCompleted])

  const checkAndReschedule = async () => {
    try {
      console.log('Checking if notifications need rescheduling...')
      const result = await NotificationModule.checkAndRescheduleIfNeeded()
      console.log('Reschedule check result:', result)

      // Si se reprogramó, actualizar las palabras también
      if (result.includes('Rescheduled')) {
        await updateWordsIfNeeded()
      }
    } catch (error) {
      console.error('Error checking reschedule:', error)
    }
  }

  const updateWordsIfNeeded = async () => {
    try {
      // Obtener palabras de archivos JSON locales (igual que en el wizard)
      const { wordDataService, mapWizardCategoriesToFocus } = await import('@/features/focus/services/wordDataService')

      const wizardCategories = settings.categories || []
      console.log('Wizard categories:', wizardCategories)

      // Mapear categorías del wizard a formato de archivos JSON
      const focusCategories = mapWizardCategoriesToFocus(wizardCategories)
      console.log('Mapped to focus categories:', focusCategories)

      // Obtener palabras de las categorías seleccionadas
      const focusWords = wordDataService.getMultipleCategoryWords(focusCategories)
      console.log(`Found ${focusWords.length} words from categories`)

      // Convertir al formato que espera el módulo de notificaciones
      const wordsForNotifications = focusWords.slice(0, 100).map(focusWord => ({
        id: focusWord.id,
        word: focusWord.word,
        meaning: focusWord.meaning,
        category: focusWord.category
      }))

      if (wordsForNotifications.length > 0) {
        await NotificationModule.saveWords(wordsForNotifications)
        console.log(`Updated ${wordsForNotifications.length} words in native storage`)
      } else {
        console.warn('No words found for selected categories')
      }
    } catch (error) {
      console.error('Error updating words:', error)
    }
  }

  return {
    checkAndReschedule,
    updateWordsIfNeeded
  }
}
