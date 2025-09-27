import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface HangmanHeaderProps {
  category: string;
  livesLeft: number;
  maxLives: number;
  wrongLettersCount: number;
  timeLeft?: number;
}

export default function HangmanHeader({ category, livesLeft, maxLives, wrongLettersCount, timeLeft }: HangmanHeaderProps) {
  const renderHearts = () => {
    const hearts = [];
    for (let i = 0; i < maxLives; i++) {
      hearts.push(
        <View
          key={i}
          style={[
            styles.heart,
            i < livesLeft ? styles.heartFilled : styles.heartEmpty
          ]}
        />
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
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 15,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  categoryContainer: {
    flex: 1,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textTransform: 'capitalize',
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  livesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  heart: {
    width: 20,
    height: 18,
    borderRadius: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    transform: [{ rotate: '45deg' }],
  },
  heartFilled: {
    backgroundColor: '#FF6B6B',
  },
  heartEmpty: {
    backgroundColor: '#E0E0E0',
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