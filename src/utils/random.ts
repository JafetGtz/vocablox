export function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function sample<T>(arr: T[], n: number): T[] {
  if (n >= arr.length) return [...arr];

  const shuffled = shuffle(arr);
  return shuffled.slice(0, n);
}