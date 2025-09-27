export interface ScoreParams {
  wordLength: number;
  livesLeft: number;
  maxLives: number;
  hintsUsed: number;
  timeBonus?: number;
}

export function calculateScore(params: ScoreParams): number {
  const { wordLength, livesLeft, maxLives, hintsUsed, timeBonus = 0 } = params;

  const baseScore = wordLength * 10;

  const livesBonus = Math.floor((livesLeft / maxLives) * baseScore * 0.5);

  const hintPenalty = hintsUsed * 5;

  const totalScore = Math.max(0, baseScore + livesBonus + timeBonus - hintPenalty);

  return Math.round(totalScore);
}

export function getTimeBonus(secondsLeft: number, maxSeconds: number): number {
  if (secondsLeft <= 0 || maxSeconds <= 0) return 0;

  const timeRatio = secondsLeft / maxSeconds;
  return Math.floor(timeRatio * 20);
}