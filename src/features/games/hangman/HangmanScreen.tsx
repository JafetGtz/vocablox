import React, { useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../../navigation/AppStackNavigator';

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

  const handlePlayAgain = () => {
    const categories = settings.categories || [];
    dispatch(resetGame());
    dispatch(initGame({ categories, difficulty: 'medium' }));
  };

  const handleGoHome = () => {
    dispatch(resetGame());
    navigation.navigate('Home');
  };

  const handleReviewWord = () => {
    // Llevar a detalle/notas de la palabra
    // TODO: implementar navegación a notas/detalle de palabra
    console.log('Review word:', hangman.word?.palabra);
  };

  if (!hangman.word) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#F5F5DC" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5DC" />

      <HangmanHeader
        category={hangman.word.category}
        livesLeft={hangman.livesLeft}
        maxLives={hangman.maxLives}
        wrongLettersCount={hangman.wrongLetters.length}
        timeLeft={hangman.secondsLeft}
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
    backgroundColor: '#F5F5DC',
  },
  gameArea: {
    flex: 1,
    justifyContent: 'center',
  },
});