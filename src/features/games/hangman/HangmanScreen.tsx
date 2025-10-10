import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../../navigation/AppStackNavigator';
import { audioService } from '@/services/audioService';

import {
  initGame,
  guessLetter,
  useHintMeaning,
  useHintExample,
  useHintReveal,
  calculateFinalScore,
  resetGame
} from './hangmanSlice';

import {
  selectMaskedWord,
  selectWin,
  selectLoss,
  selectGameFinished,
  selectAvailableHints,
  selectGameStats
} from './hangmanSelectors';

import HangmanHeader from './components/HangmanHeader';
import WordBoard from './components/WordBoard';
import Keyboard from './components/Keyboard';
import HintBar from './components/HintBar';
import ResultModal from './components/ResultModal';

type HangmanScreenNavigationProp = NativeStackNavigationProp<AppStackParamList, 'HangmanScreen'>;

export default function HangmanScreen() {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<HangmanScreenNavigationProp>();

  const { data: settings } = useAppSelector((s) => s.settings);
  const hangman = useAppSelector((s) => s.hangman);

  const maskedWord = useAppSelector(selectMaskedWord);
  const won = useAppSelector(selectWin);
  const lost = useAppSelector(selectLoss);
  const gameFinished = useAppSelector(selectGameFinished);
  const availableHints = useAppSelector(selectAvailableHints);
  const gameStats = useAppSelector(selectGameStats);

  // Initialize game audio
  const initializeGameAudio = useCallback(async () => {
    try {
      await audioService.initialize();
      await audioService.loadGameTrack('hangman');
      await audioService.play();
    } catch (error) {
      console.error('Failed to initialize hangman audio:', error);
    }
  }, []);

  // Stop game audio
  const stopGameAudio = useCallback(async () => {
    try {
      console.log('HangmanScreen: Stopping audio...');
      await audioService.forceStop();
      console.log('HangmanScreen: Audio force stopped successfully');
    } catch (error) {
      console.error('Failed to stop hangman audio:', error);
    }
  }, []);

  useEffect(() => {
    if (hangman.status === 'idle') {
      const categories = settings.categories || [];
      if (categories.length > 0) {
        dispatch(initGame({ categories, difficulty: 'medium' }));
      }
    }
  }, [dispatch, hangman.status, settings.categories]);

  useEffect(() => {
    if ((won || lost) && hangman.status === 'running') {
      dispatch(calculateFinalScore());
    }
  }, [dispatch, won, lost, hangman.status]);

  // Handle audio based on game status
  useEffect(() => {
    if (hangman.status === 'running') {
      initializeGameAudio();
    } else if (hangman.status === 'finished') {
      stopGameAudio();
    }
  }, [hangman.status, initializeGameAudio, stopGameAudio]);

  // Cleanup audio on component unmount
  useEffect(() => {
    return () => {
      console.log('HangmanScreen: Component unmounting, force stopping audio');
      // Don't wait for the callback, call audioService directly
      audioService.forceStop().catch(console.error);
    };
  }, []);

  // Ensure audio stops when screen loses focus (navigation away)
  useFocusEffect(
    useCallback(() => {
      console.log('HangmanScreen: Screen focused');

      // When screen loses focus, stop audio immediately
      return () => {
        console.log('HangmanScreen: Screen losing focus, force stopping audio...');
        audioService.forceStop().catch(console.error);
      };
    }, [])
  );

  const handleLetterPress = (letter: string) => {
    if (hangman.status === 'running') {
      dispatch(guessLetter(letter));
    }
  };

  const handleUseMeaning = () => {
    dispatch(useHintMeaning());
  };

  const handleUseExample = () => {
    dispatch(useHintExample());
  };

  const handleUseReveal = () => {
    dispatch(useHintReveal());
  };

  const handlePlayAgain = async () => {
    console.log('HangmanScreen: handlePlayAgain called');
    await stopGameAudio();
    const categories = settings.categories || [];
    dispatch(resetGame());
    dispatch(initGame({ categories, difficulty: 'medium' }));
  };

  const handleGoHome = async () => {
    console.log('HangmanScreen: handleGoHome called');
    await stopGameAudio();
    dispatch(resetGame());
    navigation.navigate('Home');
  };

  // Handle back button in header
  const handleBackPress = useCallback(async () => {
    console.log('HangmanScreen: handleBackPress called');
    await stopGameAudio();
    dispatch(resetGame());
    navigation.goBack();
  }, [stopGameAudio, dispatch, navigation]);

  const handleReviewWord = () => {
    // Llevar a detalle/notas de la palabra
    // TODO: implementar navegación a notas/detalle de palabra
    console.log('Review word:', hangman.word?.palabra);
  };

  if (!hangman.word) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <StatusBar barStyle="dark-content" backgroundColor="#3a3b34" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#3a3b34" />

      <HangmanHeader
        category={hangman.word.category}
        livesLeft={hangman.livesLeft}
        maxLives={hangman.maxLives}
        wrongLettersCount={hangman.wrongLetters.length}
        timeLeft={hangman.secondsLeft}
        onBackPress={handleBackPress}
      />

      <View style={styles.gameArea}>
        <WordBoard maskedWord={maskedWord} />

        <HintBar
          meaning={hangman.word.significado}
          example={hangman.word.ejemplo}
          showMeaning={hangman.usedHintMeaning}
          showExample={hangman.usedHintExample}
          canUseMeaning={availableHints.meaning}
          canUseExample={availableHints.example}
          canUseReveal={availableHints.revealLetter}
          onUseMeaning={handleUseMeaning}
          onUseExample={handleUseExample}
          onUseReveal={handleUseReveal}
        />
      </View>

      <Keyboard
        onLetterPress={handleLetterPress}
        guessedLetters={hangman.guessedLetters}
        wrongLetters={hangman.wrongLetters}
        disabled={gameFinished}
      />

      <ResultModal
        visible={gameFinished}
        won={gameStats.won}
        score={gameStats.score}
        word={hangman.word.palabra}
        meaning={hangman.word.significado}
        onPlayAgain={handlePlayAgain}
        onReviewWord={handleReviewWord}
        onGoHome={handleGoHome}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3a3b34',
  },
  gameArea: {
    flex: 1,
    justifyContent: 'center',
  },
});