import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../types';
import MemoCard from './MemoCard';

interface WordsGridProps {
  cards: Card[];
  onCardPress: (cardId: string) => void;
  disabled?: boolean;
  justMatchedCardIds?: string[];
}

export default function WordsGrid({ cards, onCardPress, disabled = false, justMatchedCardIds = [] }: WordsGridProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Palabras</Text>
      <View style={styles.grid}>
        {cards.map((card) => (
          <View key={card.id} style={styles.cardContainer}>
            <MemoCard
              card={card}
              onPress={onCardPress}
              disabled={disabled}
              isJustMatched={justMatchedCardIds.includes(card.id)}
            />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
    color: 'white',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  cardContainer: {
    width: '30%',
    aspectRatio: 1,
    marginBottom: 10,
  },
});