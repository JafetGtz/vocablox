import React, { useState, useEffect, useRef, } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Animated, StatusBar, PanResponder, ScrollView, Pressable } from 'react-native'
import Icon from 'react-native-vector-icons/Feather'
import { useAppSelector } from '@/store/hooks'
import Speech from '@mhpdev/react-native-speech'
import SaveWordModal from '@/components/SaveWordModal'


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

export default function HomeScreen() {
  const { data } = useAppSelector((s) => s.settings)
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [words, setWords] = useState<Word[]>([])
  const [progress, setProgress] = useState(0)
  const fadeAnim = new Animated.Value(1);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utterQueueRef = useRef<string[]>([]);
  const scrollRef = useRef<ScrollView>(null);
  const [showSaveModal, setShowSaveModal] = useState(false);

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
  }, [data.categories])


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

      if (selectedCategories.length === 0) {
        console.warn('No categories selected')
        return
      }

      let allWords: Word[] = []

      // Load words from each selected category
      for (const category of selectedCategories) {
        const categoryWords = CATEGORY_WORDS[category]
        if (!categoryWords) {
          console.warn(`No words found for category: ${category}`)
          continue
        }

        allWords = [...allWords, ...categoryWords]
        console.log(`Loaded ${categoryWords.length} words from ${category} category`)
      }

      // Shuffle words to provide variety
      const shuffledWords = allWords.sort(() => Math.random() - 0.5)
      setWords(shuffledWords)
      console.log('Loaded words from categories:', shuffledWords.length, 'words')
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

  const currentWord = words[currentWordIndex]
  const currentHour = new Date().getHours().toString().padStart(2, '0')
  const currentMinute = new Date().getMinutes().toString().padStart(2, '0')

  if (!currentWord) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Cargando palabras...</Text>
      </SafeAreaView>
    )
  }

  if (!currentWord) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>
          {words.length === 0 && data.categories?.length === 0
            ? 'No hay categorías seleccionadas. Completa tu configuración en el wizard.'
            : 'Cargando palabras...'}
        </Text>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5DC" />

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
          <Text style={styles.word}>{currentWord.palabra}</Text>




          <Text style={styles.definition}>{currentWord.significado}</Text>

          {currentWord.ejemplo && (
            <Text style={styles.example}>
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
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="share" size={22} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="heart" size={22} color="#666" />
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
        <TouchableOpacity style={styles.navButton}>
          <Icon name="grid" size={24} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navButton, styles.gamesButton]}>
          <Text style={styles.gamesText}>Juegos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Icon name="user" size={24} color="#666" />
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
    </SafeAreaView>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5DC',
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  navButton: {
    padding: 12,
  },
  gamesButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  gamesText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
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
