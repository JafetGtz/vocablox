export type HangmanStatus = 'idle' | 'running' | 'paused' | 'finished' | 'givenup';

export interface HangmanWord {
  id: string;
  palabra: string;
  significado: string;
  ejemplo?: string;
  category: string;
  display: string;
  normalized: string;
}

export interface HangmanState {
  status: HangmanStatus;
  word?: HangmanWord;
  guessedLetters: string[];
  wrongLetters: string[];
  maxLives: number;
  livesLeft: number;
  usedHintMeaning: boolean;
  usedHintExample: boolean;
  usedHintReveal: boolean;
  timerEnabled: boolean;
  secondsLeft?: number;
  score: number;
  startedAt?: string;
  finishedAt?: string;
  dailySeed?: string;
}