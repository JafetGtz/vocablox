import React, { useRef, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
  SafeAreaView,
  StatusBar,
  TouchableWithoutFeedback,
  Switch
} from 'react-native'
import Icon from 'react-native-vector-icons/Feather'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { selectUserWordsEnabled, selectUserWordsCount } from '@/features/userWords/selectors'
import { toggleUserWordsEnabled } from '@/features/userWords/userWordsSlice'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { AppStackParamList } from '@/navigation/AppStackNavigator'

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
  const userWordsEnabled = useAppSelector(selectUserWordsEnabled)
  const userWordsCount = useAppSelector(selectUserWordsCount)
  const slideAnim = useRef(new Animated.Value(-SCREEN_WIDTH * 0.8)).current
  const fadeAnim = useRef(new Animated.Value(0)).current

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

  const handleUserWordsToggle = (value: boolean) => {
    dispatch(toggleUserWordsEnabled())
  }

  const menuOptions: MenuOption[] = [
    {
      id: 'userWords',
      title: 'Mis Palabras en Home',
      subtitle: userWordsCount > 0
        ? `${userWordsCount} palabras ${userWordsEnabled ? 'habilitadas' : 'deshabilitadas'}`
        : 'No tienes palabras personales',
      icon: 'book-open',
      type: 'toggle',
      value: userWordsEnabled,
      onToggle: handleUserWordsToggle,
    },
    {
      id: 'settings',
      title: 'Configuración',
      subtitle: 'Ajustes de la aplicación',
      icon: 'settings',
      type: 'button',
      onPress: () => {
        onClose()
        navigation.navigate('Settings')
      },
    },
    {
      id: 'about',
      title: 'Acerca de',
      subtitle: 'Información de la app',
      icon: 'info',
      type: 'button',
      onPress: () => {
        // TODO: Navigate to about
        console.log('Navigate to about')
      },
    },
  ]

  const renderMenuOption = (option: MenuOption) => (
    <View key={option.id} style={styles.menuOption}>
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
            disabled={userWordsCount === 0}
            style={styles.toggle}
          />
        ) : (
          <TouchableOpacity onPress={option.onPress} style={styles.optionButton}>
            <Icon name="chevron-right" size={20} color="#CCC" />
          </TouchableOpacity>
        )}
      </View>
    </View>
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
              <SafeAreaView style={styles.container}>
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
    height: SCREEN_HEIGHT,
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
    paddingTop: 20,
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