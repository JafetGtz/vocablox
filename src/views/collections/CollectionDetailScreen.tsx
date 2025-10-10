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
  Dimensions
} from 'react-native'
import Icon from 'react-native-vector-icons/Feather'
import { useAppSelector } from '@/store/hooks'
import { selectNotesByCollection, selectCollectionById } from '@/features/notes/models/selectors'
import { useNavigation, useRoute } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type { AppStackParamList } from '@/navigation/AppStackNavigator'
import type { RouteProp } from '@react-navigation/native'

const { width: SCREEN_WIDTH } = Dimensions.get('window')

type NavigationProp = NativeStackNavigationProp<AppStackParamList, 'CollectionDetail'>
type RouteProp_ = RouteProp<AppStackParamList, 'CollectionDetail'>

interface WordCardProps {
  word: any
  index: number
}

const WordCard: React.FC<WordCardProps> = ({ word, index }) => {
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
      <TouchableOpacity style={styles.wordCard} activeOpacity={0.8}>
        {/* Word header */}
        <View style={styles.wordHeader}>
          <Text style={styles.wordText}>{word.palabra}</Text>
          <View style={styles.favoriteButton}>
            <Icon
              name={word.isFavorite ? "heart" : "heart"}
              size={16}
              color={word.isFavorite ? "#FF6B6B" : "#CCC"}
              fill={word.isFavorite ? "#FF6B6B" : "none"}
            />
          </View>
        </View>

        {/* Word meaning */}
        <Text style={styles.wordMeaning} numberOfLines={3}>
          {word.significado}
        </Text>

        {/* Word example (if exists) */}
        {word.ejemplo && (
          <Text style={styles.wordExample} numberOfLines={2}>
            "{word.ejemplo}"
          </Text>
        )}

        {/* Card footer */}
        <View style={styles.cardFooter}>
          <Text style={styles.dateText}>
            {new Date(word.createdAt).toLocaleDateString('es-ES', {
              day: 'numeric',
              month: 'short'
            })}
          </Text>
          <View style={styles.cardActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Icon name="volume-2" size={16} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Icon name="share" size={16} color="#666" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  )
}

export default function CollectionDetailScreen() {
  const navigation = useNavigation<NavigationProp>()
  const route = useRoute<RouteProp_>()

  const { collectionId, collectionName } = route.params
  const collection = useAppSelector((state) => selectCollectionById(state, collectionId))
  const words = useAppSelector((state) => selectNotesByCollection(state, collectionId))

  const handleBackPress = () => {
    navigation.goBack()
  }

  const renderWordCard = ({ item, index }: { item: any; index: number }) => (
    <WordCard word={item} index={index} />
  )

  const ListHeader = () => (
    <View style={styles.statsContainer}>
      <View style={styles.statItem}>
        <Text style={styles.statNumber}>{words.length}</Text>
        <Text style={styles.statLabel}>
          {words.length === 1 ? 'Palabra' : 'Palabras'}
        </Text>
      </View>
      <View style={styles.statDivider} />
      <View style={styles.statItem}>
        <Text style={styles.statNumber}>
          {words.filter(w => w.isFavorite).length}
        </Text>
        <Text style={styles.statLabel}>Favoritas</Text>
      </View>
      <View style={styles.statDivider} />
      <View style={styles.statItem}>
        <Text style={styles.statNumber}>
          {new Date(collection?.createdAt || '').toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short'
          })}
        </Text>
        <Text style={styles.statLabel}>Creada</Text>
      </View>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5DC" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>

        <View style={styles.headerContent}>
          {collection && (
            <View style={[styles.collectionIcon, { backgroundColor: collection.color }]}>
              <Text style={styles.collectionEmoji}>{collection.emoji}</Text>
            </View>
          )}
          <View style={styles.headerText}>
            <Text style={styles.headerTitle} numberOfLines={1}>
              {collectionName}
            </Text>
            <Text style={styles.headerSubtitle}>
              {words.length} {words.length === 1 ? 'palabra' : 'palabras'}
            </Text>
          </View>
        </View>
      </View>

      {/* Words list */}
      {words.length > 0 ? (
        <FlatList
          data={words}
          renderItem={renderWordCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          ListHeaderComponent={ListHeader}
          ListHeaderComponentStyle={styles.listHeader}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIcon}>
            <Icon name="book-open" size={48} color="#CCC" />
          </View>
          <Text style={styles.emptyTitle}>Sin palabras guardadas</Text>
          <Text style={styles.emptySubtitle}>
            Las palabras que guardes en esta colección aparecerán aquí
          </Text>
        </View>
      )}
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
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  collectionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  collectionEmoji: {
    fontSize: 20,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  menuButton: {
    padding: 8,
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
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  wordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  wordText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    flex: 1,
  },
  favoriteButton: {
    padding: 4,
  },
  wordMeaning: {
    fontSize: 16,
    color: '#444',
    lineHeight: 22,
    marginBottom: 8,
  },
  wordExample: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    lineHeight: 20,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
    color: '#999',
  },
  cardActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    marginBottom: 16,
    opacity: 0.5,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  addWordsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  addWordsText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
})