export function calcScore(params: {
  isCorrect: boolean;
  timeLeft: number;           // 0..secondsPerQ
  secondsPerQ: number;
  streakMultiplier: number;   // 1.0..2.0 (por ahora 1.0; integrará racha en F4)
}): number {
  const { isCorrect, timeLeft, secondsPerQ, streakMultiplier } = params;

  if (!isCorrect) return 0;

  const baseScore = 10;
  const maxBonus = 5;

  // Calculate bonus proportional to time left
  const timeRatio = timeLeft / secondsPerQ;
  const bonus = Math.round(maxBonus * timeRatio);

  return Math.round((baseScore + bonus) * streakMultiplier);
}