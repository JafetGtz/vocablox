import { RootState } from '../../../store/store';

export const selectStatus = (state: RootState) => state.flashQuiz.status;

export const selectCurrentQuestion = (state: RootState) =>
  state.flashQuiz.questions[state.flashQuiz.currentIndex];

export const selectProgress = (state: RootState) => ({
  index: state.flashQuiz.currentIndex,
  total: state.flashQuiz.questions.length
});

export const selectScore = (state: RootState) => state.flashQuiz.score;

export const selectTimeLeft = (state: RootState) => state.flashQuiz.timeLeft;