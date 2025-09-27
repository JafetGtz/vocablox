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
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  wordContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  wordText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    lineHeight: 40,
  },
  exampleContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  exampleLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  exampleText: {
    fontSize: 16,
    color: '#495057',
    fontStyle: 'italic',
    lineHeight: 22,
  },
  instructionContainer: {
    alignItems: 'center',
  },
  instructionText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
});