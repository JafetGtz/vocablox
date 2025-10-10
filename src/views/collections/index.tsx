import React, { useRef, useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  FlatList,
  Animated,
  Dimensions
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Icon from 'react-native-vector-icons/Feather'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { selectCollectionsWithCount } from '@/features/notes/models/selectors'
import { addCollection } from '@/features/notes/models/notesSlice'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type { AppStackParamList } from '@/navigation/AppStackNavigator'
import CreateCollectionModal from '@/components/CreateCollectionModal'

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const CARD_WIDTH = (SCREEN_WIDTH - 60) / 2

type NavigationProp = NativeStackNavigationProp<AppStackParamList, 'Collections'>

interface CollectionCardProps {
  collection: any
  onPress: () => void
  index: number
}

const CollectionCard: React.FC<CollectionCardProps> = ({ collection, onPress, index }) => {
  const scaleAnim = useRef(new Animated.Value(0.8)).current
  const opacityAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        delay: index * 100,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        delay: index * 100,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start()
  }, [])

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start()
    onPress()
  }

  return (
    <Animated.View
      style={[
        styles.cardContainer,
        {
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <TouchableOpacity
        style={[styles.collectionCard, { backgroundColor: collection.color + '15' }]}
        onPress={handlePress}
        activeOpacity={0.9}
      >
        {/* Card header with emoji and count */}
        <View style={styles.cardHeader}>
          <View style={[styles.emojiContainer, { backgroundColor: collection.color }]}>
            <Text style={styles.emoji}>{collection.emoji}</Text>
          </View>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{collection.count}</Text>
          </View>
        </View>

        {/* Card content */}
        <View style={styles.cardContent}>
          <Text style={styles.collectionName} numberOfLines={2}>
            {collection.name}
          </Text>
          <Text style={styles.collectionSubtitle}>
            {collection.count === 0
              ? 'Sin palabras'
              : `${collection.count} ${collection.count === 1 ? 'palabra' : 'palabras'}`
            }
          </Text>
        </View>

        {/* Card footer with action indicator */}
        <View style={styles.cardFooter}>
          <Icon name="arrow-right" size={16} color={collection.color} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  )
}

export default function CollectionsScreen() {
  const navigation = useNavigation<NavigationProp>()
  const dispatch = useAppDispatch()
  const collections = useAppSelector(selectCollectionsWithCount)
  const [showCreateModal, setShowCreateModal] = useState(false)

  const handleCollectionPress = (collectionId: string, collectionName: string) => {
    navigation.navigate('CollectionDetail', {
      collectionId,
      collectionName
    })
  }

  const handleCreateCollection = (name: string, color: string, emoji: string) => {
    dispatch(addCollection({ name, color, emoji }))
    setShowCreateModal(false)
  }

  const renderCollectionCard = ({ item, index }: { item: any; index: number }) => (
    <CollectionCard
      collection={item}
      index={index}
      onPress={() => handleCollectionPress(item.id, item.name)}
    />
  )

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5DC" />

      {/* Header with just the add button */}
      <View style={styles.topBar}>
        <View style={styles.topBarRight}>
          <TouchableOpacity style={styles.addButton} onPress={() => setShowCreateModal(true)}>
            <Icon name="plus" size={24} color="#4ECDC4" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Collections grid */}
      {collections.length > 0 ? (
        <FlatList
          data={collections}
          renderItem={renderCollectionCard}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.gridContainer}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIcon}>
            <Icon name="folder" size={48} color="#CCC" />
          </View>
          <Text style={styles.emptyTitle}>No hay colecciones</Text>
          <Text style={styles.emptySubtitle}>
            Comienza guardando palabras para crear tu primera colección
          </Text>
        </View>
      )}

      {/* Create Collection Modal */}
      <CreateCollectionModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleCreateCollection}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  topBarRight: {
    alignItems: 'center',
  },
  addButton: {
    padding: 8,
    backgroundColor: 'rgba(78, 205, 196, 0.15)',
    borderRadius: 20,
   
  },
  gridContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  row: {
    justifyContent: 'space-between',
  },
  cardContainer: {
    width: CARD_WIDTH,
  },
  collectionCard: {
    backgroundColor: 'black',
    borderRadius: 16,
    padding: 16,
    minHeight: 160,
   
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  emojiContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    
    shadowRadius: 2,
  },
  emoji: {
    fontSize: 20,
  },
  countBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: 'center',
  },
  countText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  collectionName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
    lineHeight: 22,
  },
  collectionSubtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
  cardFooter: {
    alignItems: 'flex-end',
    marginTop: 8,
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
  },
})