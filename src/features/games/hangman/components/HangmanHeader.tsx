import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

interface HangmanHeaderProps {
  category: string;
  livesLeft: number;
  maxLives: number;
  wrongLettersCount: number;
  timeLeft?: number;
  onBackPress?: () => void;
}

export default function HangmanHeader({ category, livesLeft, maxLives, wrongLettersCount, timeLeft, onBackPress }: HangmanHeaderProps) {
  const renderHearts = () => {
    const hearts = [];
    for (let i = 0; i < maxLives; i++) {
      hearts.push(
        <Text
          key={i}
          style={[
            styles.heartEmoji,
            i < livesLeft ? styles.heartFilled : styles.heartEmpty
          ]}
        >
          ❤️
        </Text>
      );
    }
    return hearts;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={onBackPress}
        activeOpacity={0.7}
      >
        <Icon name="arrow-left" size={20} color="#333" />
      </TouchableOpacity>

      <View style={styles.categoryContainer}>
        <Text style={styles.categoryText}>{category}</Text>
        <Text style={styles.progressText}>
          Errores: {wrongLettersCount}/{maxLives}
        </Text>
      </View>

      <View style={styles.livesContainer}>
        {renderHearts()}
      </View>

      {timeLeft !== undefined && (
        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'gray',
    borderRadius: 15,
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryContainer: {
    flex: 1,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    textTransform: 'capitalize',
  },
  progressText: {
    fontSize: 12,
    color: 'white',
    marginTop: 2,
  },
  livesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartEmoji: {
    fontSize: 20,
    marginHorizontal: 2,
  },
  heartFilled: {
    opacity: 1,
  },
  heartEmpty: {
    opacity: 0.3,
  },
  timerContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  timerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
});