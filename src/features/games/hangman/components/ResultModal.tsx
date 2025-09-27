import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

interface ResultModalProps {
  visible: boolean;
  won: boolean;
  score: number;
  word: string;
  meaning: string;
  onPlayAgain: () => void;
  onReviewWord: () => void;
  onGoHome: () => void;
}

export default function ResultModal({
  visible,
  won,
  score,
  word,
  meaning,
  onPlayAgain,
  onReviewWord,
  onGoHome
}: ResultModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={[styles.iconContainer, won ? styles.successIcon : styles.failIcon]}>
            <Icon
              name={won ? 'check-circle' : 'x-circle'}
              size={64}
              color={won ? '#4CAF50' : '#F44336'}
            />
          </View>

          <Text style={styles.title}>
            {won ? '¡Felicidades!' : '¡Mejor suerte la próxima!'}
          </Text>

          <Text style={styles.subtitle}>
            {won ? 'Has completado la palabra' : 'La palabra era:'}
          </Text>

          <View style={styles.wordContainer}>
            <Text style={styles.word}>{word}</Text>
            <Text style={styles.meaning}>{meaning}</Text>
          </View>

          <View style={styles.scoreContainer}>
            <Text style={styles.scoreLabel}>Puntuación</Text>
            <Text style={styles.score}>{score}</Text>
          </View>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={onGoHome}
            >
              <Icon name="home" size={20} color="#666" />
              <Text style={styles.secondaryButtonText}>Inicio</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={onReviewWord}
            >
              <Icon name="book-open" size={20} color="#666" />
              <Text style={styles.secondaryButtonText}>Repasar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={onPlayAgain}
            >
              <Icon name="refresh-cw" size={20} color="#FFF" />
              <Text style={styles.primaryButtonText}>Jugar otra</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  container: {
    backgroundColor: '#F5F5DC',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    maxWidth: 350,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  iconContainer: {
    marginBottom: 20,
  },
  successIcon: {
    opacity: 1,
  },
  failIcon: {
    opacity: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  wordContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    width: '100%',
  },
  word: {
    fontSize: 28,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  meaning: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  scoreLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  score: {
    fontSize: 32,
    fontWeight: '700',
    color: '#DAA520',
  },
  buttonsContainer: {
    flexDirection: 'column',
    gap: 12,
    width: '100%',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    width: '100%',
  },
  primaryButton: {
    backgroundColor: '#DAA520',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  secondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  primaryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
});