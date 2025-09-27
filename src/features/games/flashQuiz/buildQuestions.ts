import { NormalizedWord, QuizQuestion, QuizOption } from './types';
import { shuffle, sample } from '../../../utils/random';

export function buildQuestions(params: {
  wordsPool: NormalizedWord[];
  category?: string;
  count: number;
  optionsPerQuestion?: number;
}): QuizQuestion[] {
  const { wordsPool, category, count, optionsPerQuestion = 4 } = params;

  // Filter by category if specified
  let filteredPool = category
    ? wordsPool.filter(word => word.category === category)
    : wordsPool;

  // Select unique words for questions
  const selectedWords = sample(filteredPool, Math.min(count, filteredPool.length));

  return selectedWords.map((correctWord, index) => {
    // Build distractors (wrong options)
    const distractors = buildDistractors({
      correctWord,
      wordsPool,
      needed: optionsPerQuestion - 1
    });

    // Create all options
    const correctOption: QuizOption = {
      id: `${correctWord.id}-correct`,
      text: correctWord.meaning,
      isCorrect: true
    };

    const distractorOptions: QuizOption[] = distractors.map((distractor, idx) => ({
      id: `${correctWord.id}-distractor-${idx}`,
      text: distractor.meaning,
      isCorrect: false
    }));

    const allOptions = [correctOption, ...distractorOptions];
    const shuffledOptions = shuffle(allOptions);

    return {
      id: `${correctWord.id}#${Math.random().toString(36).substr(2, 9)}`,
      wordId: correctWord.id,
      word: correctWord.word,
      example: correctWord.example,
      options: shuffledOptions,
      category: correctWord.category
    };
  });
}

function buildDistractors(params: {
  correctWord: NormalizedWord;
  wordsPool: NormalizedWord[];
  needed: number;
}): NormalizedWord[] {
  const { correctWord, wordsPool, needed } = params;

  // Filter out the correct word and words with identical meanings
  const candidatePool = wordsPool.filter(word =>
    word.id !== correctWord.id &&
    word.meaning.toLowerCase() !== correctWord.meaning.toLowerCase()
  );

  // Prioritize same category
  const sameCategoryWords = candidatePool.filter(word =>
    word.category === correctWord.category
  );

  const otherCategoryWords = candidatePool.filter(word =>
    word.category !== correctWord.category
  );

  // Try to get as many from same category as possible
  const fromSameCategory = sample(sameCategoryWords, needed);
  const stillNeeded = needed - fromSameCategory.length;

  // Fill remaining with other categories if needed
  const fromOtherCategories = stillNeeded > 0
    ? sample(otherCategoryWords, stillNeeded)
    : [];

  return [...fromSameCategory, ...fromOtherCategories];
}