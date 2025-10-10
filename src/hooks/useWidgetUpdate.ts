import { useEffect } from 'react'
import { AppState, AppStateStatus } from 'react-native'
import { useAppSelector } from '@/store/hooks'
import WidgetModule from '@/services/widgetService'

interface Word {
  palabra: string
  significado: string
}

/**
 * Hook para actualizar el widget con la palabra actual
 * Se actualiza cuando:
 * - La palabra cambia
 * - La app pasa a background
 */
export function useWidgetUpdate(currentWord: Word | null) {
  const { data, customBackgrounds } = useAppSelector((s) => s.settings)

  useEffect(() => {
    if (!currentWord) return

    // Obtener URI del fondo actual
    const backgroundUri = getBackgroundUri(data.background, customBackgrounds)

    // Actualizar widget cuando cambia la palabra
    updateWidget(currentWord.palabra, currentWord.significado, backgroundUri)
  }, [currentWord, data.background, customBackgrounds])

  useEffect(() => {
    // Actualizar widget cuando la app pasa a background
    const subscription = AppState.addEventListener('change', handleAppStateChange)
    return () => subscription?.remove()
  }, [currentWord, data.background, customBackgrounds])

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (nextAppState === 'background' && currentWord) {
      const backgroundUri = getBackgroundUri(data.background, customBackgrounds)
      updateWidget(currentWord.palabra, currentWord.significado, backgroundUri)
    }
  }

  const updateWidget = async (word: string, meaning: string, backgroundUri: string | null) => {
    try {
      await WidgetModule.updateWidget(word, meaning, backgroundUri)
      console.log('✅ Widget updated:', word, 'with background:', backgroundUri)
    } catch (error) {
      console.error('❌ Error updating widget:', error)
    }
  }
}

/**
 * Obtiene la URI del fondo seleccionado
 */
function getBackgroundUri(
  backgroundId: string,
  customBackgrounds: Array<{id: string, value: any}> | undefined
): string | null {
  // Verificar si es un fondo personalizado (de galería)
  if (customBackgrounds && customBackgrounds.length > 0) {
    const customBg = customBackgrounds.find(bg => bg.id === backgroundId)
    if (customBg && customBg.value?.uri) {
      // Es un fondo de galería, devolver la URI del archivo permanente
      return customBg.value.uri
    }
  }

  // Si es un fondo predefinido, devolver solo el ID
  // El widget en Android lo resolverá a su drawable correspondiente
  const predefinedBackgrounds = ['amarillo', 'azul', 'naranja', 'negro', 'verde']
  if (predefinedBackgrounds.includes(backgroundId)) {
    return backgroundId
  }

  return null
}

/**
 * Función standalone para actualizar widget manualmente
 */
export async function updateWidgetManually(word: string, meaning: string, backgroundUri?: string) {
  try {
    await WidgetModule.updateWidget(word, meaning, backgroundUri || null)
    console.log('✅ Widget manually updated')
  } catch (error) {
    console.error('❌ Error manually updating widget:', error)
  }
}
