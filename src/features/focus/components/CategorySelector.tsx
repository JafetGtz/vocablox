import React, { memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { wordDataService, AVAILABLE_CATEGORIES } from '../services/wordDataService';
import { DEFAULT_CATEGORIES } from '../../../types/wizard';

interface CategorySelectorProps {
  selectedCategories: string[];
  selectAllCategories: boolean;
  onCategoryToggle: (categoryId: string) => void;
  onSelectAll: () => void;
  userCategories: string[];
}

const CategorySelector: React.FC<CategorySelectorProps> = memo(({
  selectedCategories,
  selectAllCategories,
  onCategoryToggle,
  onSelectAll,
  userCategories,
}) => {
  // Get user words to check if we should show "Mis Palabras" category
  const userWords = useSelector((state: RootState) => state.userWords.words);
  const userWordsEnabled = useSelector((state: RootState) => state.userWords.isEnabled);

  const getRecommendedCategories = () => {
    // Only show user's wizard-selected categories
    const categories: any[] = [];

    if (userCategories.length > 0) {
      // Map the focus categories back to wizard categories for display
      const wizardCategories = userCategories.map(focusCategoryId => {
        const focusCategory = AVAILABLE_CATEGORIES.find(cat => cat.id === focusCategoryId);
        if (focusCategory) {
          // Find the corresponding wizard category for the display name
          const wizardCategory = DEFAULT_CATEGORIES.find(wCat => {
            const mapping: Record<string, string> = {
              'tecnologia': 'technology',
              'negocios': 'business',
              'ciencia': 'science',
              'arte': 'arts',
              'deportes': 'sports',
              'viaje': 'travel',
              'comida': 'food',
              'medicina': 'medicine',
              'derecho': 'law',
              'ingenieria': 'engineering'
            };
            return wCat.id === mapping[focusCategoryId];
          });

          return {
            id: focusCategory.id,
            name: wizardCategory?.name || focusCategory.name,
            file: focusCategory.file
          };
        }
        return null;
      }).filter(Boolean);

      categories.push(...wizardCategories);
    }

    // Add "Mis Palabras" category if user has created words and it's enabled
    if (userWordsEnabled && userWords.length > 0) {
      categories.push({
        id: 'mis-palabras',
        name: 'Mis Palabras',
        file: null
      });
    }

    return categories as typeof AVAILABLE_CATEGORIES;
  };

  const getOtherCategories = () => {
    // Don't show other categories - only wizard selected ones
    return [];
  };

  const renderCategoryItem = (category: typeof AVAILABLE_CATEGORIES[number], isRecommended = false) => {
    const isSelected = selectedCategories.includes(category.id);
    const stats = wordDataService.getCategoryStats(category.id);

    return (
      <TouchableOpacity
        key={category.id}
        style={[
          styles.categoryItem,
          isSelected && styles.categoryItemSelected,
          isRecommended && styles.categoryItemRecommended,
        ]}
        onPress={() => onCategoryToggle(category.id)}
      >
        <View style={styles.categoryHeader}>
          <Text style={[
            styles.categoryName,
            isSelected && styles.categoryNameSelected
          ]}>
            {category.name}
          </Text>
          
        </View>
        <View style={[
          styles.checkbox,
          isSelected && styles.checkboxSelected
        ]}>
          {isSelected && <Text style={styles.checkmark}>✓</Text>}
        </View>
      </TouchableOpacity>
    );
  };

  const recommendedCategories = getRecommendedCategories();
  const otherCategories = getOtherCategories();

  return (
    <View style={styles.container}>
      {/* Header with Select All Toggle */}
      <View style={styles.headerSection}>
        <Text style={styles.sectionTitle}>Tus Categorías del Wizard</Text>
        {recommendedCategories.length > 0 && (
          <TouchableOpacity
            style={styles.selectAllButton}
            onPress={onSelectAll}
          >
            <Text style={styles.selectAllText}>
              {selectAllCategories ? 'Deseleccionar' : 'Seleccionar todas'}
            </Text>
            
          </TouchableOpacity>
        )}
      </View>

      {/* Categories List */}
      {recommendedCategories.length > 0 ? (
        <>
          <View style={styles.categoriesHeader}>
            <Text style={styles.categoriesCount}>
              {recommendedCategories.length} categoría{recommendedCategories.length !== 1 ? 's' : ''} disponible{recommendedCategories.length !== 1 ? 's' : ''}
            </Text>
            <Text style={styles.scrollHint}>Desliza para ver todas ↓</Text>
          </View>

          <ScrollView
            style={styles.categoriesContainer}
            contentContainerStyle={styles.categoriesContent}
            showsVerticalScrollIndicator={true}
            nestedScrollEnabled={true}
            bounces={true}
          >
            {recommendedCategories.map(category =>
              renderCategoryItem(category, true)
            )}
            {/* Extra padding at bottom to ensure last item is visible */}
            <View style={styles.bottomPadding} />
          </ScrollView>
        </>
      ) : (
        <View style={styles.noWizardContainer}>
          <Text style={styles.noWizardText}>No has seleccionado categorías en el wizard</Text>
          <Text style={styles.noWizardSubtext}>Completa el wizard para seleccionar tus categorías favoritas</Text>
        </View>
      )}

      {/* Selection Summary */}
      {selectedCategories.length > 0 && (
        <View style={styles.summaryContainer}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>
              {selectedCategories.length} categor{selectedCategories.length !== 1 ? 'ías' : 'ía'}
            </Text>
            <Text style={styles.summarySubtext}> Más de 
              {selectedCategories.reduce((total, categoryId) => {
                return total + wordDataService.getCategoryWords(categoryId).length;
              }, 0)} Aprox.
            </Text>
          </View>
          {selectedCategories.reduce((total, categoryId) => {
            return total + wordDataService.getCategoryWords(categoryId).length;
          }, 0) < 5 && (
            <Text style={styles.warningText}>
              Mínimo recomendado: 5 palabras
            </Text>
          )}
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    flex: 1,
  },
  selectAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F3E8FF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#9D4EDD',
    minWidth: 140,
  },
  selectAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#9D4EDD',
    marginRight: 8,
  },
  categoriesContainer: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  categoriesContent: {
    padding: 12,
    flexGrow: 1,
  },
  categoryItem: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E5E5E5',
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  categoryItemSelected: {
    borderColor: '#9D4EDD',
    backgroundColor: '#F3E8FF',
  },
  categoryItemRecommended: {
    borderColor: '#22C55E',
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    flex: 1,
  },
  categoryNameSelected: {
    color: '#9D4EDD',
  },
  recommendedBadge: {
    backgroundColor: '#22C55E',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 8,
  },
  recommendedText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  categoryStats: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  categoryStatsSelected: {
    color: '#9D4EDD',
  },
  checkbox: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#C7C7CC',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxSelected: {
    backgroundColor: '#9D4EDD',
    borderColor: '#9D4EDD',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  summaryContainer: {
    marginHorizontal: 20,
    marginVertical: 12,
    padding: 12,
    backgroundColor: '#F3E8FF',
    borderRadius: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#9D4EDD',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9D4EDD',
    flex: 1,
  },
  summarySubtext: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
  },
  warningText: {
    fontSize: 12,
    color: '#EC4899',
    marginTop: 4,
    textAlign: 'center',
  },
  noWizardContainer: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    borderStyle: 'dashed',
    marginTop: 40,
  },
  noWizardText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
    textAlign: 'center',
    marginBottom: 4,
  },
  noWizardSubtext: {
    fontSize: 12,
    color: '#999999',
    textAlign: 'center',
  },
});

CategorySelector.displayName = 'CategorySelector';

export default CategorySelector;