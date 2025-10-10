import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { QuizQuestion } from '../types';

interface QuestionCardProps {
  question: QuizQuestion;
}

export default function QuestionCard({ question }: QuestionCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.wordContainer}>
        <Text style={styles.wordText}>{question.word}</Text>
      </View>

      {question.example && (
        <View style={styles.exampleContainer}>
          <Text style={styles.exampleLabel}>Ejemplo:</Text>
          <Text style={styles.exampleText}>{question.example}</Text>
        </View>
      )}

      <View style={styles.instructionContainer}>
        <Text style={styles.instructionText}>
          Selecciona el significado correcto:
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#3d1f7a',
    margin: 20,
    borderRadius: 16,
    padding: 24,
    borderColor: 'white',
    borderWidth: 1
    
  },
  wordContainer: {
    alignItems: 'center',
    marginBottom: 20,
    borderColor: 'white'
  },
  wordText: {
    fontSize: 32,
    fontWeight: '700',
    color: 'white',
    textAlign: 'center',
    lineHeight: 40,
  },
  exampleContainer: {
    backgroundColor: '#1a0a4e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  exampleLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  exampleText: {
    fontSize: 16,
    color: 'white',
    fontStyle: 'italic',
    lineHeight: 22,
  },
  instructionContainer: {
    alignItems: 'center',
  },
  instructionText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '500',
  },
});