import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, SafeAreaView, Alert, BackHandler } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { AppStackParamList } from '@/navigation/AppStackNavigator';
import { audioService } from '@/services/audioService';
import LinearGradient from 'react-native-linear-gradient';

import {
  initGame,
  tick,
  answerQuestion,
  skipOrTimeout
} from './flashQuizSlice';

import {
  selectStatus,
  selectCurrentQuestion,
  selectProgress,
  selectScore,
  selectTimeLeft
} from './flashQuizSelectors';

import { useCountdown } from './useCountdown';
import QuizHeader from './components/QuizHeader';
import QuestionCard from './components/QuestionCard';
import OptionButton from './components/OptionButton';
import ResultSheet from './components/ResultSheet';

type QuizScreenNavigationProp = NativeStackNavigationProp<AppStackParamList, 'QuizScreen'>;

export default function QuizScreen() {
  const navigation = useNavigation<QuizScreenNavigationProp>();
  const dispatch = useAppDispatch();

  const status = useAppSelector(selectStatus);
  const currentQuestion = useAppSelector(selectCurrentQuestion);
  const progress = useAppSelector(selectProgress);
  const score = useAppSelector(selectScore);
  const timeLeft = useAppSelector(selectTimeLeft);
  const quizState = useAppSelector(state => state.flashQuiz);
  const userSettings = useAppSelector(state => state.settings.data);

  const [isAnswering, setIsAnswering] = useState(false);
  const [feedbackState, setFeedbackState] = useState<'none' | 'correct' | 'incorrect'>('none');

  // Initialize game audio
  const initializeGameAudio = useCallback(async () => {
    try {
      await audioService.initialize();
      await audioService.loadGameTrack('quiz');
      await audioService.play();
    } catch (error) {
      console.error('Failed to initialize quiz audio:', error);
    }
  }, []);

  // Stop game audio
  const stopGameAudio = useCallback(async () => {
    try {
      await audioService.stop();
    } catch (error) {
      console.error('Failed to stop quiz audio:', error);
    }
  }, []);

  // Initialize game on mount
  useEffect(() => {
    if (status === 'idle') {
      const categories = userSettings?.categories || ['technology', 'business'];
      dispatch(initGame({
        categories,
        count: 10,
        secondsPerQ: 13
      }));
    }
  }, [dispatch, status, userSettings]);

  // Handle audio based on game status
  useEffect(() => {
    if (status === 'running') {
      initializeGameAudio();
    } else if (status === 'finished') {
      stopGameAudio();
    }

    // Cleanup on unmount
    return () => {
      if (status === 'finished' || status === 'idle') {
        stopGameAudio();
      }
    };
  }, [status, initializeGameAudio, stopGameAudio]);

  // Handle countdown
  useCountdown({
    isRunning: status === 'running' && !isAnswering,
    timeLeft,
    onTick: () => dispatch(tick()),
    onTimeout: () => dispatch(skipOrTimeout())
  });

  // Handle answer selection with feedback
  const handleAnswerPress = useCallback(async (optionId: string) => {
    if (isAnswering || status !== 'running') return;

    setIsAnswering(true);

    if (!currentQuestion) return;

    const selectedOption = currentQuestion.options.find(opt => opt.id === optionId);
    if (!selectedOption) return;

    // Show immediate feedback
    setFeedbackState(selectedOption.isCorrect ? 'correct' : 'incorrect');

    // Wait for feedback visibility
    setTimeout(() => {
      dispatch(answerQuestion({ optionId }));
      setFeedbackState('none');
      setIsAnswering(false);
    }, 800);

  }, [dispatch, currentQuestion, isAnswering, status]);

  // Handle restart
  const handleRestart = useCallback(() => {
    const categories = userSettings?.categories || ['technology', 'business'];
    dispatch(initGame({
      categories,
      count: 10,
      secondsPerQ: 13
    }));
  }, [dispatch, userSettings]);

  // Handle exit
  const handleExit = useCallback(async () => {
    await stopGameAudio();
    navigation.goBack();
  }, [navigation, stopGameAudio]);

  // Handle back button in header
  const handleBackPress = useCallback(() => {
    if (status === 'running') {
      Alert.alert(
        'Salir del Quiz',
        '¿Estás seguro de que quieres salir? Se perderá el progreso actual.',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Salir',
            style: 'destructive',
            onPress: handleExit
          }
        ]
      );
    } else {
      handleExit();
    }
  }, [status, handleExit]);

  // Handle back button
  useEffect(() => {
    const backAction = () => {
      if (status === 'running') {
        Alert.alert(
          'Salir del Quiz',
          '¿Estás seguro de que quieres salir? Se perderá el progreso actual.',
          [
            { text: 'Cancelar', style: 'cancel' },
            {
              text: 'Salir',
              style: 'destructive',
              onPress: async () => {
                await stopGameAudio();
                navigation.goBack();
              }
            }
          ]
        );
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [status, navigation, stopGameAudio]);

  if (status === 'idle') {
    return <View style={styles.container} />;
  }

  return (
    <LinearGradient
      colors={['#3d1f7a', '#3d1f7a', '#4a0a6e']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container}>
        <QuizHeader
          category={currentQuestion?.category}
          progress={progress}
          timeLeft={timeLeft}
          score={score}
          onBackPress={handleBackPress}
        />

        <View style={styles.content}>
          {currentQuestion && (
            <>
              <QuestionCard question={currentQuestion} />

              <View style={styles.optionsContainer}>
                {currentQuestion.options.map((option) => (
                  <OptionButton
                    key={option.id}
                    option={option}
                    onPress={handleAnswerPress}
                    disabled={isAnswering}
                    feedbackState={feedbackState}
                  />
                ))}
              </View>
            </>
          )}
        </View>

        <ResultSheet
          visible={status === 'finished'}
          quizState={quizState}
          onRestart={handleRestart}
          onExit={handleExit}
        />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    flex: 1,
  },
  optionsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
});