import React, { useState, useEffect, useRef, } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Animated, StatusBar, PanResponder, ScrollView, Pressable, ImageBackground } from 'react-native'
import Icon from 'react-native-vector-icons/Feather'
import Iconicos from 'react-native-vector-icons/Ionicons'

import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { selectEnabledUserWords } from '@/features/userWords/selectors'
import Speech from '@mhpdev/react-native-speech'
import SaveWordModal from '@/components/SaveWordModal'
import NotesModal from '@/components/NotesModal'
import GridMenu from '@/components/GridMenu'
import ShareModal from '@/components/ShareModal'
import ProfileSidebar from '@/components/ProfileSidebar'
import { AppStackParamList } from '@/navigation/AppStackNavigator'
import { DEFAULT_BACKGROUNDS } from '@/types/wizard'
import { setCustomBackgrounds } from '@/store/slices/settingsSlice'
import AsyncStorage from '@react-native-async-storage/async-storage'

// Static imports for all JSON files
import arteWords from '../../assets/jsons/arte.json'
import cienciaWords from '../../assets/jsons/ciencia.json'
import comidaWords from '../../assets/jsons/comida.json'
import deportesWords from '../../assets/jsons/deportes.json'
import derechoWords from '../../assets/jsons/derecho.json'
import ingenieriaWords from '../../assets/jsons/ingenieria.json'
import medicinaWords from '../../assets/jsons/medicina.json'
import negociosWords from '../../assets/jsons/negocios.json'
import tecnologiaWords from '../../assets/jsons/tecnologia.json'
import viajeWords from '../../assets/jsons/viaje.json'

interface Word {
  palabra: string
  significado: string
  ejemplo?: string
}

// umbral para decidir cambio

// Static word data lookup
const CATEGORY_WORDS: Record<string, Word[]> = {
  'technology': tecnologiaWords,
  'business': negociosWords,
  'science': cienciaWords,
  'arts': arteWords,
  'sports': deportesWords,
  'travel': viajeWords,
  'food': comidaWords,
  'medicine': medicinaWords,
  'law': derechoWords,
  'engineering': ingenieriaWords,
}

const SCROLL_PAD = 600;      // punto medio “virtual”
const SCROLL_SNAP = 40;



// límites del área que debe aceptar el gesto (ajústalos a tu UI)
const GESTURE_TOP = 120;    // espacio desde arriba (debajo del header)
const GESTURE_BOTTOM = 160; // espacio desde abajo (encima de los botones)

