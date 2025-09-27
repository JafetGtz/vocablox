import { FocusWordItem } from '../types';

interface WordData {
  palabra: string;
  significado: string;
  ejemplo?: string;
}

// Available categories and their JSON files
export const AVAILABLE_CATEGORIES = [
  { id: 'medicina', name: 'Medicina', file: require('../../../assets/jsons/medicina.json') },
  { id: 'negocios', name: 'Negocios', file: require('../../../assets/jsons/negocios.json') },
  { id: 'ciencia', name: 'Ciencia', file: require('../../../assets/jsons/ciencia.json') },
  { id: 'arte', name: 'Arte', file: require('../../../assets/jsons/arte.json') },
  { id: 'deportes', name: 'Deportes', file: require('../../../assets/jsons/deportes.json') },
  { id: 'viaje', name: 'Viaje', file: require('../../../assets/jsons/viaje.json') },
  { id: 'comida', name: 'Comida', file: require('../../../assets/jsons/comida.json') },
  { id: 'derecho', name: 'Derecho', file: require('../../../assets/jsons/derecho.json') },
  { id: 'tecnologia', name: 'Tecnología', file: require('../../../assets/jsons/tecnologia.json') },
  { id: 'ingenieria', name: 'Ingeniería', file: require('../../../assets/jsons/ingenieria.json') },
] as const;

export type CategoryId = typeof AVAILABLE_CATEGORIES[number]['id'];

class WordDataService {
  private categoryData: Record<string, FocusWordItem[]> = {};
  private allWords: FocusWordItem[] = [];

  constructor() {
    this.loadCategoryData();
  }

  private loadCategoryData() {
    AVAILABLE_CATEGORIES.forEach(category => {
      const words = category.file as WordData[];
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
    return this.allWords;
  }

  searchWords(query: string): FocusWordItem[] {
    if (!query.trim()) return [];

    const lowerQuery = query.toLowerCase().trim();
    return this.allWords.filter(word =>
      word.word.toLowerCase().includes(lowerQuery) ||
      word.meaning.toLowerCase().includes(lowerQuery)
    );
  }

  searchWordsInCategories(query: string, categoryIds: string[]): FocusWordItem[] {
    if (!query.trim()) return [];

    const lowerQuery = query.toLowerCase().trim();
    const wordsInCategories = this.getMultipleCategoryWords(categoryIds);

    return wordsInCategories.filter(word =>
      word.word.toLowerCase().includes(lowerQuery) ||
      word.meaning.toLowerCase().includes(lowerQuery)
    );
  }

  getWordsByIds(wordIds: string[]): FocusWordItem[] {
    return this.allWords.filter(word => wordIds.includes(word.id));
  }

  getCategoryStats(categoryId: string): { total: number; category: string } {
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

// Category ID mapping from wizard format to focus format
export const CATEGORY_ID_MAPPING: Record<string, string> = {
  // Wizard ID -> Focus ID
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

// Helper function to convert wizard category IDs to focus category IDs
export const mapWizardCategoriesToFocus = (wizardCategories: string[]): string[] => {
  return wizardCategories.map(wizardId => CATEGORY_ID_MAPPING[wizardId] || wizardId);
};

// Helper function to convert focus category IDs to wizard category IDs
export const mapFocusCategoriesToWizard = (focusCategories: string[]): string[] => {
  const reverseMapping = Object.fromEntries(
    Object.entries(CATEGORY_ID_MAPPING).map(([wizard, focus]) => [focus, wizard])
  );
  return focusCategories.map(focusId => reverseMapping[focusId] || focusId);
};

export const wordDataService = new WordDataService();