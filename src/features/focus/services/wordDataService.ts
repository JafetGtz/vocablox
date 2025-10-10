import { FocusWordItem } from '../types';
import { UserWord } from '../../userWords/userWordsSlice';
import { getWordsForCategory } from '@/services/categoryService';
import { DEFAULT_CATEGORIES } from '@/types/wizard';

/**
 * Focus usa el servicio centralizado de categorías
 * Las categorías disponibles se obtienen dinámicamente de DEFAULT_CATEGORIES
 */

// Category ID mapping from wizard format to focus format
export const CATEGORY_ID_MAPPING: Record<string, string> = {
  // Wizard ID -> Focus ID (Focus usa español)
  'technology': 'tecnologia',
  'business': 'negocios',
  'science': 'ciencia',
  'arts': 'arte',
  'sports': 'deportes',
  'travel': 'viaje',
  'food': 'comida',
  'medicine': 'medicina',
  'law': 'derecho',
  'engineering': 'ingenieria',
};

// Construir AVAILABLE_CATEGORIES dinámicamente desde DEFAULT_CATEGORIES
export const AVAILABLE_CATEGORIES = DEFAULT_CATEGORIES.map(cat => ({
  id: cat.id, // Usar el ID del wizard directamente
  name: cat.name,
  icon: cat.icon,
}));

export type CategoryId = string;

class WordDataService {
  private categoryData: Record<string, FocusWordItem[]> = {};
  private allWords: FocusWordItem[] = [];
  private userWords: FocusWordItem[] = [];

  constructor() {
    this.loadCategoryData();
  }

  private loadCategoryData() {
    AVAILABLE_CATEGORIES.forEach(category => {
      // Usar el servicio centralizado para obtener las palabras
      const words = getWordsForCategory(category.id);
      const focusWords: FocusWordItem[] = words.map((word, index) => ({
        id: `${category.id}_${index}`,
        word: word.palabra,
        meaning: word.significado,
        category: category.name,
      }));

      this.categoryData[category.id] = focusWords;
      this.allWords.push(...focusWords);
    });
  }

  getCategoryWords(categoryId: string): FocusWordItem[] {
    // Special handling for user words category
    if (categoryId === 'mis-palabras') {
      return this.userWords;
    }
    return this.categoryData[categoryId] || [];
  }

  getMultipleCategoryWords(categoryIds: string[]): FocusWordItem[] {
    const words: FocusWordItem[] = [];
    categoryIds.forEach(categoryId => {
      words.push(...this.getCategoryWords(categoryId));
    });
    return words;
  }

  getAllWords(): FocusWordItem[] {
    return [...this.allWords, ...this.userWords];
  }

  setUserWords(userWords: UserWord[]): void {
    this.userWords = userWords.map(word => ({
      id: `user_${word.id}`,
      word: word.palabra,
      meaning: word.significado,
      category: 'Mis Palabras',
    }));
  }

  getUserWords(): FocusWordItem[] {
    return this.userWords;
  }

  searchWords(query: string): FocusWordItem[] {
    if (!query.trim()) return [];

    const lowerQuery = query.toLowerCase().trim();
    const allWordsIncludingUser = this.getAllWords();
    return allWordsIncludingUser.filter(word =>
      word.word.toLowerCase().includes(lowerQuery) ||
      word.meaning.toLowerCase().includes(lowerQuery)
    );
  }

  searchWordsInCategories(query: string, categoryIds: string[]): FocusWordItem[] {
    if (!query.trim()) return [];

    const lowerQuery = query.toLowerCase().trim();
    const wordsInCategories = this.getMultipleCategoryWords(categoryIds);

    // Include user words in search
    const allSearchableWords = [...wordsInCategories, ...this.userWords];

    return allSearchableWords.filter(word =>
      word.word.toLowerCase().includes(lowerQuery) ||
      word.meaning.toLowerCase().includes(lowerQuery)
    );
  }

  getWordsByIds(wordIds: string[]): FocusWordItem[] {
    const allWordsIncludingUser = this.getAllWords();
    return allWordsIncludingUser.filter(word => wordIds.includes(word.id));
  }

  getCategoryStats(categoryId: string): { total: number; category: string } {
    // Special handling for user words category
    if (categoryId === 'mis-palabras') {
      return {
        total: this.userWords.length,
        category: 'Mis Palabras',
      };
    }
    const category = AVAILABLE_CATEGORIES.find(cat => cat.id === categoryId);
    return {
      total: this.getCategoryWords(categoryId).length,
      category: category?.name || categoryId,
    };
  }

  getAllCategoriesStats(): Array<{ id: string; name: string; total: number }> {
    return AVAILABLE_CATEGORIES.map(category => ({
      id: category.id,
      name: category.name,
      total: this.getCategoryWords(category.id).length,
    }));
  }
}

// Helper functions ya no son necesarios - Focus y Wizard usan los mismos IDs ahora
// Mantenemos por compatibilidad pero retornan los mismos valores
export const mapWizardCategoriesToFocus = (wizardCategories: string[]): string[] => {
  return wizardCategories; // Ya no necesitamos mapear, usan los mismos IDs
};

export const mapFocusCategoriesToWizard = (focusCategories: string[]): string[] => {
  return focusCategories; // Ya no necesitamos mapear, usan los mismos IDs
};

export const wordDataService = new WordDataService();