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
  ScrollView,
  Switch,
} from 'react-native'
import Icon from 'react-native-vector-icons/Feather'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { updateTextColor, updateTextSize, updateTextVisibility } from '@/store/slices/settingsSlice'

const { width: SCREEN_WIDTH } = Dimensions.get('window')

interface TextCustomizationModalProps {
  visible: boolean
  onClose: () => void
}

const COLOR_OPTIONS = [
  // Básicos
  '#FFFFFF', '#000000', '#808080', '#C0C0C0', '#F5F5F5',
  // Pasteles suaves
  '#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFC9', '#BAE1FF',
  '#E1BAFF', '#FFB3E6', '#D4F1F9', '#FFF0E6', '#E6F3E6',
  // Colores vibrantes
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57',
  '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3', '#FF9F43',
  '#6C5CE7', '#A29BFE', '#FD79A8', '#FDCB6E', '#2ECC71',
  // Colores adicionales
  '#F8BBD9', '#E4C1F9', '#D0E3F0', '#C8E6C9', '#FFECB3'
]

const SIZE_OPTIONS: Array<{value: 'small' | 'medium' | 'large', label: string, size: number}> = [
  { value: 'small', label: 'Pequeño', size: 14 },
  { value: 'medium', label: 'Mediano', size: 18 },
  { value: 'large', label: 'Grande', size: 24 }
]

