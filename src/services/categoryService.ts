/**
 * Servicio centralizado para cargar categorías y sus palabras dinámicamente
 * Para agregar una nueva categoría:
 * 1. Crear archivo JSON en src/assets/jsons/nombre_categoria.json
 * 2. Agregar entrada en DEFAULT_CATEGORIES en src/types/wizard.ts
 * 3. Agregar mapeo en CATEGORY_JSON_MAP abajo
 */

// Imports estáticos de todos los archivos JSON
import arteWords from '../assets/jsons/arte.json';
import cienciaWords from '../assets/jsons/ciencia.json';
import comidaWords from '../assets/jsons/comida.json';
import deportesWords from '../assets/jsons/deportes.json';
import derechoWords from '../assets/jsons/derecho.json';
import ingenieriaWords from '../assets/jsons/ingenieria.json';
import medicinaWords from '../assets/jsons/medicina.json';
import negociosWords from '../assets/jsons/negocios.json';
import tecnologiaWords from '../assets/jsons/tecnologia.json';
import viajeWords from '../assets/jsons/viaje.json';

export interface Word {
  palabra: string;
  significado: string;
  ejemplo?: string;
}

/**
 * ÚNICO LUGAR donde se mapean las categorías a sus archivos JSON
 * Para agregar una categoría nueva, solo agregar una línea aquí
 */
const CATEGORY_JSON_MAP: Record<string, Word[]> = {
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

/**
 * Obtiene las palabras de una categoría específica
 * @param categoryId - ID de la categoría (ej: 'technology', 'business')
 * @returns Array de palabras de esa categoría
 */
export function getWordsForCategory(categoryId: string): Word[] {
  const words = CATEGORY_JSON_MAP[categoryId];
  if (!words) {
    console.warn(`⚠️ Categoría '${categoryId}' no encontrada en categoryService`);
    return [];
  }
  return words;
}

/**
 * Obtiene las palabras de múltiples categorías combinadas
 * @param categoryIds - Array de IDs de categorías
 * @returns Array con todas las palabras de las categorías solicitadas
 */
export function getWordsForCategories(categoryIds: string[]): Word[] {
  const allWords: Word[] = [];

  categoryIds.forEach(categoryId => {
    const words = getWordsForCategory(categoryId);
    allWords.push(...words);
  });

  console.log(`📚 Cargadas ${allWords.length} palabras de ${categoryIds.length} categorías`);
  return allWords;
}

/**
 * Verifica si una categoría tiene palabras disponibles
 * @param categoryId - ID de la categoría
 * @returns true si la categoría existe y tiene palabras
 */
export function categoryHasWords(categoryId: string): boolean {
  const words = CATEGORY_JSON_MAP[categoryId];
  return !!words && words.length > 0;
}

/**
 * Obtiene todas las categorías disponibles (que tienen archivos JSON)
 * @returns Array de IDs de categorías disponibles
 */
export function getAvailableCategories(): string[] {
  return Object.keys(CATEGORY_JSON_MAP);
}

/**
 * Obtiene estadísticas de una categoría
 * @param categoryId - ID de la categoría
 * @returns Objeto con estadísticas de la categoría
 */
export function getCategoryStats(categoryId: string): {
  totalWords: number;
  wordsWithExamples: number;
  averageMeaningLength: number;
} {
  const words = getWordsForCategory(categoryId);

  if (words.length === 0) {
    return {
      totalWords: 0,
      wordsWithExamples: 0,
      averageMeaningLength: 0,
    };
  }

  const wordsWithExamples = words.filter(w => w.ejemplo).length;
  const totalMeaningLength = words.reduce((sum, w) => sum + w.significado.length, 0);
  const averageMeaningLength = Math.round(totalMeaningLength / words.length);

  return {
    totalWords: words.length,
    wordsWithExamples,
    averageMeaningLength,
  };
}
