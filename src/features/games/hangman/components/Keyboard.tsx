import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface KeyboardProps {
  onLetterPress: (letter: string) => void;
  guessedLetters: string[];
  wrongLetters: string[];
  disabled?: boolean;
}

const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ñ'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
];

export default function Keyboard({ onLetterPress, guessedLetters, wrongLetters, disabled = false }: KeyboardProps) {
  const getKeyStyle = (letter: string) => {
    if (guessedLetters.includes(letter)) {
      return [styles.key, styles.correctKey];
    }
    if (wrongLetters.includes(letter)) {
      return [styles.key, styles.wrongKey];
    }
    return [styles.key, styles.normalKey];
  };

  const getKeyTextStyle = (letter: string) => {
    if (guessedLetters.includes(letter) || wrongLetters.includes(letter)) {
      return [styles.keyText, styles.usedKeyText];
    }
    return [styles.keyText, styles.normalKeyText];
  };

  const isKeyDisabled = (letter: string) => {
    return disabled || guessedLetters.includes(letter) || wrongLetters.includes(letter);
  };

  return (
    <View style={styles.container}>
      {KEYBOARD_ROWS.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((letter) => (
            <TouchableOpacity
              key={letter}
              style={getKeyStyle(letter)}
              onPress={() => onLetterPress(letter)}
              disabled={isKeyDisabled(letter)}
              activeOpacity={0.7}
            >
              <Text style={getKeyTextStyle(letter)}>
                {letter}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
    gap: 4,
  },
  key: {
    minWidth: 32,
    height: 40,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  normalKey: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  correctKey: {
    backgroundColor: '#4CAF50',
  },
  wrongKey: {
    backgroundColor: '#F44336',
  },
  keyText: {
    fontSize: 16,
    fontWeight: '600',
  },
  normalKeyText: {
    color: '#333',
  },
  usedKeyText: {
    color: '#FFF',
  },
});