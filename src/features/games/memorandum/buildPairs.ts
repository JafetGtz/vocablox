import { Pair } from './types';
import { getWordsPoolFromCategories } from '../flashQuiz/adapters';
import { sample } from '../../../utils/random';

interface BuildPairsInput {
  categories: string[];
  count?: number;
}

interface BuildPairsResult {
  pairs: Pair[];
  actualCount: number;
  hasInsufficientWords: boolean;
}

export function buildPairs({ categories, count = 10 }: BuildPairsInput): Pair[] {
  const wordsPool = getWordsPoolFromCategories(categories);

  if (wordsPool.length === 0) {
    return [];
  }

  const selectedWords = sample(wordsPool, count);

  return selectedWords.map(word => ({
    id: word.id,
    word: word.word,
    meaning: word.meaning,
    category: word.category
  }));
}

export function buildPairsWithValidation({ categories, count = 10 }: BuildPairsInput): BuildPairsResult {
  const wordsPool = getWordsPoolFromCategories(categories);

  if (wordsPool.length === 0) {
    return {
      pairs: [],
      actualCount: 0,
      hasInsufficientWords: true
    };
  }

  // Check if we have enough words, if not adjust count
  const availableCount = Math.min(wordsPool.length, count);
  const hasInsufficientWords = wordsPool.length < count;

  // Suggest reducing to 6-8 pairs if insufficient
  const adjustedCount = hasInsufficientWords && availableCount < 6
    ? Math.max(Math.min(availableCount, 8), 6)
    : availableCount;

  const selectedWords = sample(wordsPool, adjustedCount);

  const pairs = selectedWords.map(word => ({
    id: word.id,
    word: word.word,
    meaning: word.meaning,
    category: word.category
  }));

  return {
    pairs,
    actualCount: adjustedCount,
    hasInsufficientWords: hasInsufficientWords && adjustedCount < count
  };
}