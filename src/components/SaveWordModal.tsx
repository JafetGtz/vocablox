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
  ScrollView
} from 'react-native'
import Icon from 'react-native-vector-icons/Feather'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { selectCollectionsWithCount } from '@/features/notes/models/selectors'
import { addNote, addCollection } from '@/features/notes/models/notesSlice'
import CreateCollectionModal from './CreateCollectionModal'

const { height: SCREEN_HEIGHT } = Dimensions.get('window')
const MODAL_HEIGHT = SCREEN_HEIGHT * 0.6

interface SaveWordModalProps {
  visible: boolean
  onClose: () => void
  word: string
  significado: string
  ejemplo?: string
}

export default function SaveWordModal({ visible, onClose, word, significado, ejemplo }: SaveWordModalProps) {
  const dispatch = useAppDispatch()
  const collections = useAppSelector(selectCollectionsWithCount)
  const translateY = useRef(new Animated.Value(MODAL_HEIGHT)).current
  const [showCreateCollection, setShowCreateCollection] = useState(false)

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

  const handleSaveToCollection = (collectionId: string) => {
    dispatch(addNote({
      palabra: word,
      significado: significado,
      ejemplo: ejemplo,
      collectionId: collectionId
    }))
    closeModal()
  }

  const handleCreateCollection = (name: string, color: string, emoji: string) => {
    const newCollection = dispatch(addCollection({
      name,
      color,
      emoji
    }))
    setShowCreateCollection(false)
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
                <Text style={styles.title}>Guardar "{word}"</Text>
                <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                  <Icon name="x" size={24} color="#666" />
                </TouchableOpacity>
              </View>

              {/* Collections list */}
              <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <Text style={styles.sectionTitle}>Mis colecciones</Text>
                
                {collections.map((collection) => (
                  <TouchableOpacity
                    key={collection.id}
                    style={styles.collectionItem}
                    onPress={() => handleSaveToCollection(collection.id)}
                  >
                    <View style={[styles.colorIndicator, { backgroundColor: collection.color }]}>
                      <Text style={styles.emojiIndicator}>{collection.emoji}</Text>
                    </View>
                    <View style={styles.collectionInfo}>
                      <Text style={styles.collectionName}>{collection.name}</Text>
                      <Text style={styles.collectionCount}>{collection.count} palabras</Text>
                    </View>
                    <Icon name="plus" size={20} color="#999" />
                  </TouchableOpacity>
                ))}

                {/* Create new collection */}
                <TouchableOpacity
                  style={styles.createCollectionButton}
                  onPress={() => setShowCreateCollection(true)}
                >
                  <View style={styles.createIcon}>
                    <Icon name="plus" size={20} color="#4ECDC4" />
                  </View>
                  <Text style={styles.createCollectionText}>Crear nueva colección</Text>
                </TouchableOpacity>
              </ScrollView>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>

      <CreateCollectionModal
        visible={showCreateCollection}
        onClose={() => setShowCreateCollection(false)}
        onSave={handleCreateCollection}
      />
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
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: MODAL_HEIGHT,
    paddingBottom: 34, // Safe area for iPhone
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
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 16,
  },
  collectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    marginBottom: 12,
  },
  colorIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emojiIndicator: {
    fontSize: 16,
  },
  collectionInfo: {
    flex: 1,
  },
  collectionName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  collectionCount: {
    fontSize: 14,
    color: '#999',
  },
  createCollectionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: '#4ECDC4',
    borderStyle: 'dashed',
    borderRadius: 12,
    marginTop: 8,
  },
  createIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(78, 205, 196, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  createCollectionText: {
    fontSize: 16,
    color: '#4ECDC4',
    fontWeight: '500',
  },
})