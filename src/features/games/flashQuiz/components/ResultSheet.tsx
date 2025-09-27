import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { FlashQuizState } from '../types';

interface ResultSheetProps {
  visible: boolean;
  quizState: FlashQuizState;
  onRestart: () => void;
  onExit: () => void;
}

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
  const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

  const getPerformanceMessage = () => {
    if (accuracy >= 90) return '¡Excelente trabajo! 🎉';
    if (accuracy >= 75) return '¡Muy bien! 👏';
    if (accuracy >= 50) return '¡Buen esfuerzo! 👍';
    return 'Sigue practicando 💪';
  };

  const getPerformanceColor = () => {
    if (accuracy >= 75) return '#28a745';
    if (accuracy >= 50) return '#ffc107';
    return '#dc3545';
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Icon name="award" size={48} color="#007bff" />
            </View>
            <Text style={styles.title}>¡Quiz Completado!</Text>
            <Text style={[styles.message, { color: getPerformanceColor() }]}>
              {getPerformanceMessage()}
            </Text>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{quizState.score}</Text>
                <Text style={styles.statLabel}>Puntos</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: getPerformanceColor() }]}>
                  {Math.round(accuracy)}%
                </Text>
                <Text style={styles.statLabel}>Precisión</Text>
              </View>
            </View>

            <View style={styles.statRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{correctAnswers}</Text>
                <Text style={styles.statLabel}>Correctas</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{totalQuestions - correctAnswers}</Text>
                <Text style={styles.statLabel}>Incorrectas</Text>
              </View>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.restartButton]}
              onPress={onRestart}
            >
              <Icon name="rotate-ccw" size={20} color="#fff" />
              <Text style={styles.restartButtonText}>Reintentar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.exitButton]}
              onPress={onExit}
            >
              <Icon name="home" size={20} color="#666" />
              <Text style={styles.exitButtonText}>Salir</Text>
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
  },
  container: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 20,
    padding: 24,
    minWidth: 300,
    maxWidth: 400,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e7f3ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    fontWeight: '500',
  },
  statsContainer: {
    marginBottom: 32,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  buttonContainer: {
    gap: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    minHeight: 50,
  },
  restartButton: {
    backgroundColor: '#007bff',
  },
  restartButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  exitButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  exitButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});