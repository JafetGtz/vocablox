import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { QuizOption } from '../types';

interface OptionButtonProps {
  option: QuizOption;
  onPress: (optionId: string) => void;
  disabled?: boolean;
  feedbackState?: 'none' | 'correct' | 'incorrect';
}

export default function OptionButton({
  option,
  onPress,
  disabled = false,
  feedbackState = 'none'
}: OptionButtonProps) {
  const getButtonStyle = (): ViewStyle[] => {
    const baseStyles = [styles.button];

    if (disabled) {
      baseStyles.push(styles.disabled);
    }

    if (feedbackState === 'correct' && option.isCorrect) {
      baseStyles.push(styles.correct);
    } else if (feedbackState === 'incorrect' && !option.isCorrect) {
      baseStyles.push(styles.incorrect);
    }

    return baseStyles;
  };

  const getTextColor = () => {
    if (feedbackState === 'correct' && option.isCorrect) return '#fff';
    if (feedbackState === 'incorrect' && !option.isCorrect) return '#fff';
    return '#333';
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={() => onPress(option.id)}
      disabled={disabled}
      accessibilityLabel={`Opción: ${option.text}`}
      accessibilityRole="button"
    >
      <Text style={[styles.text, { color: getTextColor() }]}>
        {option.text}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 12,
    minHeight: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 22,
  },
  disabled: {
    opacity: 0.6,
  },
  correct: {
    backgroundColor: '#28a745',
    borderColor: '#28a745',
  },
  incorrect: {
    backgroundColor: '#dc3545',
    borderColor: '#dc3545',
  },
});