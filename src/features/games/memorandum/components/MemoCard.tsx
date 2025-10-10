import React, { useEffect, useRef } from 'react';
import { Pressable, Text, StyleSheet, Animated, View } from 'react-native';
import { Card } from '../types';

interface MemoCardProps {
  card: Card;
  onPress: (cardId: string) => void;
  disabled?: boolean;
  isJustMatched?: boolean;
}

// Colores pastel para cada par (basado en pairId)
const getPastelColorForPair = (pairId: string) => {
  const pastelColors = [
    { bg: '#B8E6F0', border: '#85D3E8' },    // Azul pastel
    { bg: '#E8B8F0', border: '#D285E8' },    // Rosa pastel
    { bg: '#B8F0D0', border: '#85E8A8' },    // Verde pastel
    { bg: '#F0E8B8', border: '#E8D285' },    // Amarillo pastel
    { bg: '#F0C8B8', border: '#E8A585' },    // Durazno pastel
    { bg: '#D0B8F0', border: '#A885E8' },    // Morado pastel
    { bg: '#B8F0E8', border: '#85E8D2' },    // Turquesa pastel
    { bg: '#F0B8D8', border: '#E885B8' },    // Magenta pastel
    { bg: '#C8F0B8', border: '#A5E885' },    // Lima pastel
    { bg: '#F0D8B8', border: '#E8B885' },    // Beige pastel
  ];

  // Usa el pairId para seleccionar un color consistente
  const hash = pairId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const index = hash % pastelColors.length;
  return pastelColors[index];
};

export default function MemoCard({ card, onPress, disabled = false, isJustMatched = false }: MemoCardProps) {
  const isVisible = card.flipped || card.matched;
  const matchAnim = useRef(new Animated.Value(1)).current;

  // Obtener color pastel si está matched
  const pastelColor = card.matched ? getPastelColorForPair(card.pairId) : null;

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
          card.matched && pastelColor && {
            backgroundColor: pastelColor.bg,
            borderColor: pastelColor.border,
          },
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
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 14,
    color: 'black',
    flexShrink: 1,
  },
  visibleText: {
    color: '#333',
    fontSize: 10,
    lineHeight: 12,
    fontFamily: 'Merriweather_24pt-SemiBold',

  },
});