type HomeScreenNavigationProp = NativeStackNavigationProp<AppStackParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const dispatch = useAppDispatch();
  const { data, customBackgrounds } = useAppSelector((s) => s.settings)
  const [backgroundsLoaded, setBackgroundsLoaded] = useState(false)

  // Load custom backgrounds from AsyncStorage on component mount
  useEffect(() => {
    const loadCustomBackgrounds = async () => {
      try {
        const stored = await AsyncStorage.getItem('customBackgrounds')
        if (stored) {
          const backgrounds = JSON.parse(stored)
          console.log('Loaded custom backgrounds from AsyncStorage:', backgrounds)
          dispatch(setCustomBackgrounds(backgrounds))
        } else {
          console.log('No custom backgrounds found in AsyncStorage')
        }
      } catch (error) {
        console.error('Error loading custom backgrounds:', error)
      } finally {
        setBackgroundsLoaded(true)
      }
    }

    loadCustomBackgrounds()
  }, [dispatch])

  // Get dynamic text styles based on user settings
  const getTextStyle = (element: 'word' | 'meaning' | 'example') => {
    const color = data.text_colors?.[element] || (element === 'word' ? '#333' : element === 'meaning' ? '#444' : '#888')
    const size = data.text_sizes?.[element] || 'medium'
    const isVisible = data.text_visibility?.[element] !== false

    console.log(`HomeScreen ${element} style:`, {
      color,
      size,
      isVisible,
      text_colors: data.text_colors,
      text_sizes: data.text_sizes,
      text_visibility: data.text_visibility
    })

    if (!isVisible) return { display: 'none' }

    let fontSize = 18
    if (element === 'word') {
      fontSize = size === 'small' ? 24 : size === 'medium' ? 36 : size === 'large' ? 48 : 36
    } else if (element === 'meaning') {
      fontSize = size === 'small' ? 14 : size === 'medium' ? 18 : size === 'large' ? 36 : 18
    } else if (element === 'example') {
      fontSize = size === 'small' ? 12 : size === 'medium' ? 16 : size === 'large' ? 24 : 16
    }

    return {
      color,
      fontSize,
    }
  }

  // Get background image based on selected background
  const getBackgroundImage = () => {
    console.log('Getting background for ID:', data.background)
    console.log('Available custom backgrounds:', customBackgrounds)

    // First check default backgrounds
    const selectedBackground = DEFAULT_BACKGROUNDS.find(bg => bg.id === data.background)
    if (selectedBackground) {
      console.log('Using default background:', selectedBackground.name)
      return selectedBackground.value
    }

    // Then check custom backgrounds (with safety check)
    if (customBackgrounds && Array.isArray(customBackgrounds)) {
      const customBackground = customBackgrounds.find(bg => bg.id === data.background)
      if (customBackground) {
        console.log('Using custom background:', customBackground)
        return customBackground.value
      }
    }

    console.log('Using fallback background')
    // Fallback to default
    return DEFAULT_BACKGROUNDS[1]?.value // fallback to azul
  }
  const userWords = useAppSelector(selectEnabledUserWords)
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [words, setWords] = useState<Word[]>([])
  const [progress, setProgress] = useState(0)
  const fadeAnim = new Animated.Value(1);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utterQueueRef = useRef<string[]>([]);
  const scrollRef = useRef<ScrollView>(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [showGridMenu, setShowGridMenu] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showProfileSidebar, setShowProfileSidebar] = useState(false);

  const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

  Speech.initialize({
    language: 'es-MX',
    volume: 1.0,
    pitch: 1.2,
    rate: 0.8,
    ducking: false,

  });

  const buildUtterQueue = (w?: Word) => {
    if (!w) return [];
    const q: string[] = [];
    q.push(w.palabra);
    q.push('Significado:');
    q.push(w.significado);
    if (w.ejemplo) {
      q.push('Ejemplo:');
      q.push(w.ejemplo);
    }
    return q;
  };


  const speakSequence = async () => {
    console.log('speakSequence')
    if (!currentWord || isSpeaking) return;
    try {
      setIsSpeaking(true);
      await Speech.stop();                // corta cualquier lectura previa


      utterQueueRef.current = buildUtterQueue(currentWord);

      while (utterQueueRef.current.length > 0) {
        const next = utterQueueRef.current.shift()!;
        await Speech.speak(next);
        await delay(650);                 // PAUSA corta entre partes
      }
    } finally {
      setIsSpeaking(false);
    }
  };


  const stopSpeaking = async () => {
    utterQueueRef.current = [];
    setIsSpeaking(false);
    await Speech.stop();
  };

  // corta si hay swipe/cambio de índice
  useEffect(() => {
    stopSpeaking();
  }, [currentWordIndex]);

  // cleanup al desmontar
  useEffect(() => {
    return () => { Speech.stop(); };
  }, []);





  // Pan responder for swipe gestures
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only respond to vertical swipes with minimum distance
        return Math.abs(gestureState.dy) > 15 && Math.abs(gestureState.dy) > Math.abs(gestureState.dx)
      },
      onPanResponderGrant: () => {
        // Optional: Add haptic feedback when gesture starts
      },
      onPanResponderMove: (_, gestureState) => {
        // Optional: Add visual feedback during swipe
      },
      onPanResponderRelease: (_, gestureState) => {
        const { dy, vy } = gestureState

        // Consider both distance and velocity for better responsiveness
        const swipeThreshold = 30
        const velocityThreshold = 0.5

        if ((dy > swipeThreshold || vy > velocityThreshold) && currentWordIndex > 0) {
          // Swipe down - go to previous word
          navigateWord('up')
        } else if ((dy < -swipeThreshold || vy < -velocityThreshold) && currentWordIndex < words.length - 1) {
          // Swipe up - go to next word
          navigateWord('down')
        }
      },
    })
  ).current

  useEffect(() => {
    loadWords()
  }, [data.categories, userWords])

  useEffect(() => {
    loadCustomBackgrounds()
  }, [])

  const loadCustomBackgrounds = async () => {
    try {
      const stored = await AsyncStorage.getItem('customBackgrounds')
      console.log('Loaded from AsyncStorage:', stored)
      if (stored) {
        const backgrounds = JSON.parse(stored)
        console.log('Parsed backgrounds:', backgrounds)
        dispatch(setCustomBackgrounds(backgrounds))
      }
    } catch (error) {
      console.error('Error loading custom backgrounds:', error)
    }
  }


  useEffect(() => {
    // Coloca el scroll en el “medio” al montar
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ y: SCROLL_PAD, animated: false });
    });
  }, []);



  const handleSnap = (y: number) => {
    if (y < SCROLL_PAD - SCROLL_SNAP) navigateWord('up');
    else if (y > SCROLL_PAD + SCROLL_SNAP) navigateWord('down');
    scrollRef.current?.scrollTo({ y: SCROLL_PAD, animated: true });
  };


  const loadWords = async () => {
    try {
      const selectedCategories = data.categories || []
      console.log('Selected categories:', selectedCategories)

      let allWords: Word[] = []

      // Load words from each selected category
      if (selectedCategories.length > 0) {
        for (const category of selectedCategories) {
          const categoryWords = CATEGORY_WORDS[category]
          if (!categoryWords) {
            console.warn(`No words found for category: ${category}`)
            continue
          }

          allWords = [...allWords, ...categoryWords]
          console.log(`Loaded ${categoryWords.length} words from ${category} category`)
        }
      }

      // Add user words if they exist and are enabled
      if (userWords.length > 0) {
        const formattedUserWords: Word[] = userWords.map(userWord => ({
          palabra: userWord.palabra,
          significado: userWord.significado,
          ejemplo: userWord.ejemplo
        }))
        allWords = [...allWords, ...formattedUserWords]
        console.log(`Added ${userWords.length} user words`)
      }

      if (allWords.length === 0) {
        console.warn('No words available to load')
        return
      }

      // Shuffle words to provide variety
      const shuffledWords = allWords.sort(() => Math.random() - 0.5)
      setWords(shuffledWords)
      console.log('Total loaded words:', shuffledWords.length, 'words')
    } catch (error) {
      console.error('Error loading words:', error)
    }
  }

  const navigateWord = (direction: 'up' | 'down') => {
    if (words.length === 0) return

    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start()

    if (direction === 'up' && currentWordIndex > 0) {
      setCurrentWordIndex(currentWordIndex - 1)
      setProgress(Math.max(0, progress - 1))
    } else if (direction === 'down' && currentWordIndex < words.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1)
      setProgress(Math.min(5, progress + 1))
    }
  }

  const handleSaveWord = () => {
    setShowSaveModal(true)
  }

  const handleSaveToCollection = () => {
    // This function is no longer needed as the modal handles the saving directly
  }

  const handleNotesPress = () => {
    setShowNotesModal(true)
  }

  const handleGridPress = () => {
    setShowGridMenu(true)
  }

  const handleSharePress = () => {
    setShowShareModal(true)
  }

  const handleProfilePress = () => {
    setShowProfileSidebar(true)
  }


  const currentWord = words[currentWordIndex]
  const currentHour = new Date().getHours().toString().padStart(2, '0')
  const currentMinute = new Date().getMinutes().toString().padStart(2, '0')

  if (!currentWord) {
    return (
      <ImageBackground
        source={getBackgroundImage()}
        style={styles.container}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.overlay}>
          <Text style={styles.loadingText}>
            {words.length === 0 && data.categories?.length === 0
              ? 'No hay categorías seleccionadas. Completa tu configuración en el wizard.'
              : 'Cargando palabras...'}
          </Text>
        </SafeAreaView>
      </ImageBackground>
    )
  }

  return (
    <ImageBackground
      source={getBackgroundImage()}
      style={styles.container}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.overlay}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.time}>{currentHour}:{currentMinute}</Text>
          <Text style={styles.infinity}>∞</Text>
        </View>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>{progress}/5</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${(progress / 5) * 100}%` }]} />
          </View>
        </View>
        <View style={styles.headerRight}>
          <Icon name="award" size={24} color="#DAA520" />
        </View>
      </View>

      {/* Swipe area container */}
      <View style={styles.swipeContainer} {...panResponder.panHandlers}>
        {/* Navigation arrows */}
        <TouchableOpacity
          style={styles.upArrow}
          onPress={() => navigateWord('up')}
          disabled={currentWordIndex === 0}
        >
          <Icon
            name="chevron-up"
            size={20}
            color={currentWordIndex === 0 ? '#E0E0E0' : '#C0C0C0'}
          />
        </TouchableOpacity>

        {/* Main content (igual que lo tenías) */}
        <Animated.View style={[styles.wordContainer, { opacity: fadeAnim }]}>
          {data.text_visibility?.word !== false && (
            <Text style={[styles.word, getTextStyle('word')]}>{currentWord.palabra}</Text>
          )}

          {data.text_visibility?.meaning !== false && (
            <Text style={[styles.definition, getTextStyle('meaning')]}>{currentWord.significado}</Text>
          )}

          {currentWord.ejemplo && data.text_visibility?.example !== false && (
            <Text style={[styles.example, getTextStyle('example')]}>
              {currentWord.ejemplo}
            </Text>
          )}
        </Animated.View>

        {/* Action icons */}

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={speakSequence}
            disabled={isSpeaking}
            accessibilityLabel="Reproducir palabra, significado y ejemplo"
          >
            <Icon name="volume-2" size={22} color={isSpeaking ? '#bbb' : '#666'} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Icon name="info" size={22} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleSharePress}>
            <Icon name="share" size={22} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleNotesPress}>
            <Icon name="edit-3" size={22} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleSaveWord}>
            <Icon name="bookmark" size={22} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Down arrow */}
        <TouchableOpacity
          style={styles.downArrow}
          onPress={() => navigateWord('down')}
          disabled={currentWordIndex === words.length - 1}
        >
          <Icon
            name="chevron-down"
            size={20}
            color={currentWordIndex === words.length - 1 ? '#E0E0E0' : '#C0C0C0'}
          />
        </TouchableOpacity>

        {/* === Overlay de gesto tipo shorts (NO altera tu layout) === */}
        <ScrollView
          ref={scrollRef}
          style={styles.gestureOverlay}
          contentContainerStyle={{ height: SCROLL_PAD * 2 }}
          showsVerticalScrollIndicator={false}
          overScrollMode="never"
          bounces={false}
          decelerationRate="fast"
          onScrollEndDrag={e => handleSnap(e.nativeEvent.contentOffset.y)}
          onMomentumScrollEnd={e => handleSnap(e.nativeEvent.contentOffset.y)}
        />
        {/* ======================================================== */}
      </View>

      {/* Bottom navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={[styles.navButton, styles.gridButton]} onPress={handleGridPress}>
          <View style={styles.buttonContent}>
            <Icon name="grid" size={22} color="#9B59B6" />
            <Text style={styles.buttonLabel}>Menú</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navButton, styles.gamesButton]}
          onPress={handleGridPress}
        >
          <View style={styles.buttonContent}>
            <Iconicos name="game-controller-outline" size={22} color="#FFF" />
            <Text style={styles.gamesText}>Juegos</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navButton, styles.userButton]} onPress={handleProfilePress}>
          <View style={styles.buttonContent}>
            <Icon name="user" size={22} color="#34C759" />
            <Text style={styles.buttonLabel}>Perfil</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Save Word Modal */}
      <SaveWordModal
        visible={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        word={currentWord?.palabra || ''}
        significado={currentWord?.significado || ''}
        ejemplo={currentWord?.ejemplo}
      />

      {/* Notes Modal */}
      <NotesModal
        visible={showNotesModal}
        onClose={() => setShowNotesModal(false)}
        word={currentWord?.palabra || ''}
      />

      {/* Grid Menu */}
      <GridMenu
        visible={showGridMenu}
        onClose={() => setShowGridMenu(false)}
      />

      {/* Share Modal */}
      <ShareModal
        visible={showShareModal}
        onClose={() => setShowShareModal(false)}
        word={currentWord?.palabra || ''}
        definition={currentWord?.significado || ''}
        example={currentWord?.ejemplo}
      />

      {/* Profile Sidebar */}
      <ProfileSidebar
        visible={showProfileSidebar}
        onClose={() => setShowProfileSidebar(false)}
      />
      </SafeAreaView>
    </ImageBackground>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'space-between',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 100,
  },
  swipeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  time: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    marginRight: 8,
  },
  infinity: {
    fontSize: 20,
    color: '#666',
  },
  progressContainer: {
    alignItems: 'center',
    flex: 1,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  progressBar: {
    width: 100,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#DAA520',
    borderRadius: 2,
  },
  headerRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  upArrow: {
    alignSelf: 'center',
    padding: 10,
    marginBottom: 10,
  },
  downArrow: {
    alignSelf: 'center',
    padding: 10,
    marginTop: 10,
  },
  wordContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginVertical: 20,
  },
  word: {
    fontSize: 36,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: 'System',
  },
  audioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 20,
  },
  phonetic: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    fontStyle: 'italic',
  },
  definition: {
    fontSize: 18,
    color: '#444',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 26,
    paddingHorizontal: 20,
  },
  example: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    fontStyle: 'italic',
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 60,
    marginVertical: 20,
  },
  actionButton: {
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginHorizontal: 6,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 20,
   
  },
  navButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    minWidth: 80,
    minHeight: 60,
  },
  buttonContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    marginTop: 4,
  },
  gridButton: {
    backgroundColor: 'rgba(155, 89, 182, 0.1)',
  },
  gamesButton: {
    backgroundColor: '#9B59B6',
    shadowColor: '#9B59B6',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  gamesText: {
    fontSize: 12,
    color: '#FFF',
    fontWeight: '600',
    marginTop: 4,
  },
  userButton: {
    backgroundColor: 'rgba(52, 199, 89, 0.1)',
  },
  gestureOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    // Delimita solo el área central para no tapar los botones ni el header:
    top: GESTURE_TOP,          // debajo del header
    bottom: GESTURE_BOTTOM,    // por encima del footer/botones
    // Para no bloquear toques en los bordes, lo hacemos un poco más angosto:
    alignSelf: 'center',
    width: '85%',
    // Transparente; solo queremos el gesto:
    backgroundColor: 'transparent',
    zIndex: 10,
  },

})
