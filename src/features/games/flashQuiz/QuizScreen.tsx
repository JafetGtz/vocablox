import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, SafeAreaView, Alert, BackHandler } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { AppStackParamList } from '@/navigation/AppStackNavigator';

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

  // Initialize game on mount
  useEffect(() => {
    if (status === 'idle') {
      const categories = userSettings?.categories || ['technology', 'business'];
      dispatch(initGame({
        categories,
        count: 10,
        secondsPerQ: 10
      }));
    }
  }, [dispatch, status, userSettings]);

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
      secondsPerQ: 10
    }));
  }, [dispatch, userSettings]);

  // Handle exit
  const handleExit = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  // Handle back button
  useEffect(() => {
    const backAction = () => {
      if (status === 'running') {
        Alert.alert(
          'Salir del Quiz',
          '¿Estás seguro de que quieres salir? Se perderá el progreso actual.',
          [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Salir', style: 'destructive', onPress: () => navigation.goBack() }
          ]
        );
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [status, navigation]);

  if (status === 'idle') {
    return <View style={styles.container} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <QuizHeader
        category={currentQuestion?.category}
        progress={progress}
        timeLeft={timeLeft}
        score={score}
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
  },
  optionsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
});