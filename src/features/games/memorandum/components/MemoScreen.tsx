import React, { useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { AppStackParamList } from '@/navigation/AppStackNavigator';

import {
  initGame,
  resetGame,
  selectWord,
  selectMeaning,
  clearSelectionsAfterDelay,
  clearJustMatchedCards
} from '../memorandumSlice';

import {
  selectMemoStatus,
  selectMemoWordCards,
  selectMemoMeaningCards,
  selectLockInput,
  selectSelectedWordId,
  selectSelectedMeaningId,
  selectJustMatchedCardIds
} from '../memorandumSelectors';

import WordsGrid from './WordsGrid';
import MeaningsGrid from './MeaningsGrid';
import FinishModal from './FinishModal';

type MemoScreenNavigationProp = NativeStackNavigationProp<AppStackParamList, 'MemoScreen'>;

export default function MemoScreen() {
  const navigation = useNavigation<MemoScreenNavigationProp>();
  const dispatch = useAppDispatch();

  const status = useAppSelector(selectMemoStatus);
  const wordCards = useAppSelector(selectMemoWordCards);

  const meaningCards = useAppSelector(selectMemoMeaningCards);
  const lockInput = useAppSelector(selectLockInput);
  const selectedWordId = useAppSelector(selectSelectedWordId);
  const selectedMeaningId = useAppSelector(selectSelectedMeaningId);
  const justMatchedCardIds = useAppSelector(selectJustMatchedCardIds);
  const userSettings = useAppSelector(state => state.settings.data);

  // Initialize game on mount
  useEffect(() => {
    if (status === 'idle') {
      const categories = userSettings?.categories || ['technology', 'business'];
      dispatch(initGame({
        categories,
        count: 10
      }));
    }
  }, [dispatch, status, userSettings]);

  const handleWordPress = (cardId: string) => {
    if (!lockInput && status === 'running') {
      dispatch(selectWord(cardId));
    }
  };

  const handleMeaningPress = (cardId: string) => {
    if (!lockInput && status === 'running') {
      dispatch(selectMeaning(cardId));
    }
  };

  // Handle timeout for non-matching pairs
  useEffect(() => {
    if (lockInput && selectedWordId && selectedMeaningId) {
      const wordCard = wordCards.find(c => c.id === selectedWordId);
      const meaningCard = meaningCards.find(c => c.id === selectedMeaningId);

      if (wordCard && meaningCard && wordCard.pairId !== meaningCard.pairId) {
        // No match - set timeout to clear selections
        const timeout = setTimeout(() => {
          dispatch(clearSelectionsAfterDelay());
        }, 1000);

        return () => clearTimeout(timeout);
      }
    }
  }, [lockInput, selectedWordId, selectedMeaningId, wordCards, meaningCards, dispatch]);

  // Clear justMatched animation flag after feedback
  useEffect(() => {
    if (justMatchedCardIds.length > 0) {
      const timeout = setTimeout(() => {
        dispatch(clearJustMatchedCards());
      }, 300);

      return () => clearTimeout(timeout);
    }
  }, [justMatchedCardIds, dispatch]);

  const handleRestart = () => {
    const categories = userSettings?.categories || ['technology', 'business'];
    dispatch(initGame({
      categories,
      count: 10
    }));
  };

  const handleGoHome = () => {
    navigation.goBack();
  };

  if (status === 'idle') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Cargando Memorandum...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Compact Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Memorandum</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.homeButton} onPress={handleGoHome}>
            <Text style={styles.buttonText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.restartButton} onPress={handleRestart}>
            <Text style={styles.buttonText}>Reiniciar</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Words Section */}
        <WordsGrid
          cards={wordCards}
          onCardPress={handleWordPress}
          disabled={lockInput}
          justMatchedCardIds={justMatchedCardIds}
        />

        {/* Separator */}
        <View style={styles.separator} />

        {/* Meanings Section */}
        <MeaningsGrid
          cards={meaningCards}
          onCardPress={handleMeaningPress}
          disabled={lockInput}
          justMatchedCardIds={justMatchedCardIds}
        />
      </ScrollView>

      {/* Finish Modal */}
      <FinishModal
        visible={status === 'finished'}
        onRestart={handleRestart}
        onGoHome={handleGoHome}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  homeButton: {
    backgroundColor: '#6c757d',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  restartButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  separator: {
    height: 2,
    backgroundColor: '#dee2e6',
    marginVertical: 24,
    marginHorizontal: 40,
  },
});