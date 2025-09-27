import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import Icon from 'react-native-vector-icons/Feather'
import { useAppDispatch } from '@/store/hooks'
import { addUserWord, updateUserWord } from '@/features/userWords/userWordsSlice'
import type { UserWord } from '@/features/userWords/userWordsSlice'

interface UserWordModalProps {
  visible: boolean
  onClose: () => void
  mode: 'add' | 'edit'
  word?: UserWord
}

export default function UserWordModal({ visible, onClose, mode, word }: UserWordModalProps) {
  const dispatch = useAppDispatch()
  const [palabra, setPalabra] = useState('')
  const [significado, setSignificado] = useState('')
  const [ejemplo, setEjemplo] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (visible) {
      if (mode === 'edit' && word) {
        setPalabra(word.palabra)
        setSignificado(word.significado)
        setEjemplo(word.ejemplo || '')
      } else {
        setPalabra('')
        setSignificado('')
        setEjemplo('')
      }
    }
  }, [visible, mode, word])

  const handleClose = () => {
    setPalabra('')
    setSignificado('')
    setEjemplo('')
    onClose()
  }

  const handleSave = async () => {
    if (!palabra.trim()) {
      Alert.alert('Error', 'La palabra es obligatoria')
      return
    }

    if (!significado.trim()) {
      Alert.alert('Error', 'El significado es obligatorio')
      return
    }

    setLoading(true)

    try {
      if (mode === 'add') {
        dispatch(addUserWord({
          palabra: palabra.trim(),
          significado: significado.trim(),
          ejemplo: ejemplo.trim() || undefined,
        }))
      } else if (mode === 'edit' && word) {
        dispatch(updateUserWord({
          id: word.id,
          palabra: palabra.trim(),
          significado: significado.trim(),
          ejemplo: ejemplo.trim() || undefined,
        }))
      }

      handleClose()
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar la palabra')
    } finally {
      setLoading(false)
    }
  }

  const isFormValid = palabra.trim().length > 0 && significado.trim().length > 0

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <View style={styles.dragHandle} />
            <View style={styles.headerContent}>
              <Text style={styles.title}>
                {mode === 'add' ? 'Agregar Palabra' : 'Editar Palabra'}
              </Text>
              <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                <Icon name="x" size={24} color="#666" />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Palabra input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Palabra <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={palabra}
                onChangeText={setPalabra}
                placeholder="Escribe la palabra..."
                placeholderTextColor="#999"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Significado input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Significado <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={significado}
                onChangeText={setSignificado}
                placeholder="Escribe el significado..."
                placeholderTextColor="#999"
                multiline={true}
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            {/* Ejemplo input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Ejemplo (opcional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={ejemplo}
                onChangeText={setEjemplo}
                placeholder="Escribe un ejemplo de uso..."
                placeholderTextColor="#999"
                multiline={true}
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            {/* Preview */}
            {palabra && significado && (
              <View style={styles.previewContainer}>
                <Text style={styles.previewTitle}>Vista previa:</Text>
                <View style={styles.previewCard}>
                  <Text style={styles.previewWord}>{palabra}</Text>
                  <Text style={styles.previewDefinition}>{significado}</Text>
                  {ejemplo && (
                    <Text style={styles.previewExample}>Ejemplo: {ejemplo}</Text>
                  )}
                </View>
              </View>
            )}
          </ScrollView>

          {/* Footer buttons */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleClose}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.saveButton,
                (!isFormValid || loading) && styles.saveButtonDisabled,
              ]}
              onPress={handleSave}
              disabled={!isFormValid || loading}
            >
              <Text style={styles.saveButtonText}>
                {loading ? 'Guardando...' : (mode === 'add' ? 'Agregar' : 'Actualizar')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
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
    maxHeight: '90%',
    minHeight: '60%',
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  required: {
    color: '#FF6B6B',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#F8F9FA',
  },
  textArea: {
    minHeight: 100,
    paddingTop: 14,
  },
  previewContainer: {
    marginTop: 8,
    marginBottom: 20,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  previewCard: {
    backgroundColor: '#F5F5DC',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#9B59B6',
  },
  previewWord: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  previewDefinition: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
    marginBottom: 8,
  },
  previewExample: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 30,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#9B59B6',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#9B59B6',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  saveButtonDisabled: {
    backgroundColor: '#CCC',
    elevation: 0,
    shadowOpacity: 0,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
})