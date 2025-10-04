import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

interface QuizHeaderProps {
  category?: string;
  progress: {
    index: number;
    total: number;
  };
  timeLeft: number;
  score: number;
  onBackPress?: () => void;
}

export default function QuizHeader({
  category,
  progress,
  timeLeft,
  score,
  onBackPress
}: QuizHeaderProps) {
  const getTimeColor = () => {
    if (timeLeft <= 3) return '#dc3545';
    if (timeLeft <= 5) return '#ffc107';
    return '#28a745';
  };

  const formatTime = (seconds: number) => {
    return seconds.toString().padStart(2, '0');
  };

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBackPress}
          activeOpacity={0.7}
        >
          <Icon name="arrow-left" size={20} color="#666" />
        </TouchableOpacity>

        <View style={styles.categoryContainer}>
          {category && (
            <>
              <Icon name="tag" size={16} color="#666" />
              <Text style={styles.categoryText}>{category}</Text>
            </>
          )}
        </View>
        <View style={styles.scoreContainer}>
          <Icon name="star" size={16} color="#ffc107" />
          <Text style={styles.scoreText}>{score}</Text>
        </View>
      </View>

      <View style={styles.bottomRow}>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            {progress.index + 1} de {progress.total}
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${((progress.index) / progress.total) * 100}%`
                }
              ]}
            />
          </View>
        </View>

        <View style={styles.timerContainer}>
          <Icon name="clock" size={18} color={getTimeColor()} />
          <Text style={[styles.timerText, { color: getTimeColor() }]}>
            {formatTime(timeLeft)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
    textTransform: 'capitalize',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 6,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressContainer: {
    flex: 1,
    marginRight: 20,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e9ecef',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007bff',
    borderRadius: 2,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  timerText: {
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 6,
    minWidth: 24,
    textAlign: 'center',
  },
});