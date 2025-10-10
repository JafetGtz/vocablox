import { NormalizedWord } from './types';
import { getWordsForCategory } from '@/services/categoryService';

/**
 * Adaptadores para convertir palabras del servicio centralizado al formato del quiz
 * Ahora usa el servicio centralizado - no necesita imports estáticos
 */

// input: ['technology', 'business', ...]
export function getWordsPoolFromCategories(categories: string[]): NormalizedWord[] {
  const allWords: NormalizedWord[] = [];

  categories.forEach(category => {
    const categoryWords = getWordsPoolForCategory(category);
    allWords.push(...categoryWords);
  });

  return allWords;
}

// input: 'technology'
export function getWordsPoolForCategory(category: string): NormalizedWord[] {
  const words = getWordsForCategory(category);
  if (!words || words.length === 0) {
    console.warn(`⚠️ No se encontraron palabras para la categoría: ${category}`);
    return [];
  }

  return words.map(word => ({
    id: `${category}::${word.palabra.trim()}`,
    word: word.palabra,
    meaning: word.significado,
    example: word.ejemplo,
    category
  }));
}