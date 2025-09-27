import { HangmanWord } from './types';

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

function normalizeWord(word: string): string {
  return word
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-ZÑ\s-]/gi, '')
    .toUpperCase()
    .trim();
}

function isValidForHangman(normalized: string, minLen: number, maxLen: number): boolean {
  const cleanWord = normalized.replace(/[\s-]/g, '');
  const length = cleanWord.length;

  if (length < minLen || length > maxLen) return false;

  const validChars = /^[A-ZÑ\s-]+$/;
  return validChars.test(normalized);
}

export function buildHangmanWord(params: {
  selectedCategories: string[];
  minLen?: number;
  maxLen?: number;
  dailySeed?: string;
}): HangmanWord | null {
  const { selectedCategories, minLen = 5, maxLen = 14, dailySeed } = params;

  let allWords: { word: Word; category: string }[] = [];

  selectedCategories.forEach(category => {
    const categoryWords = CATEGORY_WORDS[category];
    if (categoryWords) {
      categoryWords.forEach(word => {
        allWords.push({ word, category });
      });
    }
  });

  const validWords = allWords.filter(({ word }) => {
    const normalized = normalizeWord(word.palabra);
    return isValidForHangman(normalized, minLen, maxLen);
  });

  if (validWords.length === 0) return null;

  let selectedIndex: number;
  if (dailySeed) {
    const seedNumber = parseInt(dailySeed.replace(/\D/g, '')) || 0;
    selectedIndex = seedNumber % validWords.length;
  } else {
    selectedIndex = Math.floor(Math.random() * validWords.length);
  }

  const selected = validWords[selectedIndex];
  const normalized = normalizeWord(selected.word.palabra);

  return {
    id: `${selected.category}::${selected.word.palabra.trim()}`,
    palabra: selected.word.palabra,
    significado: selected.word.significado,
    ejemplo: selected.word.ejemplo,
    category: selected.category,
    display: selected.word.palabra,
    normalized
  };
}