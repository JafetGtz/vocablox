import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HangmanState, HangmanWord } from './types';
import { buildHangmanWord } from './buildHangmanWord';
import { getDifficultyConfig, DifficultyLevel } from './difficulty';
import { calculateScore, getTimeBonus } from './scoring';

const initialState: HangmanState = {
  status: 'idle',
  word: undefined,
  guessedLetters: [],
  wrongLetters: [],
  maxLives: 6,
  livesLeft: 6,
  usedHintMeaning: false,
  usedHintExample: false,
  usedHintReveal: false,
  timerEnabled: false,
  secondsLeft: undefined,
  score: 0,
  startedAt: undefined,
  finishedAt: undefined,
  dailySeed: undefined
};

const hangmanSlice = createSlice({
  name: 'hangman',
  initialState,
  reducers: {
    initGame: (state, action: PayloadAction<{
      categories: string[];
      difficulty?: DifficultyLevel;
      daily?: boolean;
    }>) => {
      const { categories, difficulty = 'medium', daily = false } = action.payload;
      const config = getDifficultyConfig(difficulty);

      const dailySeed = daily ? new Date().toISOString().split('T')[0] : undefined;

      const word = buildHangmanWord({
        selectedCategories: categories,
        dailySeed
      });

      if (!word) {
        console.warn('No valid word found for hangman game');
        return;
      }

      state.status = 'running';
      state.word = word;
      state.guessedLetters = [];
      state.wrongLetters = [];
      state.maxLives = config.maxLives;
      state.livesLeft = config.maxLives;
      state.usedHintMeaning = false;
      state.usedHintExample = false;
      state.usedHintReveal = false;
      state.timerEnabled = config.timerEnabled;
      state.secondsLeft = config.secondsPerWord;
      state.score = 0;
      state.startedAt = new Date().toISOString();
      state.finishedAt = undefined;
      state.dailySeed = dailySeed;
    },

    guessLetter: (state, action: PayloadAction<string>) => {
      if (state.status !== 'running' || !state.word) return;

      // Normalizar letra a mayúscula sin tildes (excepto Ñ)
      const letter = action.payload
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toUpperCase()
        .replace(/[^A-ZÑ]/g, '');

      if (!letter) return;

      // Si ya existe en guessedLetters o wrongLetters → no-op
      if (state.guessedLetters.includes(letter) || state.wrongLetters.includes(letter)) return;

      const normalized = state.word.normalized;

      // Si normalized contiene la letra → push en guessedLetters
      if (normalized.includes(letter)) {
        state.guessedLetters.push(letter);
      } else {
        // Si no → push en wrongLetters y livesLeft--
        state.wrongLetters.push(letter);
        state.livesLeft = Math.max(0, state.livesLeft - 1);
      }

      // Detectar win: todas las letras únicas han sido adivinadas
      const uniqueLetters = new Set(
        normalized.split('').filter(char => /[A-ZÑ]/.test(char))
      );
      const win = Array.from(uniqueLetters).every(l => state.guessedLetters.includes(l));

      // Si win → finishGame('finished')
      if (win) {
        state.status = 'finished';
        state.finishedAt = new Date().toISOString();
      }
      // Si livesLeft === 0 → finishGame('finished')
      else if (state.livesLeft === 0) {
        state.status = 'finished';
        state.finishedAt = new Date().toISOString();
      }
    },

    useHintMeaning: (state) => {
      if (state.status === 'running' && !state.usedHintMeaning) {
        state.usedHintMeaning = true;
      }
    },

    useHintExample: (state) => {
      if (state.status === 'running' && !state.usedHintExample) {
        state.usedHintExample = true;
      }
    },

    useHintReveal: (state) => {
      if (state.status !== 'running' || !state.word || state.usedHintReveal) return;

      state.usedHintReveal = true;

      const normalized = state.word.normalized;
      const unguessedLetters = normalized
        .split('')
        .filter(char => /[A-ZÑ]/.test(char) && !state.guessedLetters.includes(char));

      if (unguessedLetters.length > 0) {
        const randomLetter = unguessedLetters[Math.floor(Math.random() * unguessedLetters.length)];
        state.guessedLetters.push(randomLetter);
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

    giveUp: (state) => {
      if (state.status === 'running') {
        state.status = 'givenup';
        state.finishedAt = new Date().toISOString();
      }
    },

    tickTimer: (state) => {
      if (state.status === 'running' && state.timerEnabled && state.secondsLeft !== undefined) {
        state.secondsLeft = Math.max(0, state.secondsLeft - 1);

        if (state.secondsLeft === 0) {
          state.status = 'finished';
          state.finishedAt = new Date().toISOString();
        }
      }
    },

    calculateFinalScore: (state) => {
      if (!state.word || state.status === 'running') return;

      const hintsUsed = [
        state.usedHintMeaning,
        state.usedHintExample,
        state.usedHintReveal
      ].filter(Boolean).length;

      const timeBonus = state.timerEnabled && state.secondsLeft !== undefined
        ? getTimeBonus(state.secondsLeft, 120)
        : 0;

      state.score = calculateScore({
        wordLength: state.word.normalized.replace(/[\s-]/g, '').length,
        livesLeft: state.livesLeft,
        maxLives: state.maxLives,
        hintsUsed,
        timeBonus
      });
    },

    resetGame: () => initialState
  }
});

export const {
  initGame,
  guessLetter,
  useHintMeaning,
  useHintExample,
  useHintReveal,
  pauseGame,
  resumeGame,
  giveUp,
  tickTimer,
  calculateFinalScore,
  resetGame
} = hangmanSlice.actions;

export default hangmanSlice.reducer;