import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FlashQuizState, UserAnswer, QuizQuestion } from './types';
import { getWordsPoolFromCategories } from './adapters';
import { buildQuestions } from './buildQuestions';
import { calcScore } from './scoring';

const initialState: FlashQuizState = {
  status: 'idle',
  questions: [],
  currentIndex: 0,
  perQuestionSeconds: 10,
  timeLeft: 10,
  answers: {},
  score: 0,
};

interface InitGamePayload {
  categories: string[];
  category?: string;
  count: number;
  secondsPerQ: number;
}

interface AnswerQuestionPayload {
  optionId: string;
}

const flashQuizSlice = createSlice({
  name: 'flashQuiz',
  initialState,
  reducers: {
    initGame: (state, action: PayloadAction<InitGamePayload>) => {
      const { categories, category, count, secondsPerQ } = action.payload;

      const pool = getWordsPoolFromCategories(categories);
      const questions = buildQuestions({
        wordsPool: pool,
        category,
        count,
        optionsPerQuestion: 4
      });

      state.status = 'running';
      state.questions = questions;
      state.currentIndex = 0;
      state.perQuestionSeconds = secondsPerQ;
      state.timeLeft = secondsPerQ;
      state.answers = {};
      state.score = 0;
      state.startedAt = new Date().toISOString();
      state.finishedAt = undefined;
    },

    tick: (state) => {
      if (state.status !== 'running') return;

      state.timeLeft = Math.max(0, state.timeLeft - 1);

      if (state.timeLeft === 0) {
        flashQuizSlice.caseReducers.skipOrTimeout(state);
      }
    },

    answerQuestion: (state, action: PayloadAction<AnswerQuestionPayload>) => {
      if (state.status !== 'running') return;

      const { optionId } = action.payload;
      const currentQuestion = state.questions[state.currentIndex];

      if (!currentQuestion) return;

      const selectedOption = currentQuestion.options.find(opt => opt.id === optionId);
      if (!selectedOption) return;

      const isCorrect = selectedOption.isCorrect;
      const questionScore = calcScore({
        isCorrect,
        timeLeft: state.timeLeft,
        secondsPerQ: state.perQuestionSeconds,
        streakMultiplier: 1
      });

      const answer: UserAnswer = {
        questionId: currentQuestion.id,
        selectedOptionId: optionId,
        isCorrect,
        timeLeft: state.timeLeft
      };

      state.answers[currentQuestion.id] = answer;
      state.score += questionScore;

      // Advance to next question
      state.currentIndex++;
      if (state.currentIndex >= state.questions.length) {
        flashQuizSlice.caseReducers.finishGame(state);
      } else {
        state.timeLeft = state.perQuestionSeconds;
      }
    },

    skipOrTimeout: (state) => {
      if (state.status !== 'running') return;

      const currentQuestion = state.questions[state.currentIndex];
      if (!currentQuestion) return;

      const answer: UserAnswer = {
        questionId: currentQuestion.id,
        selectedOptionId: '',
        isCorrect: false,
        timeLeft: 0
      };

      state.answers[currentQuestion.id] = answer;

      // Advance to next question
      state.currentIndex++;
      if (state.currentIndex >= state.questions.length) {
        flashQuizSlice.caseReducers.finishGame(state);
      } else {
        state.timeLeft = state.perQuestionSeconds;
      }
    },

    pauseGame: (state) => {
      if (state.status === 'running') {
        state.status = 'paused';
      }
    },

    resumeGame: (state) => {
      if (state.status === 'paused') {
        state.status = 'running';
      }
    },

    finishGame: (state) => {
      state.status = 'finished';
      state.finishedAt = new Date().toISOString();
    }
  }
});

export const {
  initGame,
  tick,
  answerQuestion,
  skipOrTimeout,
  pauseGame,
  resumeGame,
  finishGame
} = flashQuizSlice.actions;

export default flashQuizSlice.reducer;