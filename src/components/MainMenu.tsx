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
  TouchableWithoutFeedback
} from 'react-native'
import Icon from 'react-native-vector-icons/Feather'
import { useAppSelector } from '@/store/hooks'
import { selectCollectionsWithCount, selectPersonalNotesCount } from '@/features/notes/models/selectors'
import { selectEnabledUserWords } from '@/features/userWords/selectors'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type { AppStackParamList } from '@/navigation/AppStackNavigator'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

type NavigationProp = NativeStackNavigationProp<AppStackParamList, 'Home'>

interface MainMenuProps {
  visible: boolean
  onClose: () => void
}

interface MenuItem {
  id: string
  title: string
  subtitle: string
  icon: string
  color: string
  onPress: () => void
}

export default function MainMenu({ visible, onClose }: MainMenuProps) {
  const navigation = useNavigation<NavigationProp>()
  const collections = useAppSelector(selectCollectionsWithCount)
  const notesCount = useAppSelector(selectPersonalNotesCount)
  const userWords = useAppSelector(selectEnabledUserWords)
  const fadeAnim = useRef(new Animated.Value(0)).current
  const scaleAnim = useRef(new Animated.Value(0.8)).current

  useEffect(() => {
    if (visible) {
      openMenu()
    } else {
      closeMenu()
    }
  }, [visible])

  const openMenu = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start()
  }

  const closeMenu = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start()
  }

  const handleCollectionsPress = () => {
    onClose()
    navigation.navigate('Collections')
  }

  const handleNotesPress = () => {
    onClose()
    navigation.navigate('PersonalNotes')
  }

  const handleWordsPress = () => {
    onClose()
    navigation.navigate('UserWords')
  }

  const handleFocusPress = () => {
    onClose()
    navigation.navigate('FocusSetupScreen')
  }

  const menuItems: MenuItem[] = [
    {
      id: 'notes',
      title: 'Notas',
      subtitle: `${notesCount} notas personales`,
      icon: 'edit-3',
      color: '#FF6B6B',
      onPress: handleNotesPress,
    },
    {
      id: 'focus',
      title: 'Focus',
      subtitle: 'Sesión de concentración',
      icon: 'eye',
      color: '#6C63FF',
      onPress: handleFocusPress,
    },
    {
      id: 'words',
      title: 'Palabras',
      subtitle: `${userWords.length} palabras guardadas`,
      icon: 'book',
      color: '#4ECDC4',
      onPress: handleWordsPress,
    },
    {
      id: 'collections',
      title: 'Colecciones',
      subtitle: `${collections.length} colecciones`,
      icon: 'folder',
      color: '#9B59B6',
      onPress: handleCollectionsPress,
    },
  ]

  const renderMenuItem = (item: MenuItem, index: number) => (
    <Animated.View
      key={item.id}
      style={[
        styles.menuItemContainer,
        {
          transform: [
            {
              scale: scaleAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, 1],
              }),
            },
          ],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.menuItem}
        onPress={item.onPress}
        activeOpacity={0.8}
      >
        <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
          <Icon name={item.icon} size={28} color="white" />
        </View>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
      </TouchableOpacity>
    </Animated.View>
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
          <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="rgba(0, 0, 0, 0.8)" />

            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}></Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Icon name="x" size={24} color="white" />
              </TouchableOpacity>
            </View>

            {/* Grid Content */}
            <TouchableWithoutFeedback>
              <Animated.View
                style={[
                  styles.menuContainer,
                  {
                    transform: [{ scale: scaleAnim }],
                    opacity: fadeAnim,
                  },
                ]}
              >
                <View style={styles.menu}>
                  {menuItems.map((item, index) => renderMenuItem(item, index))}
                </View>
              </Animated.View>
            </TouchableWithoutFeedback>
          </SafeAreaView>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
  },
  closeButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    marginTop: 20
  },
  menuContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  menu: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuItemContainer: {
    width: (SCREEN_WIDTH - 60) / 2,
    marginBottom: 20,
  },
  menuItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 140,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
    textAlign: 'center',
  },
  itemSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 18,
  },
})
