import React, { useRef, useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  PanResponder,
  Dimensions,
  TouchableWithoutFeedback,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native'
import Icon from 'react-native-vector-icons/Feather'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { addPersonalNote, updatePersonalNote, deletePersonalNote } from '@/features/notes/models/personalNotesSlice'
import { selectPersonalNotesForWord } from '@/features/notes/models/selectors'

const { height: SCREEN_HEIGHT } = Dimensions.get('window')
const MODAL_HEIGHT = SCREEN_HEIGHT * 0.7

interface NotesModalProps {
  visible: boolean
  onClose: () => void
  word: string
}

export default function NotesModal({ visible, onClose, word }: NotesModalProps) {
  const dispatch = useAppDispatch()
  const existingNotes = useAppSelector((state) => selectPersonalNotesForWord(state, word))

  const translateY = useRef(new Animated.Value(MODAL_HEIGHT)).current
  const [title, setTitle] = useState('')
  const [note, setNote] = useState('')
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null)

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return gestureState.dy > 0 && Math.abs(gestureState.dy) > Math.abs(gestureState.dx)
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy)
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100 || gestureState.vy > 0.5) {
          closeModal()
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start()
        }
      },
    })
  ).current

  useEffect(() => {
    if (visible) {
      openModal()
      setTitle('')
      setNote('')
    }
  }, [visible])

  const openModal = () => {
    translateY.setValue(MODAL_HEIGHT)
    Animated.spring(translateY, {
      toValue: 0,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
    }).start()
  }

  const closeModal = () => {
    Animated.timing(translateY, {
      toValue: MODAL_HEIGHT,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      onClose()
    })
  }

  const handleSave = () => {
    if (title.trim() || note.trim()) {
      if (editingNoteId) {
        // Update existing note
        dispatch(updatePersonalNote({
          id: editingNoteId,
          title: title.trim(),
          content: note.trim()
        }))
      } else {
        // Create new note
        dispatch(addPersonalNote({
          word: word,
          title: title.trim(),
          content: note.trim()
        }))
      }
      resetForm()
      closeModal()
    }
  }

  const handleEditNote = (noteId: string, noteTitle: string, noteContent: string) => {
    setEditingNoteId(noteId)
    setTitle(noteTitle)
    setNote(noteContent)
  }

  const handleDeleteNote = (noteId: string) => {
    dispatch(deletePersonalNote(noteId))
  }

  const resetForm = () => {
    setTitle('')
    setNote('')
    setEditingNoteId(null)
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={closeModal}
    >
      <TouchableWithoutFeedback onPress={closeModal}>
        <View style={styles.overlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardContainer}
          >
            <TouchableWithoutFeedback>
              <Animated.View
                style={[
                  styles.modalContainer,
                  {
                    transform: [{ translateY }],
                  },
                ]}
                {...panResponder.panHandlers}
              >
                {/* Handle indicator */}
                <View style={styles.handle} />

                {/* Header */}
                <View style={styles.header}>
                  <Text style={styles.title}>
                    {editingNoteId ? 'Editar nota' : 'Notas'} para "{word}"
                  </Text>
                  <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                    <Icon name="x" size={24} color="#666" />
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                  {/* Existing notes */}
                  {existingNotes.length > 0 && !editingNoteId && (
                    <View style={styles.existingNotesSection}>
                      <Text style={styles.sectionTitle}>Tus notas</Text>
                      {existingNotes.map((existingNote) => (
                        <View key={existingNote.id} style={styles.existingNoteItem}>
                          <View style={styles.existingNoteContent}>
                            {existingNote.title && (
                              <Text style={styles.existingNoteTitle}>{existingNote.title}</Text>
                            )}
                            <Text style={styles.existingNoteText} numberOfLines={3}>
                              {existingNote.content}
                            </Text>
                            <Text style={styles.existingNoteDate}>
                              {new Date(existingNote.createdAt).toLocaleDateString()}
                            </Text>
                          </View>
                          <View style={styles.existingNoteActions}>
                            <TouchableOpacity
                              style={styles.existingNoteActionButton}
                              onPress={() => handleEditNote(existingNote.id, existingNote.title, existingNote.content)}
                            >
                              <Icon name="edit-2" size={18} color="#4ECDC4" />
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={styles.existingNoteActionButton}
                              onPress={() => handleDeleteNote(existingNote.id)}
                            >
                              <Icon name="trash-2" size={18} color="#FF6B6B" />
                            </TouchableOpacity>
                          </View>
                        </View>
                      ))}
                    </View>
                  )}

                  {/* New/Edit note form */}
                  {(editingNoteId || existingNotes.length === 0 || (!editingNoteId && title)) && (
                    <View style={styles.paperContainer}>
                      <View style={styles.paperNote}>
                        {/* Paper lines decoration */}
                        <View style={styles.paperLines} />

                        {/* Title input */}
                        <TextInput
                          style={styles.titleInput}
                          placeholder="Título de la nota..."
                          value={title}
                          onChangeText={setTitle}
                          multiline={false}
                          placeholderTextColor="#999"
                        />

                        {/* Note content input */}
                        <TextInput
                          style={styles.noteInput}
                          placeholder="Escribe tu nota aquí..."
                          value={note}
                          onChangeText={setNote}
                          multiline
                          textAlignVertical="top"
                          placeholderTextColor="#999"
                        />

                        {/* Paper tape decoration */}
                        <View style={styles.paperTape} />
                      </View>
                    </View>
                  )}

                  {/* Add new note button (when not in edit mode and notes exist) */}
                  {!editingNoteId && existingNotes.length > 0 && !title && !note && (
                    <TouchableOpacity
                      style={styles.addNewNoteButton}
                      onPress={() => setTitle(' ')} // Trigger form display
                    >
                      <Icon name="plus" size={24} color="#4ECDC4" />
                      <Text style={styles.addNewNoteText}>Agregar nueva nota</Text>
                    </TouchableOpacity>
                  )}
                </ScrollView>

                {/* Action buttons */}
                {(title || note || editingNoteId) && (
                  <View style={styles.bottomContainer}>
                    {editingNoteId && (
                      <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={resetForm}
                      >
                        <Text style={styles.cancelButtonText}>Cancelar</Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      style={[
                        styles.saveButton,
                        (!title.trim() && !note.trim()) && styles.saveButtonDisabled,
                        editingNoteId && styles.saveButtonEdit
                      ]}
                      onPress={handleSave}
                      disabled={!title.trim() && !note.trim()}
                    >
                      <Icon name="check" size={20} color="white" />
                      <Text style={styles.saveButtonText}>
                        {editingNoteId ? 'Actualizar nota' : 'Guardar nota'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </Animated.View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  keyboardContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#F5F5DC',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: MODAL_HEIGHT,
    paddingBottom: 34,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  closeButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  paperContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  paperNote: {
    flex: 1,
    backgroundColor: '#FFFEF7',
    borderRadius: 8,
    padding: 20,
    position: 'relative',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 3,
    borderLeftColor: '#FFB6C1',
  },
  paperLines: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
  },
  titleInput: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 8,
    fontFamily: 'System',
  },
  noteInput: {
    flex: 1,
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
    fontFamily: 'System',
  },
  paperTape: {
    position: 'absolute',
    top: -5,
    right: 20,
    width: 30,
    height: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 2,
    transform: [{ rotate: '45deg' }],
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4ECDC4',
    paddingVertical: 16,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  saveButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  existingNotesSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 12,
  },
  existingNoteItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFEF7',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderLeftWidth: 3,
    borderLeftColor: '#FFB6C1',
  },
  existingNoteContent: {
    flex: 1,
    marginRight: 12,
  },
  existingNoteTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  existingNoteText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  existingNoteDate: {
    fontSize: 12,
    color: '#999',
  },
  existingNoteActions: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  existingNoteActionButton: {
    padding: 8,
    marginLeft: 4,
  },
  addNewNoteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderWidth: 2,
    borderColor: '#4ECDC4',
    borderStyle: 'dashed',
    borderRadius: 8,
    marginBottom: 20,
  },
  addNewNoteText: {
    fontSize: 16,
    color: '#4ECDC4',
    fontWeight: '500',
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#CCC',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  saveButtonEdit: {
    flex: 1,
  },
})