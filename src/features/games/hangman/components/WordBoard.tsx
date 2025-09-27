import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface WordBoardProps {
  maskedWord: string;
}

export default function WordBoard({ maskedWord }: WordBoardProps) {
  const renderLetters = () => {
    return maskedWord.split('').map((char, index) => {
      if (char === ' ') {
        return <View key={index} style={styles.space} />;
      }

      if (char === '-') {
        return (
          <View key={index} style={styles.letterContainer}>
            <Text style={styles.hyphen}>-</Text>
          </View>
        );
      }

      const isRevealed = char !== '_';

      return (
        <View key={index} style={styles.letterContainer}>
          <Text style={[styles.letter, !isRevealed && styles.hiddenLetter]}>
            {isRevealed ? char : ''}
          </Text>
          <View style={styles.letterUnderline} />
        </View>
      );
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.wordContainer}>
        {renderLetters()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  wordContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'flex-end',
    gap: 6,
  },
  letterContainer: {
    alignItems: 'center',
    minWidth: 32,
    minHeight: 50,
    justifyContent: 'flex-end',
  },
  letter: {
    fontSize: 32,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
  },
  hiddenLetter: {
    color: 'transparent',
  },
  letterUnderline: {
    width: 28,
    height: 3,
    backgroundColor: '#DAA520',
    borderRadius: 1.5,
  },
  hyphen: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  space: {
    width: 16,
    height: 50,
  },
});