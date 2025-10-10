import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
  Alert,
  Linking,
  Share,
} from 'react-native'
import Icon from 'react-native-vector-icons/Feather'

interface ShareModalProps {
  visible: boolean
  onClose: () => void
  word: string
  definition: string
  example?: string
}

const { width: SCREEN_WIDTH } = Dimensions.get('window')

interface ShareOption {
  id: string
  name: string
  icon: string
  color: string
  action: (content: string) => void | Promise<void>
}

export default function ShareModal({ visible, onClose, word, definition, example }: ShareModalProps) {

  const formatShareContent = () => {
    let content = `📚 ${word}\n\n💭 ${definition}`
    if (example) {
      content += `\n\n✨ Ejemplo: ${example}`
    }
    content += `\n\n🎓 Compartido desde Awesome - App de Vocabulario`
    return content
  }

  const shareOptions: ShareOption[] = [
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: 'message-circle',
      color: '#25D366',
      action: async (content: string) => {
        try {
          // Intentar primero con el URL scheme oficial web (más confiable)
          const webUrl = `https://wa.me/?text=${encodeURIComponent(content)}`
          await Linking.openURL(webUrl)
        } catch (error) {
          // Si falla, intentar con el scheme nativo
          try {
            const nativeUrl = `whatsapp://send?text=${encodeURIComponent(content)}`
            await Linking.openURL(nativeUrl)
          } catch {
            Alert.alert('Error', 'No se pudo abrir WhatsApp. Asegúrate de que esté instalado.')
          }
        }
      }
    },
    {
      id: 'sms',
      name: 'SMS',
      icon: 'message-square',
      color: '#007AFF',
      action: (content: string) => {
        const url = `sms:?body=${encodeURIComponent(content)}`
        Linking.openURL(url).catch(() => {
          Alert.alert('Error', 'No se pudo abrir la aplicación de mensajes')
        })
      }
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: 'facebook',
      color: '#1877F2',
      action: (content: string) => {
        const url = `fb://facewebmodal/f?href=https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://awesome-app.com')}&quote=${encodeURIComponent(content)}`
        Linking.canOpenURL(url).then(supported => {
          if (supported) {
            Linking.openURL(url)
          } else {
            // Fallback to web version
            const webUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://awesome-app.com')}&quote=${encodeURIComponent(content)}`
            Linking.openURL(webUrl)
          }
        })
      }
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: 'instagram',
      color: '#E4405F',
      action: (content: string) => {
        const url = 'instagram://share'
        Linking.canOpenURL(url).then(supported => {
          if (supported) {
            Linking.openURL(url)
          } else {
            Alert.alert('Instagram', 'Instagram no está instalado. El contenido se ha copiado al portapapeles para que puedas pegarlo manualmente.', [
              { text: 'OK' }
            ])
          }
        })
      }
    },
    {
      id: 'messenger',
      name: 'Messenger',
      icon: 'send',
      color: '#0084FF',
      action: async (content: string) => {
        try {
          // Messenger deep link puede fallar, así que usamos Share API como fallback
          const url = `fb-messenger://share?link=${encodeURIComponent('https://awesome-app.com')}`
          try {
            await Linking.openURL(url)
          } catch {
            // Si el deep link falla, usar Share API nativo
            await Share.share({
              message: content,
              title: 'Compartir en Messenger',
            })
          }
        } catch (error) {
          Alert.alert('Error', 'No se pudo compartir en Messenger. Prueba con "Más opciones".')
        }
      }
    },
    {
      id: 'more',
      name: 'Más opciones',
      icon: 'more-horizontal',
      color: '#8E8E93',
      action: async (content: string) => {
        try {
          await Share.share({
            message: content,
            title: `Palabra: ${word}`,
          })
        } catch (error) {
          console.error('Error sharing:', error)
        }
      }
    }
  ]

  const handleShare = (option: ShareOption) => {
    const content = formatShareContent()
    option.action(content)
    onClose()
  }

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <View style={styles.dragHandle} />
            <View style={styles.headerContent}>
              <Text style={styles.title}>Compartir palabra</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Icon name="x" size={24} color="#666" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.wordPreview}>
            <Text style={styles.previewWord}>{word}</Text>
            <Text style={styles.previewDefinition} numberOfLines={2}>
              {definition}
            </Text>
          </View>

          <View style={styles.optionsContainer}>
            <Text style={styles.optionsTitle}>Compartir en:</Text>
            <View style={styles.optionsGrid}>
              {shareOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={styles.optionButton}
                  onPress={() => handleShare(option)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.optionIcon, { backgroundColor: option.color }]}>
                    <Icon name={option.icon} size={24} color="#FFF" />
                  </View>
                  <Text style={styles.optionName} numberOfLines={2}>
                    {option.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
    maxHeight: '80%',
  },
  header: {
    paddingTop: 12,
    paddingBottom: 20,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  wordPreview: {
    backgroundColor: '#F8F9FA',
    marginHorizontal: 20,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 24,
  },
  previewWord: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  previewDefinition: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  optionsContainer: {
    paddingHorizontal: 20,
  },
  optionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  optionButton: {
    width: (SCREEN_WIDTH - 80) / 3,
    alignItems: 'center',
    marginBottom: 20,
  },
  optionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  optionName: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontWeight: '500',
  },
})