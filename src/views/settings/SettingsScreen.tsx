import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Icon from 'react-native-vector-icons/Feather'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { AppStackParamList } from '@/navigation/AppStackNavigator'
import BackgroundChangeModal from '@/components/BackgroundChangeModal'
import TextCustomizationModal from '@/components/TextCustomizationModal'
import ScheduledNotificationsModal from '@/components/ScheduledNotificationsModal'
import WidgetModule from '@/services/widgetService'
import { useAppSelector } from '@/store/hooks'

type SettingsScreenNavigationProp = NativeStackNavigationProp<AppStackParamList, 'Settings'>

interface SettingOption {
  id: string
  title: string
  subtitle: string
  icon: string
  onPress: () => void
}

export default function SettingsScreen() {
  const navigation = useNavigation<SettingsScreenNavigationProp>()
  const [showBackgroundModal, setShowBackgroundModal] = useState(false)
  const [showTextCustomizationModal, setShowTextCustomizationModal] = useState(false)
  const [showScheduledNotificationsModal, setShowScheduledNotificationsModal] = useState(false)
  const { data, customBackgrounds } = useAppSelector((s) => s.settings)

  const testWidgetUpdate = async () => {
    try {
      const currentData = await WidgetModule.getWidgetData()
      const testWord = `Test ${new Date().getSeconds()}`
      const testMeaning = 'Prueba de actualización'

      let backgroundUri: string | null = null
      const customBg = customBackgrounds?.find(bg => bg.id === data.background)
      if (customBg?.value?.uri) {
        backgroundUri = customBg.value.uri
      } else if (['amarillo', 'azul', 'naranja', 'negro', 'verde'].includes(data.background)) {
        backgroundUri = data.background
      }

      await WidgetModule.updateWidget(testWord, testMeaning, backgroundUri)

      Alert.alert(
        'Widget Test',
        `✅ Widget actualizado\n\nPalabra: ${testWord}\nSignificado: ${testMeaning}\nFondo: ${backgroundUri || 'none'}\n\nRevisa el widget`
      )
    } catch (error) {
      Alert.alert('Error', `${error}`)
    }
  }

  const settingsOptions: SettingOption[] = [
    {
      id: 'categories',
      title: 'Categorías de vocabulario',
      subtitle: 'Selecciona las categorías que quieres estudiar',
      icon: 'grid',
      onPress: () => navigation.navigate('CategoriesSettings'),
    },
    {
      id: 'userWordsConfig',
      title: 'Configuración de mis palabras',
      subtitle: 'Controla la aparición y frecuencia de tus palabras personales',
      icon: 'book-open',
      onPress: () => navigation.navigate('UserWordsSettings'),
    },
    {
      id: 'changeBackground',
      title: 'Cambiar fondo',
      subtitle: 'Personaliza el fondo de tu pantalla principal',
      icon: 'image',
      onPress: () => setShowBackgroundModal(true),
    },
    {
      id: 'textCustomization',
      title: 'Personalizar texto',
      subtitle: 'Cambia colores, tamaños y visibilidad del texto',
      icon: 'type',
      onPress: () => {
        console.log('Text customization button pressed')
        setShowTextCustomizationModal(true)
      },
    },
    // {
    //   id: 'scheduledNotifications',
    //   title: 'Ver notificaciones programadas',
    //   subtitle: 'Lista de todas las notificaciones agendadas (2 semanas)',
    //   icon: 'calendar',
    //   onPress: () => setShowScheduledNotificationsModal(true),
    // },
    // {
    //   id: 'testWidget',
    //   title: '🧪 Probar Widget',
    //   subtitle: 'Actualizar widget con palabra de prueba y fondo actual',
    //   icon: 'activity',
    //   onPress: testWidgetUpdate,
    // },
  ]

  const renderSettingOption = (option: SettingOption) => (
    <TouchableOpacity
      key={option.id}
      style={styles.optionContainer}
      onPress={option.onPress}
    >
      <View style={styles.optionContent}>
        <View style={styles.optionIcon}>
          <Icon name={option.icon} size={24} color="#9B59B6" />
        </View>
        <View style={styles.optionText}>
          <Text style={styles.optionTitle}>{option.title}</Text>
          <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
        </View>
        <Icon name="chevron-right" size={20} color="#CCC" />
      </View>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personalización</Text>
          {settingsOptions.map(renderSettingOption)}
        </View>
      </ScrollView>

      <BackgroundChangeModal
        visible={showBackgroundModal}
        onClose={() => setShowBackgroundModal(false)}
      />

      <TextCustomizationModal
        visible={showTextCustomizationModal}
        onClose={() => setShowTextCustomizationModal(false)}
      />

      <ScheduledNotificationsModal
        visible={showScheduledNotificationsModal}
        onClose={() => setShowScheduledNotificationsModal(false)}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5DC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingTop: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  optionContainer: {
    backgroundColor: '#FFF',
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  optionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(155, 89, 182, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  optionSubtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
})