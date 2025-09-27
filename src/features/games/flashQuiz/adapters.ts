import { NormalizedWord } from './types';

// Static imports for all JSON files
import arteWords from '../../../assets/jsons/arte.json';
import cienciaWords from '../../../assets/jsons/ciencia.json';
import comidaWords from '../../../assets/jsons/comida.json';
import deportesWords from '../../../assets/jsons/deportes.json';
import derechoWords from '../../../assets/jsons/derecho.json';
import ingenieriaWords from '../../../assets/jsons/ingenieria.json';
import medicinaWords from '../../../assets/jsons/medicina.json';
import negociosWords from '../../../assets/jsons/negocios.json';
import tecnologiaWords from '../../../assets/jsons/tecnologia.json';
import viajeWords from '../../../assets/jsons/viaje.json';

interface Word {
  palabra: string;
  significado: string;
  ejemplo?: string;
}

// Static word data lookup
const CATEGORY_WORDS: Record<string, Word[]> = {
  'technology': tecnologiaWords,
  'business': negociosWords,
  'science': cienciaWords,
  'arts': arteWords,
  'sports': deportesWords,
  'travel': viajeWords,
  'food': comidaWords,
  'medicine': medicinaWords,
  'law': derechoWords,
  'engineering': ingenieriaWords,
};

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
  const words = CATEGORY_WORDS[category];
  if (!words) return [];

  return words.map(word => ({
    id: `${category}::${word.palabra.trim()}`,
    word: word.palabra,
    meaning: word.significado,
    example: word.ejemplo,
    category
  }));
}