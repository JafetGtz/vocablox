import React, { useEffect, useRef } from 'react';
import { Pressable, Text, StyleSheet, Animated, View } from 'react-native';
import { Card } from '../types';

interface MemoCardProps {
  card: Card;
  onPress: (cardId: string) => void;
  disabled?: boolean;
  isJustMatched?: boolean;
}

export default function MemoCard({ card, onPress, disabled = false, isJustMatched = false }: MemoCardProps) {
  const isVisible = card.flipped || card.matched;
  const matchAnim = useRef(new Animated.Value(1)).current;

  // Match celebration animation
  useEffect(() => {
    if (isJustMatched) {
      Animated.sequence([
        Animated.timing(matchAnim, {
          toValue: 1.3,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(matchAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isJustMatched, matchAnim]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ scale: matchAnim }],
          opacity: disabled && !card.matched ? 0.6 : 1,
        },
      ]}
    >
      <Pressable
        style={[
          styles.card,
          card.matched && styles.matchedCard,
          card.flipped && !card.matched && styles.flippedCard,
        ]}
        onPress={() => onPress(card.id)}
        disabled={disabled || card.matched}
        accessibilityLabel={isVisible ? card.label : 'Carta oculta'}
        accessibilityRole="button"
      >
        <Text style={[styles.text, isVisible && styles.visibleText]}>
          {isVisible ? card.label : '?'}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
  card: {
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderRadius: 12,
    padding: 8,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flippedCard: {
    backgroundColor: '#fff3cd',
    borderColor: '#ffc107',
  },
  matchedCard: {
    backgroundColor: '#d4edda',
    borderColor: '#28a745',
  },
  text: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 14,
    color: '#6c757d',
    flexShrink: 1,
  },
  visibleText: {
    color: '#333',
    fontSize: 10,
    lineHeight: 12,
  },
});