export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface DifficultyConfig {
  maxLives: number;
  hintsEnabled: boolean;
  timerEnabled: boolean;
  secondsPerWord?: number;
}

export function getDifficultyConfig(difficulty: DifficultyLevel): DifficultyConfig {
  switch (difficulty) {
    case 'easy':
      return {
        maxLives: 8,
        hintsEnabled: true,
        timerEnabled: false
      };
    case 'medium':
      return {
        maxLives: 6,
        hintsEnabled: true,
        timerEnabled: false
      };
    case 'hard':
      return {
        maxLives: 4,
        hintsEnabled: false,
        timerEnabled: true,
        secondsPerWord: 120
      };
    default:
      return getDifficultyConfig('medium');
  }
}