export default function TextCustomizationModal({ visible, onClose }: TextCustomizationModalProps) {
  const dispatch = useAppDispatch()
  const { data } = useAppSelector((s) => s.settings)
  const [selectedElement, setSelectedElement] = React.useState<'word' | 'meaning' | 'example' | null>(null)

  const slideAnim = useRef(new Animated.Value(SCREEN_WIDTH)).current
  const fadeAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    console.log('TextCustomizationModal visibility changed:', visible)
    if (visible) {
      // Reset animation values before opening
      slideAnim.setValue(SCREEN_WIDTH)
      fadeAnim.setValue(0)
      openModal()
    } else {
      closeModal()
    }
  }, [visible, slideAnim, fadeAnim])

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

  const handleColorChange = (color: string) => {
    if (!selectedElement) return
    console.log(`Changing ${selectedElement} color to:`, color)
    dispatch(updateTextColor({ element: selectedElement, color }))
    setSelectedElement(null) // Close color picker after selection
  }

  const handleSizeChange = (element: 'word' | 'meaning' | 'example', size: 'small' | 'medium' | 'large') => {
    console.log(`Changing ${element} size to:`, size)
    dispatch(updateTextSize({ element, size }))
  }

  const handleVisibilityChange = (element: 'word' | 'meaning' | 'example', visible: boolean) => {
    console.log(`Changing ${element} visibility to:`, visible)
    dispatch(updateTextVisibility({ element, visible }))
  }


  // Early return if not visible to avoid render issues
  if (!visible) {
    return null
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
      presentationStyle="overFullScreen"
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
            <View style={styles.header}>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Icon name="x" size={24} color="#333" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Personalizar Texto</Text>
              <View style={styles.headerSpacer} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
              <Text style={styles.subtitle}>
                Personaliza los colores y visibilidad del texto en tu pantalla principal
              </Text>

              {/* Element Color Buttons */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Colores del Texto</Text>

                <TouchableOpacity
                  style={styles.colorButton}
                  onPress={() => setSelectedElement('word')}
                >
                  <Text style={styles.colorButtonText}>Color de la Palabra</Text>
                  <View style={[styles.colorPreview, { backgroundColor: data.text_colors?.word || '#FFFFFF' }]} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.colorButton}
                  onPress={() => setSelectedElement('meaning')}
                >
                  <Text style={styles.colorButtonText}>Color del Significado</Text>
                  <View style={[styles.colorPreview, { backgroundColor: data.text_colors?.meaning || '#FFFFFF' }]} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.colorButton}
                  onPress={() => setSelectedElement('example')}
                >
                  <Text style={styles.colorButtonText}>Color del Ejemplo</Text>
                  <View style={[styles.colorPreview, { backgroundColor: data.text_colors?.example || '#FFFFFF' }]} />
                </TouchableOpacity>
              </View>

              {/* Dynamic Color Selector */}
              {selectedElement && (
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>
                      Seleccionar Color - {selectedElement === 'word' ? 'Palabra' : selectedElement === 'meaning' ? 'Significado' : 'Ejemplo'}
                    </Text>
                    <TouchableOpacity onPress={() => setSelectedElement(null)}>
                      <Icon name="x" size={20} color="#666" />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.colorGrid}>
                    {COLOR_OPTIONS.map((color) => {
                      const currentColor = data.text_colors?.[selectedElement] || '#FFFFFF'
                      const isSelected = currentColor === color
                      return (
                        <TouchableOpacity
                          key={color}
                          style={[
                            styles.colorOption,
                            { backgroundColor: color },
                            isSelected && styles.selectedColor
                          ]}
                          onPress={() => handleColorChange(color)}
                        >
                          {isSelected && (
                            <Icon name="check" size={16} color={color === '#FFFFFF' ? '#333' : '#FFF'} />
                          )}
                        </TouchableOpacity>
                      )
                    })}
                  </View>
                </View>
              )}

              {/* Visibility Controls */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Mostrar Elementos</Text>

                <View style={styles.visibilityRow}>
                  <Text style={styles.visibilityLabel}>Palabra</Text>
                  <Switch
                    value={data.text_visibility?.word !== false}
                    onValueChange={(visible) => handleVisibilityChange('word', visible)}
                    trackColor={{ false: '#E0E0E0', true: '#9B59B6' }}
                    thumbColor={data.text_visibility?.word !== false ? '#FFFFFF' : '#F4F3F4'}
                  />
                </View>

                <View style={styles.visibilityRow}>
                  <Text style={styles.visibilityLabel}>Significado</Text>
                  <Switch
                    value={data.text_visibility?.meaning !== false}
                    onValueChange={(visible) => handleVisibilityChange('meaning', visible)}
                    trackColor={{ false: '#E0E0E0', true: '#9B59B6' }}
                    thumbColor={data.text_visibility?.meaning !== false ? '#FFFFFF' : '#F4F3F4'}
                  />
                </View>

                <View style={styles.visibilityRow}>
                  <Text style={styles.visibilityLabel}>Ejemplo</Text>
                  <Switch
                    value={data.text_visibility?.example !== false}
                    onValueChange={(visible) => handleVisibilityChange('example', visible)}
                    trackColor={{ false: '#E0E0E0', true: '#9B59B6' }}
                    thumbColor={data.text_visibility?.example !== false ? '#FFFFFF' : '#F4F3F4'}
                  />
                </View>
              </View>
            </ScrollView>

            <View style={styles.footer}>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={onClose}
              >
                <Text style={styles.confirmButtonText}>Guardar Cambios</Text>
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
    width: SCREEN_WIDTH * 0.95,
    height: '80%',
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
  section: {
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  visibilityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  visibilityLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  colorOption: {
    width: (SCREEN_WIDTH * 0.95 - 80) / 6 - 6,
    height: (SCREEN_WIDTH * 0.95 - 80) / 6 - 6,
    borderRadius: 6,
    marginBottom: 6,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedColor: {
    borderColor: '#9B59B6',
    borderWidth: 3,
  },
  sizeSection: {
    marginTop: 16,
  },
  sizeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 12,
  },
  sizeOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  sizeOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    minWidth: 80,
    alignItems: 'center',
  },
  selectedSizeOption: {
    backgroundColor: '#9B59B6',
  },
  sizeOptionText: {
    fontWeight: '600',
    color: '#666',
  },
  selectedSizeText: {
    color: '#FFFFFF',
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
  colorButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  colorButtonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  colorPreview: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
})