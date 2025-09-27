import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../../store/store';

const selectHangmanState = (state: RootState) => state.hangman;

export const selectMaskedWord = createSelector(
  [selectHangmanState],
  (hangman) => {
    if (!hangman.word) return '';

    const { display, normalized } = hangman.word;
    const guessedLetters = hangman.guessedLetters;

    let maskedWord = '';

    for (let i = 0; i < display.length; i++) {
      const displayChar = display[i];

      if (/[A-ZÑáéíóúü]/i.test(displayChar)) {
        // Normalizar el carácter actual para comparar con las letras adivinadas
        const normalizedChar = displayChar
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toUpperCase();

        if (guessedLetters.includes(normalizedChar)) {
          maskedWord += displayChar;
        } else {
          maskedWord += '_';
        }
      } else {
        maskedWord += displayChar;
      }
    }

    return maskedWord;
  }
);

export const selectWin = createSelector(
  [selectHangmanState],
  (hangman) => {
    if (!hangman.word) return false;

    const normalized = hangman.word.normalized;
    const uniqueLetters = new Set(
      normalized.split('').filter(char => /[A-ZÑ]/.test(char))
    );

    const allLettersGuessed = Array.from(uniqueLetters).every(letter =>
      hangman.guessedLetters.includes(letter)
    );

    // Victoria si todas las letras fueron adivinadas y el juego no fue abandonado
    return allLettersGuessed && hangman.status !== 'givenup';
  }
);

export const selectLoss = createSelector(
  [selectHangmanState, selectWin],
  (hangman, win) => {
    // Solo es derrota si se quedó sin vidas o abandonó el juego, pero no ganó
    return (hangman.livesLeft === 0 || hangman.status === 'givenup') && !win;
  }
);

export const selectGameFinished = createSelector(
  [selectWin, selectLoss, selectHangmanState],
  (win, loss, hangman) => {
    return win || loss || hangman.status === 'finished' || hangman.status === 'givenup';
  }
);

export const selectCanUseHints = createSelector(
  [selectHangmanState],
  (hangman) => {
    return hangman.status === 'running';
  }
);

export const selectAvailableHints = createSelector(
  [selectHangmanState, selectCanUseHints],
  (hangman, canUseHints) => {
    if (!canUseHints || !hangman.word) {
      return {
        meaning: false,
        example: false,
        revealLetter: false
      };
    }

    return {
      meaning: !hangman.usedHintMeaning,
      example: !hangman.usedHintExample && !!hangman.word.ejemplo,
      revealLetter: !hangman.usedHintReveal
    };
  }
);

export const selectProgressPercentage = createSelector(
  [selectHangmanState],
  (hangman) => {
    if (!hangman.word) return 0;

    const normalized = hangman.word.normalized;
    const uniqueLetters = new Set(
      normalized.split('').filter(char => /[A-ZÑ]/.test(char))
    );

    const guessedCorrectLetters = hangman.guessedLetters.filter(letter =>
      uniqueLetters.has(letter)
    );

    return Math.round((guessedCorrectLetters.length / uniqueLetters.size) * 100);
  }
);

export const selectGameStats = createSelector(
  [selectHangmanState, selectWin, selectLoss],
  (hangman, win, loss) => {
    const hintsUsed = [
      hangman.usedHintMeaning,
      hangman.usedHintExample,
      hangman.usedHintReveal
    ].filter(Boolean).length;

    return {
      wordLength: hangman.word?.normalized.replace(/[\s-]/g, '').length || 0,
      totalGuesses: hangman.guessedLetters.length,
      wrongGuesses: hangman.wrongLetters.length,
      hintsUsed,
      livesLeft: hangman.livesLeft,
      maxLives: hangman.maxLives,
      timeLeft: hangman.secondsLeft,
      score: hangman.score,
      won: win,
      lost: loss
    };
  }
);