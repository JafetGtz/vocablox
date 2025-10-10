import React, { useState, useRef } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  FlatList,
  Animated,
  Alert,
  TextInput,
} from 'react-native'
import Icon from 'react-native-vector-icons/Feather'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { selectUserWordsByDateDesc, selectUserWordsCount, selectFilteredUserWords } from '@/features/userWords/selectors'
import { deleteUserWord } from '@/features/userWords/userWordsSlice'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type { AppStackParamList } from '@/navigation/AppStackNavigator'
import type { UserWord } from '@/features/userWords/userWordsSlice'
import UserWordModal from '@/components/UserWordModal'

type NavigationProp = NativeStackNavigationProp<AppStackParamList, 'UserWords'>

interface WordCardProps {
  word: UserWord
  index: number
  onEdit: (word: UserWord) => void
  onDelete: (wordId: string) => void
}

const WordCard: React.FC<WordCardProps> = ({ word, index, onEdit, onDelete }) => {
  const scaleAnim = useRef(new Animated.Value(0.8)).current
  const opacityAnim = useRef(new Animated.Value(0)).current

  React.useEffect(() => {
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
    onEdit(word)
  }

  const handleDelete = () => {
    Alert.alert(
      'Eliminar palabra',
      '¿Estás seguro de que quieres eliminar esta palabra?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => onDelete(word.id)
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
        styles.wordCardContainer,
        {
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <TouchableOpacity
        style={styles.wordCard}
        onPress={handlePress}
        activeOpacity={0.9}
      >
        {/* Word header */}
        <View style={styles.wordHeader}>
          <View style={styles.wordTag}>
            <Icon name="user" size={14} color="#9B59B6" />
            <Text style={styles.wordTagText}>Mi palabra</Text>
          </View>
          <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
            <Icon name="trash-2" size={16} color="#FF6B6B" />
          </TouchableOpacity>
        </View>

        {/* Word title */}
        <Text style={styles.wordTitle}>{word.palabra}</Text>

        {/* Word definition */}
        <Text style={styles.wordDefinition} numberOfLines={3}>
          {word.significado}
        </Text>

        {/* Word example */}
        {word.ejemplo && (
          <Text style={styles.wordExample} numberOfLines={2}>
            {word.ejemplo}
          </Text>
        )}

        {/* Word footer */}
        <View style={styles.wordFooter}>
          <Text style={styles.dateText}>{formatDate(word.createdAt)}</Text>
          <TouchableOpacity style={styles.editButton} onPress={handlePress}>
            <Icon name="edit-2" size={16} color="#9B59B6" />
          </TouchableOpacity>
        </View>

        {/* Paper decoration */}
        <View style={styles.paperTape} />
      </TouchableOpacity>
    </Animated.View>
  )
}

export default function UserWordsScreen() {
  const navigation = useNavigation<NavigationProp>()
  const dispatch = useAppDispatch()
  const [searchTerm, setSearchTerm] = useState('')
  const [isSearchVisible, setIsSearchVisible] = useState(false)
  const [showWordModal, setShowWordModal] = useState(false)
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add')
  const [selectedWord, setSelectedWord] = useState<UserWord | undefined>(undefined)
  const searchInputRef = useRef<TextInput>(null)
  const allWords = useAppSelector(selectUserWordsByDateDesc)
  const totalWords = useAppSelector(selectUserWordsCount)
  const words = useAppSelector(state => selectFilteredUserWords(state, searchTerm))

  const handleBackPress = () => {
    navigation.goBack()
  }

  const handleAddWord = () => {
    setModalMode('add')
    setSelectedWord(undefined)
    setShowWordModal(true)
  }

  const handleEditWord = (word: UserWord) => {
    setModalMode('edit')
    setSelectedWord(word)
    setShowWordModal(true)
  }

  const handleDeleteWord = (wordId: string) => {
    dispatch(deleteUserWord(wordId))
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

  const renderWordCard = ({ item, index }: { item: UserWord; index: number }) => (
    <WordCard
      word={item}
      index={index}
      onEdit={handleEditWord}
      onDelete={handleDeleteWord}
    />
  )

  const ListHeader = () => (
    <View style={styles.statsContainer}>
      <View style={styles.statItem}>
        <Text style={styles.statNumber}>{searchTerm ? words.length : totalWords}</Text>
        <Text style={styles.statLabel}>
          {(searchTerm ? words.length : totalWords) === 1 ? 'Palabra' : 'Palabras'}
          {searchTerm && ` (${words.length} de ${totalWords})`}
        </Text>
      </View>
      <View style={styles.statDivider} />
      <View style={styles.statItem}>
        <Text style={styles.statNumber}>
          {allWords.length > 0
            ? formatDate(allWords[0].createdAt)
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
     

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mis Palabras</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.searchButton} onPress={handleSearchPress}>
            <Icon name={isSearchVisible ? "x" : "search"} size={20} color="#9B59B6" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.addButton} onPress={handleAddWord}>
            <Icon name="plus" size={20} color="#FFF" />
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
              placeholder="Buscar en mis palabras..."
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

      {/* Words list */}
      {words.length > 0 ? (
        <FlatList
          data={words}
          renderItem={renderWordCard}
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
              name={searchTerm ? "search" : "book"}
              size={64}
              color="#CCC"
            />
          </View>
          <Text style={styles.emptyTitle}>
            {searchTerm
              ? 'No se encontraron palabras'
              : 'No tienes palabras aún'
            }
          </Text>
          <Text style={styles.emptySubtitle}>
            {searchTerm
              ? `No hay palabras que coincidan con "${searchTerm}". Intenta con otras palabras.`
              : 'Agrega tus propias palabras para expandir tu vocabulario personal.'
            }
          </Text>
          {!searchTerm && (
            <TouchableOpacity style={styles.addFirstWordButton} onPress={handleAddWord}>
              <Icon name="plus" size={20} color="#FFF" style={styles.addFirstWordIcon} />
              <Text style={styles.addFirstWordText}>Agregar primera palabra</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* User Word Modal */}
      <UserWordModal
        visible={showWordModal}
        onClose={() => setShowWordModal(false)}
        mode={modalMode}
        word={selectedWord}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  addButton: {
    padding: 8,
    backgroundColor: '#9B59B6',
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#9B59B6',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
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
  wordCardContainer: {
    marginBottom: 4,
  },
  wordCard: {
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
  wordHeader: {
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
  wordTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
    lineHeight: 26,
  },
  wordDefinition: {
    fontSize: 16,
    color: '#444',
    lineHeight: 22,
    marginBottom: 12,
  },
  wordExample: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    fontStyle: 'italic',
    marginBottom: 12,
  },
  wordFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
  },
  editButton: {
    padding: 8,
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
    marginBottom: 32,
  },
  addFirstWordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#9B59B6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#9B59B6',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  addFirstWordIcon: {
    marginRight: 8,
  },
  addFirstWordText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '600',
  },
})