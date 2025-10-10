import React, { useRef, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
  StatusBar,
  TouchableWithoutFeedback,
  Switch,
  Alert
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Icon from 'react-native-vector-icons/Feather'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { AppStackParamList } from '@/navigation/AppStackNavigator'
import NotificationModule from '@/services/notificationService'
import { wordDataService, mapWizardCategoriesToFocus } from '@/features/focus/services/wordDataService'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

interface ProfileSidebarProps {
  visible: boolean
  onClose: () => void
}

type ProfileSidebarNavigationProp = NativeStackNavigationProp<AppStackParamList>

interface MenuOption {
  id: string
  title: string
  subtitle: string
  icon: string
  type: 'toggle' | 'button'
  value?: boolean
  onToggle?: (value: boolean) => void
  onPress?: () => void
}

export default function ProfileSidebar({ visible, onClose }: ProfileSidebarProps) {
  const dispatch = useAppDispatch()
  const navigation = useNavigation<ProfileSidebarNavigationProp>()
  const slideAnim = useRef(new Animated.Value(-SCREEN_WIDTH * 0.8)).current
  const fadeAnim = useRef(new Animated.Value(0)).current
  const settings = useAppSelector((state) => state.settings.data)

  const testNotificationNow = async () => {
    try {
      console.log('🔔 TEST: Disparando notificación de prueba...')

      // Obtener categorías del wizard
      const wizardCategories = settings.categories || []
      console.log('Categorías del wizard:', wizardCategories)

      if (wizardCategories.length === 0) {
        console.warn('No hay categorías seleccionadas')
        return
      }

      // Mapear a formato español
      const focusCategories = mapWizardCategoriesToFocus(wizardCategories)
      console.log('Categorías mapeadas:', focusCategories)

      // Obtener palabras
      const focusWords = wordDataService.getMultipleCategoryWords(focusCategories)
      console.log(`Encontradas ${focusWords.length} palabras`)

      if (focusWords.length === 0) {
        console.warn('No hay palabras disponibles')
        return
      }

      // Seleccionar palabras aleatorias
      const wordsPerBurst = settings.words_per_burst || 2
      const shuffled = [...focusWords].sort(() => Math.random() - 0.5)
      const selectedWords = shuffled.slice(0, wordsPerBurst)

      console.log('Palabras seleccionadas:', selectedWords.map(w => w.word))

      // Guardar palabras en nativo
      const wordsForNotifications = selectedWords.map(w => ({
        id: w.id,
        word: w.word,
        meaning: w.meaning,
        category: w.category
      }))

      await NotificationModule.saveWords(wordsForNotifications)

      // Programar notificación para el SIGUIENTE MINUTO
      const now = new Date()
      const nextMinute = new Date(now.getTime() + 60000) // Siguiente minuto
      const testHour = nextMinute.getHours().toString().padStart(2, '0')
      const testMinute = nextMinute.getMinutes().toString().padStart(2, '0')
      const testTimeStr = `${testHour}:${testMinute}`

      const currentTime = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`
      console.log(`⏰ Hora actual: ${currentTime}`)
      console.log(`⏰ Programando notificación de prueba a las ${testTimeStr}:00`)
      console.log(`⏰ La notificación llegará en aproximadamente ${Math.ceil((nextMinute.getTime() - now.getTime()) / 1000)} segundos`)

      const categoryNames = [...new Set(wordsForNotifications.map(w => w.category))]

      await NotificationModule.scheduleNotifications({
        categories: categoryNames,
        active_windows: ['morning'],
        window_times: { morning: testTimeStr },
        words_per_burst: wordsPerBurst,
        nickname: settings.nickname || 'Usuario'
      })

      console.log('✅ Notificación programada!')
      console.log(`👀 ESPERA HASTA LAS ${testTimeStr}:00 para ver la notificación`)

    } catch (error) {
      console.error('❌ Error al probar notificación:', error)
    }
  }

  useEffect(() => {
    if (visible) {
      openSidebar()
    } else {
      closeSidebar()
    }
  }, [visible])

  const openSidebar = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start()
  }

  const closeSidebar = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -SCREEN_WIDTH * 0.8,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start()
  }


  const menuOptions: MenuOption[] = [
    {
      id: 'test-notification',
      title: '🔔 Probar Notificación',
      subtitle: 'Dispara una notificación ahora',
      icon: 'bell',
      type: 'button',
      onPress: () => {
        testNotificationNow()
      },
    },
    {
      id: 'settings',
      title: 'Configuración',
      subtitle: 'Más palabras, subcategorías y personalización',
      icon: 'settings',
      type: 'button',
      onPress: () => {
        onClose()
        navigation.navigate('Settings')
      },
    },
    {
      id: 'coming-soon',
      title: 'Próximamente',
      subtitle: 'Nuevas funcionalidades y más categorías',
      icon: 'zap',
      type: 'button',
      onPress: () => {
        Alert.alert(
          '🎁 Próximamente',
          'Recuerda tu correo electrónico para que seas uno de los primeros en probar gratis las nuevas funciones y categorías, y obtener ofertas exclusivas.',
          [
            { text: 'Entendido', style: 'default' }
          ]
        )
      },
    },
  ]

  const renderMenuOption = (option: MenuOption) => (
    <TouchableOpacity onPress={option.onPress} key={option.id} style={styles.menuOption}>
      <View style={styles.optionContent}>
        <View style={styles.optionIcon}>
          <Icon name={option.icon} size={24} color="#9B59B6" />
        </View>
        <View style={styles.optionText}>
          <Text style={styles.optionTitle}>{option.title}</Text>
          <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
        </View>
        {option.type === 'toggle' ? (
          <Switch
            value={option.value || false}
            onValueChange={option.onToggle}
            trackColor={{ false: '#E0E0E0', true: 'rgba(155, 89, 182, 0.3)' }}
            thumbColor={option.value ? '#9B59B6' : '#FFF'}
            ios_backgroundColor="#E0E0E0"
            disabled={false}
            style={styles.toggle}
          />
        ) : (
          <View  style={styles.optionButton}>
            <Icon name="chevron-right" size={20} color="#CCC" />
          </View>
        )}
      </View>
    </TouchableOpacity>
  )

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View
          style={[
            styles.overlay,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.sidebar,
                {
                  transform: [{ translateX: slideAnim }],
                },
              ]}
            >
              <SafeAreaView style={styles.container} edges={['top', 'left']}>
                <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

                {/* Header */}
                <View style={styles.header}>
                  <View style={styles.profileInfo}>
                    <View style={styles.avatar}>
                      <Icon name="user" size={32} color="#9B59B6" />
                    </View>
                    <View style={styles.userInfo}>
                      <Text style={styles.userName}>Mi Perfil</Text>
                      <Text style={styles.userEmail}>Usuario de Awesome</Text>
                    </View>
                  </View>
                  <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <Icon name="x" size={24} color="#666" />
                  </TouchableOpacity>
                </View>

                {/* Menu Options */}
                <View style={styles.menuContainer}>
                  <Text style={styles.sectionTitle}>Configuración</Text>
                  {menuOptions.map(renderMenuOption)}
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                  <Text style={styles.footerText}>Awesome Vocabulary App</Text>
                  <Text style={styles.footerVersion}>Versión 1.0.0</Text>
                </View>
              </SafeAreaView>
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sidebar: {
    width: SCREEN_WIDTH * 0.8,
    height: '100%',
    backgroundColor: '#FFF',
    elevation: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(155, 89, 182, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  closeButton: {
    padding: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 20,
  },
  menuContainer: {
    flex: 1,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  menuOption: {
    paddingHorizontal: 20,
    paddingVertical: 4,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
  },
  toggle: {
    marginLeft: 12,
  },
  optionButton: {
    padding: 8,
    marginLeft: 12,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9B59B6',
    marginBottom: 4,
  },
  footerVersion: {
    fontSize: 12,
    color: '#999',
  },
})