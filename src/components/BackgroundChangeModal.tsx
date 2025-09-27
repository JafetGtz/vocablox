import React, { useRef, useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
  SafeAreaView,
  ScrollView,
  Image,
  Alert,
} from 'react-native'
import Icon from 'react-native-vector-icons/Feather'
import { launchImageLibrary, ImagePickerResponse, MediaType } from 'react-native-image-picker'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { updateBackground, addCustomBackground, setCustomBackgrounds } from '@/store/slices/settingsSlice'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { DEFAULT_BACKGROUNDS } from '@/types/wizard'

const { width: SCREEN_WIDTH } = Dimensions.get('window')

interface BackgroundChangeModalProps {
  visible: boolean
  onClose: () => void
}

export default function BackgroundChangeModal({ visible, onClose }: BackgroundChangeModalProps) {
  const dispatch = useAppDispatch()
  const { data, customBackgrounds } = useAppSelector((s) => s.settings)

  const slideAnim = useRef(new Animated.Value(SCREEN_WIDTH)).current
  const fadeAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (visible) {
      openModal()
      loadCustomBackgrounds()
    } else {
      closeModal()
    }
  }, [visible])

  const loadCustomBackgrounds = async () => {
    try {
      const stored = await AsyncStorage.getItem('customBackgrounds')
      if (stored) {
        const backgrounds = JSON.parse(stored)
        dispatch(setCustomBackgrounds(backgrounds))
      }
    } catch (error) {
      console.error('Error loading custom backgrounds:', error)
    }
  }

  const openModal = () => {
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

  const closeModal = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: SCREEN_WIDTH,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start()
  }

  const handleBackgroundSelect = (backgroundId: string) => {
    dispatch(updateBackground(backgroundId))
    onClose()
  }

  const handleAddCustomBackground = () => {
    const options = {
      mediaType: 'photo' as MediaType,
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
      quality: 0.8,
    }

    launchImageLibrary(options, async (response: ImagePickerResponse) => {
      console.log('Image picker response:', response)

      if (response.didCancel) {
        console.log('User cancelled image picker')
        return
      }

      if (response.errorMessage) {
        console.error('Image picker error:', response.errorMessage)
        Alert.alert('Error', 'No se pudo seleccionar la imagen: ' + response.errorMessage)
        return
      }

      if (response.assets && response.assets[0]) {
        const asset = response.assets[0]

        if (!asset.uri) {
          console.error('Asset has no URI')
          Alert.alert('Error', 'La imagen seleccionada no es válida')
          return
        }

        const customId = `custom_${Date.now()}`
        const newCustomBackground = {
          id: customId,
          name: 'Fondo Personalizado',
          type: 'image' as const,
          value: { uri: asset.uri },
          preview: { uri: asset.uri }
        }

        console.log('Selected image asset:', asset)
        console.log('Generated custom background:', newCustomBackground)

        dispatch(addCustomBackground(newCustomBackground))
        dispatch(updateBackground(customId))

        // Store custom background in persistent storage
        try {
          const currentCustomBackgrounds = customBackgrounds || []
          const updatedBackgrounds = [...currentCustomBackgrounds, newCustomBackground]
          await AsyncStorage.setItem('customBackgrounds', JSON.stringify(updatedBackgrounds))
          console.log('Custom background saved to AsyncStorage:', updatedBackgrounds)
        } catch (error) {
          console.error('Error saving custom background:', error)
          Alert.alert('Error', 'No se pudo guardar el fondo personalizado')
        }
        onClose()
      } else {
        console.log('No assets in response')
        Alert.alert('Error', 'No se pudo obtener la imagen seleccionada')
      }
    })
  }

  const allBackgrounds = [...DEFAULT_BACKGROUNDS, ...(customBackgrounds || [])]
  const selectedBackground = allBackgrounds.find(bg => bg.id === data.background)

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Animated.View
        style={[
          styles.overlay,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.modal,
            {
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Icon name="x" size={24} color="#333" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Cambiar Fondo</Text>
              <View style={styles.headerSpacer} />
            </View>

            {/* Content */}
            <View style={styles.content}>
              <Text style={styles.subtitle}>
                Selecciona un fondo para personalizar tu pantalla principal
              </Text>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.backgroundsContainer}
                style={styles.backgroundsScroll}
              >
                {/* Add Custom Background Button */}
                <TouchableOpacity
                  style={styles.addBackgroundButton}
                  onPress={handleAddCustomBackground}
                >
                  <Icon name="plus" size={32} color="#9B59B6" />
                  <Text style={styles.addBackgroundText}>Agregar{'\n'}Personalizado</Text>
                </TouchableOpacity>

                {/* Default and Custom Backgrounds */}
                {allBackgrounds.map((background) => (
                  <TouchableOpacity
                    key={background.id}
                    style={[
                      styles.backgroundOption,
                      selectedBackground?.id === background.id && styles.selectedBackground
                    ]}
                    onPress={() => handleBackgroundSelect(background.id)}
                  >
                    <View style={styles.backgroundImageContainer}>
                      <Image
                        source={background.preview}
                        style={styles.backgroundImage}
                        resizeMode="cover"
                      />
                      {selectedBackground?.id === background.id && (
                        <View style={styles.selectedOverlay}>
                          <Icon name="check" size={24} color="#FFF" />
                        </View>
                      )}
                    </View>
                    <Text style={styles.backgroundName}>{background.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={onClose}
              >
                <Text style={styles.confirmButtonText}>Listo</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </Animated.View>
      </Animated.View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: SCREEN_WIDTH * 0.9,
    maxHeight: '80%',
    backgroundColor: '#FFF',
    borderRadius: 20,
    overflow: 'hidden',
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
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  closeButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  headerSpacer: {
    width: 32,
  },
  content: {
    flex: 1,
    paddingTop: 20,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 20,
    lineHeight: 20,
  },
  backgroundsScroll: {
    paddingLeft: 20,
  },
  backgroundsContainer: {
    paddingRight: 20,
  },
  addBackgroundButton: {
    width: 100,
    height: 120,
    marginRight: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#9B59B6',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(155, 89, 182, 0.05)',
  },
  addBackgroundText: {
    fontSize: 12,
    color: '#9B59B6',
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 16,
  },
  backgroundOption: {
    width: 100,
    marginRight: 16,
    alignItems: 'center',
  },
  backgroundImageContainer: {
    width: 100,
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  selectedBackground: {
    // Additional styling for selected state handled by overlay
  },
  selectedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(155, 89, 182, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginTop: 8,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  confirmButton: {
    backgroundColor: '#9B59B6',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
})