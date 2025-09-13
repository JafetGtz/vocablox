// src/views/Auth/WelcomeSliderScreen.tsx
import React, { useRef } from 'react'
import {
  View,
  Text,
  FlatList,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import * as Animatable from 'react-native-animatable'
import { useWelcomeSliderViewModel } from '@/viewmodels/useWelcomeSliderViewModel'

const { width } = Dimensions.get('window')

const WelcomeSliderScreen = () => {
  const { slides, currentIndex, setCurrentIndex } =
    useWelcomeSliderViewModel()
  const navigation = useNavigation()
  const flatListRef = useRef<FlatList>(null)


    const goToNext = () => {
        if (currentIndex < slides.length - 1 && flatListRef.current) {
            flatListRef.current.scrollToOffset({
                offset: (currentIndex + 1) * width,
                animated: true,
            })
        }
    }

    const goToPrev = () => {
        if (currentIndex > 0 && flatListRef.current) {
            flatListRef.current.scrollToOffset({
                offset: (currentIndex - 1) * width,
                animated: true,
            })
        }
    }


  return (
    <SafeAreaView style={styles.container}>
      {/* Logo animado desde la izquierda */}
      <Animatable.View
        animation="slideInLeft"
        duration={800}
        style={styles.logoContainer}
      >
        <Image source={require('@/assets/logob.png')} style={styles.logo} />
      </Animatable.View>

      {/* Flechas laterales */}
      {currentIndex > 0 && (
        <TouchableOpacity style={styles.arrowLeft} onPress={goToPrev}>
          <Text style={styles.arrowText}>‹</Text>
        </TouchableOpacity>
      )}
      {currentIndex < slides.length - 1 && (
        <TouchableOpacity style={styles.arrowRight} onPress={goToNext}>
          <Text style={styles.arrowText}>›</Text>
        </TouchableOpacity>
      )}

      {/* Carrusel */}
      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={e =>
          setCurrentIndex(Math.round(e.nativeEvent.contentOffset.x / width))
        }
        keyExtractor={item => item.id}
        contentContainerStyle={{ flexGrow: 1 }}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <Animatable.Text
              animation="fadeInDown"
              delay={200}
              style={styles.titleSolid}
            >
              {item.title1}
            </Animatable.Text>
            <Animatable.Text
              animation="fadeInDown"
              delay={400}
              style={styles.titleOutline}
            >
              {item.title2}
            </Animatable.Text>
            <Animatable.Text
              animation="fadeInDown"
              delay={600}
              style={styles.titleSolid}
            >
              {item.title3}
            </Animatable.Text>
            <Animatable.Text
              animation="fadeInUp"
              delay={800}
              style={styles.description}
            >
              {item.description}
            </Animatable.Text>
          </View>
        )}
      />

      {/* Dots de paginación */}
      <View style={styles.dotsContainer}>
        {slides.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              currentIndex === i && styles.activeDot,
            ]}
          />
        ))}
      </View>

      {/* Botón “Empezar” */}
      {currentIndex === slides.length - 1 && (
        <Animatable.View animation="fadeInUp" delay={1000}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.buttonText}>Empezar</Text>
          </TouchableOpacity>
        </Animatable.View>
      )}
    </SafeAreaView>
  )
}

export default WelcomeSliderScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  logoContainer: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 240,
    height: 80,
    resizeMode: 'contain',
  },
  arrowLeft: {
    position: 'absolute',
    top: '45%',
    left: 16,
    zIndex: 1,
  },
  arrowRight: {
    position: 'absolute',
    top: '45%',
    right: 16,
    zIndex: 1,
  },
  arrowText: {
    fontSize: 32,
    color: '#fff',
  },
  slide: {
    width,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  titleSolid: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 48,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 56,
  },
  titleOutline: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 48,
    color: 'transparent',
    textAlign: 'center',
    letterSpacing: 2,
    textShadowColor: '#fff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 2,
    marginVertical: -12,
  },
  description: {
    fontFamily: 'Poppins_400Regular',
    color: '#ccc',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 24,
    lineHeight: 24,
    maxWidth: width * 0.8,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#555',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#fff',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 60,
    marginHorizontal: 24,
    marginBottom: 32,
    borderRadius: 30,
  },
  buttonText: {
    fontFamily: 'Poppins_700Bold',
    color: '#000',
    fontSize: 18,
    textAlign: 'center',
  },
})
