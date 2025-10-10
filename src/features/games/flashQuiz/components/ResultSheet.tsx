import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Dimensions, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import { FlashQuizState } from '../types';

const { width: W, height: H } = Dimensions.get('window');

// Escala responsiva
const espacioBase = Math.max(16, Math.min(24, 0.055 * W));
const paddingH = 0.04 * W;
const contentWidth = 0.92 * W;

interface ResultSheetProps {
  visible: boolean;
  quizState: FlashQuizState;
  onRestart: () => void;
  onExit: () => void;
}

// Componente de confeti (bolita)
const Confetti = ({ x, y, size, color }: { x: string; y: string; size: number; color: string }) => (
  <View
    style={[
      styles.confetti,
      {
        left: x,
        top: y,
        width: size,
        height: size,
        backgroundColor: color,
      },
    ]}
  />
);

export default function ResultSheet({
  visible,
  quizState,
  onRestart,
  onExit
}: ResultSheetProps) {
  const correctAnswers = Object.values(quizState.answers).filter(
    answer => answer.isCorrect
  ).length;

  const totalQuestions = quizState.questions.length;
  const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
  const incorrectAnswers = totalQuestions - correctAnswers;

  // Configuración del confeti (36 bolitas - duplicado)
  const confettiConfig = [
    // Bolitas originales
    { x: '8%', y: '22%', size: 6, color: '#FF5252' },
    { x: '18%', y: '35%', size: 4, color: '#4CD964' },
    { x: '30%', y: '18%', size: 8, color: '#5AC8FA' },
    { x: '44%', y: '10%', size: 4, color: '#FFCC00' },
    { x: '60%', y: '16%', size: 6, color: '#FF6BD6' },
    { x: '74%', y: '28%', size: 6, color: '#9B59B6' },
    { x: '86%', y: '22%', size: 4, color: '#FFFFFF' },
    { x: '12%', y: '64%', size: 6, color: '#4CD964' },
    { x: '26%', y: '72%', size: 4, color: '#FF5252' },
    { x: '38%', y: '84%', size: 8, color: '#FFCC00' },
    { x: '52%', y: '78%', size: 6, color: '#5AC8FA' },
    { x: '68%', y: '86%', size: 4, color: '#FFFFFF' },
    { x: '82%', y: '68%', size: 6, color: '#FF6BD6' },
    { x: '90%', y: '46%', size: 4, color: '#9B59B6' },
    { x: '6%', y: '48%', size: 4, color: '#FFFFFF' },
    { x: '20%', y: '56%', size: 6, color: '#5AC8FA' },
    { x: '58%', y: '32%', size: 4, color: '#FF5252' },
    { x: '72%', y: '52%', size: 8, color: '#4CD964' },
    // Bolitas adicionales
    { x: '14%', y: '12%', size: 5, color: '#FFCC00' },
    { x: '35%', y: '8%', size: 6, color: '#FF6BD6' },
    { x: '50%', y: '24%', size: 4, color: '#FFFFFF' },
    { x: '65%', y: '38%', size: 7, color: '#5AC8FA' },
    { x: '78%', y: '14%', size: 5, color: '#4CD964' },
    { x: '92%', y: '32%', size: 4, color: '#FF5252' },
    { x: '4%', y: '36%', size: 6, color: '#9B59B6' },
    { x: '24%', y: '44%', size: 5, color: '#FFCC00' },
    { x: '42%', y: '58%', size: 4, color: '#FF6BD6' },
    { x: '56%', y: '66%', size: 7, color: '#5AC8FA' },
    { x: '70%', y: '42%', size: 5, color: '#FFFFFF' },
    { x: '84%', y: '54%', size: 6, color: '#4CD964' },
    { x: '16%', y: '76%', size: 4, color: '#FF5252' },
    { x: '32%', y: '90%', size: 6, color: '#9B59B6' },
    { x: '48%', y: '92%', size: 5, color: '#FFCC00' },
    { x: '64%', y: '74%', size: 4, color: '#FF6BD6' },
    { x: '76%', y: '82%', size: 7, color: '#5AC8FA' },
    { x: '88%', y: '76%', size: 5, color: '#FFFFFF' },
  ];

  // Tamaño del círculo de puntaje
  const circleSize = Math.min(0.42 * W, 220);

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={false}
      statusBarTranslucent
    >
      <LinearGradient
        colors={['#5a2d91', '#3d1f7a', '#2a1458', '#1a0a4e', '#0B0433', '#000000']}
        locations={[0, 0.2, 0.4, 0.6, 0.8, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={onExit}>
              <Icon name="arrow-left" size={18} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <Text style={styles.headerTitle}>Resultados</Text>
            </View>
            <View style={styles.headerSpacer} />
          </View>

          {/* Scroll Content */}
          <View style={styles.content}>
            {/* Métricas */}
            <View style={styles.metricsContainer}>
              <Text style={styles.metricsLine1}>Respuestas correctas totales</Text>
              <Text style={styles.metricsLine2}>
                {correctAnswers} de {totalQuestions} preguntas
              </Text>
              <Text style={styles.metricsExtra}>Precisión: {accuracy}%</Text>
              <Text style={styles.metricsExtra}>Incorrectas: {incorrectAnswers}</Text>
            </View>

            {/* Tarjeta con degradado */}
            <LinearGradient
              colors={['#7A66FF', '#5B49D9']}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={styles.scoreCard}
            >
              {/* Confeti (detrás del círculo) */}
              {confettiConfig.map((conf, idx) => (
                <Confetti key={idx} x={conf.x} y={conf.y} size={conf.size} color={conf.color} />
              ))}

              {/* Contenido de la tarjeta */}
              <Text style={styles.cardTitle}>Tu puntaje final es</Text>

              {/* Círculo del puntaje */}
              <View style={[styles.scoreCircle, { width: circleSize, height: circleSize }]}>
                <Text style={styles.scoreNumber}>{accuracy}</Text>
              </View>
            </LinearGradient>

            {/* Botón Intentar de nuevo */}
            <TouchableOpacity
              style={styles.restartButton}
              onPress={onRestart}
              activeOpacity={0.8}
            >
              <Icon name="rotate-ccw" size={18} color="#FFFFFF" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Intentar de nuevo</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: paddingH,
    marginBottom: espacioBase * 1.5,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 25,
    
    color: 'white',
    letterSpacing: 0.2,
    fontFamily: 'Merriweather_24pt-SemiBold'
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: paddingH,
  },
  metricsContainer: {
    width: contentWidth,
    marginBottom: espacioBase * 1.25,
  },
  metricsLine1: {
    fontSize: 14,
    fontFamily: 'Merriweather_24pt-SemiBold',
    color: 'rgba(255,255,255,0.8)',
    marginBottom: espacioBase * 0.5,
  },
  metricsLine2: {
    fontSize: 15,
    fontFamily: 'Merriweather_24pt-SemiBold',
    color: 'white',
    marginBottom: espacioBase * 0.5,
  },
  metricsExtra: {
    fontSize: 14,
    
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
    fontFamily: 'Merriweather_24pt-SemiBold'
  },
  scoreCard: {
    width: contentWidth,
    aspectRatio: 1.25,
    borderRadius: 24,
    padding: espacioBase * 1.25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: espacioBase * 1.75,
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0,0,0,0.35)',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.35,
        shadowRadius: 18,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  confetti: {
    position: 'absolute',
    borderRadius: 100,
  },
  cardTitle: {
    fontSize: 30, 
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: espacioBase * 0.25,
    marginBottom: espacioBase * 1.25,
    
    fontFamily: 'Quicksand-Bold',
    
  },
  scoreCircle: {
    
    backgroundColor: 'orange',
    borderRadius: 1000,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0,0,0,0.35)',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 10,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  scoreNumber: {
    fontSize: 80,
    fontWeight: '800',
    color: '#FFFFFF',
    
  },
  restartButton: {
    width: contentWidth,
    height: 52,
    backgroundColor: '#6A5AE0',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0,0,0,0.25)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Quicksand-Bold',
    color: '#FFFFFF',
  },
});
