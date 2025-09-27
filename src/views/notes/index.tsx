import React, { useRef, useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  FlatList,
  Animated,
  Dimensions,
  Alert,
  TextInput
} from 'react-native'
import Icon from 'react-native-vector-icons/Feather'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { selectPersonalNotesByDateDesc, selectFilteredPersonalNotes } from '@/features/notes/models/selectors'
import { deletePersonalNote } from '@/features/notes/models/personalNotesSlice'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type { AppStackParamList } from '@/navigation/AppStackNavigator'
import type { PersonalNote } from '@/features/notes/models/types'

const { width: SCREEN_WIDTH } = Dimensions.get('window')

type NavigationProp = NativeStackNavigationProp<AppStackParamList, 'PersonalNotes'>

interface NoteCardProps {
  note: PersonalNote
  index: number
  onEdit: (note: PersonalNote) => void
  onDelete: (noteId: string) => void
}

const NoteCard: React.FC<NoteCardProps> = ({ note, index, onEdit, onDelete }) => {
  const scaleAnim = useRef(new Animated.Value(0.8)).current
  const opacityAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        delay: index * 50,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        delay: index * 50,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start()
  }, [])

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.98,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start()
    onEdit(note)
  }

  const handleDelete = () => {
    Alert.alert(
      'Eliminar nota',
      '¿Estás seguro de que quieres eliminar esta nota?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => onDelete(note.id)
        }
      ]
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return 'Hoy'
    if (diffDays === 2) return 'Ayer'
    if (diffDays <= 7) return `Hace ${diffDays - 1} días`

    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    })
  }

  return (
    <Animated.View
      style={[
        styles.noteCardContainer,
        {
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <TouchableOpacity
        style={styles.noteCard}
        onPress={handlePress}
        activeOpacity={0.9}
      >
        {/* Note header */}
        <View style={styles.noteHeader}>
          <View style={styles.wordTag}>
            <Icon name="book-open" size={14} color="#9B59B6" />
            <Text style={styles.wordTagText}>{note.word}</Text>
          </View>
          <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
            <Icon name="trash-2" size={16} color="#FF6B6B" />
          </TouchableOpacity>
        </View>

        {/* Note title */}
        {note.title && (
          <Text style={styles.noteTitle} numberOfLines={2}>
            {note.title}
          </Text>
        )}

        {/* Note content */}
        <Text style={styles.noteContent} numberOfLines={4}>
          {note.content}
        </Text>

        {/* Note footer */}
        <View style={styles.noteFooter}>
          <Text style={styles.dateText}>{formatDate(note.createdAt)}</Text>
          <View style={styles.noteActions}>
            <TouchableOpacity style={styles.actionButton} onPress={handlePress}>
              <Icon name="edit-2" size={16} color="#9B59B6" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Paper decoration */}
        <View style={styles.paperTape} />
      </TouchableOpacity>
    </Animated.View>
  )
}

export default function PersonalNotesScreen() {
  const navigation = useNavigation<NavigationProp>()
  const dispatch = useAppDispatch()
  const [searchTerm, setSearchTerm] = useState('')
  const [isSearchVisible, setIsSearchVisible] = useState(false)
  const searchInputRef = useRef<TextInput>(null)
  const allNotes = useAppSelector(selectPersonalNotesByDateDesc)
  const notes = useAppSelector(state => selectFilteredPersonalNotes(state, searchTerm))

  const handleBackPress = () => {
    navigation.goBack()
  }

  const handleEditNote = (note: PersonalNote) => {
    // TODO: Open edit modal or navigate to edit screen
    console.log('Edit note:', note.id)
  }

  const handleDeleteNote = (noteId: string) => {
    dispatch(deletePersonalNote(noteId))
  }

  const handleSearchPress = () => {
    setIsSearchVisible(!isSearchVisible)
    if (!isSearchVisible) {
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 100)
    } else {
      setSearchTerm('')
    }
  }

  const handleSearchClear = () => {
    setSearchTerm('')
    setIsSearchVisible(false)
  }

  const renderNoteCard = ({ item, index }: { item: PersonalNote; index: number }) => (
    <NoteCard
      note={item}
      index={index}
      onEdit={handleEditNote}
      onDelete={handleDeleteNote}
    />
  )

  const ListHeader = () => (
    <View style={styles.statsContainer}>
      <View style={styles.statItem}>
        <Text style={styles.statNumber}>{searchTerm ? notes.length : allNotes.length}</Text>
        <Text style={styles.statLabel}>
          {(searchTerm ? notes.length : allNotes.length) === 1 ? 'Nota' : 'Notas'}
          {searchTerm && ` (${notes.length} de ${allNotes.length})`}
        </Text>
      </View>
      <View style={styles.statDivider} />
      <View style={styles.statItem}>
        <Text style={styles.statNumber}>
          {new Set((searchTerm ? notes : allNotes).map(n => n.word)).size}
        </Text>
        <Text style={styles.statLabel}>Palabras</Text>
      </View>
      <View style={styles.statDivider} />
      <View style={styles.statItem}>
        <Text style={styles.statNumber}>
          {allNotes.length > 0
            ? formatDate(allNotes[0].createdAt)
            : '-'
          }
        </Text>
        <Text style={styles.statLabel}>Última</Text>
      </View>
    </View>
  )

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short'
    })
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5DC" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mis Notas</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.searchButton} onPress={handleSearchPress}>
            <Icon name={isSearchVisible ? "x" : "search"} size={24} color="#9B59B6" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Input */}
      {isSearchVisible && (
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Icon name="search" size={16} color="#999" style={styles.searchIcon} />
            <TextInput
              ref={searchInputRef}
              style={styles.searchInput}
              placeholder="Buscar en título o contenido..."
              placeholderTextColor="#999"
              value={searchTerm}
              onChangeText={setSearchTerm}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {searchTerm.length > 0 && (
              <TouchableOpacity onPress={handleSearchClear} style={styles.clearButton}>
                <Icon name="x" size={16} color="#999" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {/* Notes list */}
      {notes.length > 0 ? (
        <FlatList
          data={notes}
          renderItem={renderNoteCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
          ListHeaderComponent={ListHeader}
          ListHeaderComponentStyle={styles.listHeader}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIcon}>
            <Icon
              name={searchTerm ? "search" : "edit-3"}
              size={64}
              color="#CCC"
            />
          </View>
          <Text style={styles.emptyTitle}>
            {searchTerm
              ? 'No se encontraron notas'
              : 'No tienes notas aún'
            }
          </Text>
          <Text style={styles.emptySubtitle}>
            {searchTerm
              ? `No hay notas que coincidan con "${searchTerm}". Intenta con otras palabras.`
              : 'Tus notas personales sobre palabras aparecerán aquí.\nToca el icono de notas en cualquier palabra para empezar.'
            }
          </Text>
        </View>
      )}
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
    paddingTop: 20,
    paddingBottom: 24,
  },
  backButton: {
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
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  headerRight: {
    width: 40,
    alignItems: 'center',
  },
  searchButton: {
    padding: 8,
    backgroundColor: 'rgba(155, 89, 182, 0.15)',
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 16,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  listHeader: {
    marginBottom: 8,
  },
  noteCardContainer: {
    marginBottom: 4,
  },
  noteCard: {
    backgroundColor: '#FFFEF7',
    borderRadius: 16,
    padding: 20,
    position: 'relative',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#9B59B6',
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  wordTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(155, 89, 182, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  wordTagText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9B59B6',
    marginLeft: 4,
  },
  deleteButton: {
    padding: 4,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
    lineHeight: 24,
  },
  noteContent: {
    fontSize: 16,
    color: '#444',
    lineHeight: 22,
    marginBottom: 16,
  },
  noteFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
  },
  noteActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  paperTape: {
    position: 'absolute',
    top: -6,
    right: 30,
    width: 24,
    height: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 2,
    transform: [{ rotate: '45deg' }],
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    marginBottom: 24,
    opacity: 0.3,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#666',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    lineHeight: 24,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    padding: 0,
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
})