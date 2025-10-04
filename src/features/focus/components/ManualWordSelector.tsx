import React, { useState, memo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { wordDataService } from '../services/wordDataService';
import { FocusWordItem } from '../types';

interface ManualWordSelectorProps {
  selectedWordIds: string[];
  onSelectionChange: (selectedIds: string[]) => void;
  userCategories: string[];
}

const ManualWordSelector: React.FC<ManualWordSelectorProps> = memo(({
  selectedWordIds,
  onSelectionChange,
  userCategories,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<FocusWordItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Get user words from Redux store
  const userWords = useSelector((state: RootState) => state.userWords.words);
  const userWordsEnabled = useSelector((state: RootState) => state.userWords.isEnabled);

  // Update wordDataService with user words when component mounts or words change
  useEffect(() => {
    if (userWordsEnabled) {
      wordDataService.setUserWords(userWords);
    } else {
      wordDataService.setUserWords([]);
    }
  }, [userWords, userWordsEnabled]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setIsSearching(true);

    if (query.trim().length > 0) {
      // Filter search by user's wizard-selected categories
      if (userCategories.length > 0) {
        const results = wordDataService.searchWordsInCategories(query, userCategories);
        setSearchResults(results);
      } else {
        // If no wizard categories, show message
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
    }

    setIsSearching(false);
  };

  const toggleWordSelection = (wordId: string) => {
    if (selectedWordIds.includes(wordId)) {
      onSelectionChange(selectedWordIds.filter(id => id !== wordId));
    } else {
      onSelectionChange([...selectedWordIds, wordId]);
    }
  };

  const removeSelectedWord = (wordId: string) => {
    onSelectionChange(selectedWordIds.filter(id => id !== wordId));
  };

  const clearAllSelections = () => {
    onSelectionChange([]);
  };

  const getSelectedWords = () => {
    return wordDataService.getWordsByIds(selectedWordIds);
  };

  const renderSearchResult = ({ item }: { item: FocusWordItem }) => {
    const isSelected = selectedWordIds.includes(item.id);

    return (
      <TouchableOpacity
        style={[styles.resultItem, isSelected && styles.resultItemSelected]}
        onPress={() => toggleWordSelection(item.id)}
      >
        <View style={styles.resultContent}>
          <Text style={[styles.resultWord, isSelected && styles.resultWordSelected]}>
            {item.word}
          </Text>
          <Text style={[styles.resultCategory, isSelected && styles.resultCategorySelected]}>
            {item.category}
          </Text>
          <Text
            style={[styles.resultMeaning, isSelected && styles.resultMeaningSelected]}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {item.meaning}
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

  const renderSelectedWord = (word: FocusWordItem) => (
    <View key={word.id} style={styles.selectedWordChip}>
      <View style={styles.selectedWordContent}>
        <Text style={styles.selectedWordText} numberOfLines={1}>
          {word.word}
        </Text>
        <Text style={styles.selectedWordCategory} numberOfLines={1}>
          {word.category}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removeSelectedWord(word.id)}
      >
        <Text style={styles.removeButtonText}>×</Text>
      </TouchableOpacity>
    </View>
  );

  const selectedWords = getSelectedWords();

  return (
    <View style={styles.container}>
      {/* Search Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Buscar Palabras</Text>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Busca por palabra o significado..."
            value={searchQuery}
            onChangeText={handleSearch}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {/* Search Results */}
        {searchQuery.length > 0 && (
          <View style={styles.resultsContainer}>
            {isSearching ? (
              <Text style={styles.loadingText}>Buscando...</Text>
            ) : userCategories.length === 0 ? (
              <Text style={styles.noWizardCategoriesText}>
                Completa el wizard para seleccionar categorías y poder buscar palabras
              </Text>
            ) : searchResults.length > 0 ? (
              <FlatList
                data={searchResults}
                renderItem={renderSearchResult}
                keyExtractor={item => item.id}
                style={styles.resultsList}
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled
              />
            ) : (
              <Text style={styles.noResultsText}>
                No se encontraron palabras que coincidan con "{searchQuery}" en tus categorías
              </Text>
            )}
          </View>
        )}
      </View>

      {/* Selected Words Section */}
      <View style={styles.section}>
        <View style={styles.selectedHeader}>
          <Text style={styles.sectionTitle}>
            Palabras Seleccionadas ({selectedWords.length})
          </Text>
          {selectedWords.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={clearAllSelections}
            >
              <Text style={styles.clearButtonText}>Limpiar todo</Text>
            </TouchableOpacity>
          )}
        </View>

        {selectedWords.length > 0 ? (
          <ScrollView
            style={styles.selectedWordsContainer}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled
          >
            <View style={styles.selectedWordsGrid}>
              {selectedWords.map(word => renderSelectedWord(word))}
            </View>
          </ScrollView>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Usa el buscador para encontrar y seleccionar palabras
            </Text>
            <Text style={styles.emptySubtext}>
              Mínimo recomendado: 10 palabras
            </Text>
          </View>
        )}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
  },
  searchContainer: {
    marginBottom: 12,
  },
  searchInput: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#000000',
  },
  resultsContainer: {
    maxHeight: 300,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
  },
  resultsList: {
    maxHeight: 280,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  resultItemSelected: {
    backgroundColor: '#F3E8FF',
  },
  resultContent: {
    flex: 1,
    marginRight: 12,
  },
  resultWord: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 2,
  },
  resultWordSelected: {
    color: '#9D4EDD',
  },
  resultCategory: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
  resultCategorySelected: {
    color: '#9D4EDD',
  },
  resultMeaning: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 18,
  },
  resultMeaningSelected: {
    color: '#555555',
  },
  checkbox: {
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
  loadingText: {
    textAlign: 'center',
    padding: 20,
    color: '#666666',
    fontSize: 14,
  },
  noResultsText: {
    textAlign: 'center',
    padding: 20,
    color: '#666666',
    fontSize: 14,
  },
  selectedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#EC4899',
    borderRadius: 8,
  },
  clearButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  selectedWordsContainer: {
    maxHeight: 200,
  },
  selectedWordsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectedWordChip: {
    backgroundColor: '#9D4EDD',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    marginRight: 8,
    maxWidth: '100%',
  },
  selectedWordContent: {
    flex: 1,
    marginRight: 8,
  },
  selectedWordText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  selectedWordCategory: {
    color: '#FFFFFF',
    fontSize: 10,
    opacity: 0.8,
  },
  removeButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    
    backgroundColor: 'white',
    borderRadius: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
  },
  noWizardCategoriesText: {
    textAlign: 'center',
    padding: 20,
    color: '#EC4899',
    fontSize: 14,
    fontWeight: '500',
  },
});

ManualWordSelector.displayName = 'ManualWordSelector';

export default ManualWordSelector;