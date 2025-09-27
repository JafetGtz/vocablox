import React, { useState, memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../../navigation/AppStackNavigator';
import { RootState } from '../../../store/store';
import { mapWizardCategoriesToFocus } from '../services/wordDataService';
import CategorySelector from './CategorySelector';
import ManualWordSelector from './ManualWordSelector';

type NavigationProp = NativeStackNavigationProp<AppStackParamList, 'FocusConfigScreen'>;

const FocusSelectionScreen: React.FC = memo(() => {
  const navigation = useNavigation<NavigationProp>();
  const settings = useSelector((state: RootState) => state.settings.data);

  // Selection mode
  const [selectionMode, setSelectionMode] = useState<'category' | 'manual'>('category');

  // Category selection
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectAllCategories, setSelectAllCategories] = useState(false);

  // Manual selection
  const [selectedWordIds, setSelectedWordIds] = useState<string[]>([]);

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
    setSelectAllCategories(false);
  };

  const handleSelectAllCategories = () => {
    if (selectAllCategories) {
      setSelectedCategories([]);
      setSelectAllCategories(false);
    } else {
      // Convert wizard categories to focus categories and select them
      const userWizardCategories = settings.categories || [];
      const focusCategories = mapWizardCategoriesToFocus(userWizardCategories);
      setSelectedCategories(focusCategories);
      setSelectAllCategories(true);
    }
  };

  const handleContinue = () => {
    const selectionData = {
      mode: selectionMode,
      categories: selectionMode === 'category' ? selectedCategories : [],
      wordIds: selectionMode === 'manual' ? selectedWordIds : [],
    };

    // Navigate to config screen with selection data
    navigation.navigate('FocusConfigScreen', { selection: selectionData });
  };

  const canContinue = () => {
    if (selectionMode === 'category') {
      return selectedCategories.length > 0;
    }
    return selectedWordIds.length > 0;
  };

  const getSelectionCount = () => {
    if (selectionMode === 'category') {
      return selectedCategories.length;
    }
    return selectedWordIds.length;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Seleccionar Palabras</Text>
        </View>

        {/* Selection Mode Toggle */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Modo de Selección</Text>
          <View style={styles.modeToggle}>
            <TouchableOpacity
              style={[
                styles.modeButton,
                selectionMode === 'category' && styles.modeButtonActive
              ]}
              onPress={() => setSelectionMode('category')}
            >
              <Text style={[
                styles.modeButtonText,
                selectionMode === 'category' && styles.modeButtonTextActive
              ]}>
                Por Categoría
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modeButton,
                selectionMode === 'manual' && styles.modeButtonActive
              ]}
              onPress={() => setSelectionMode('manual')}
            >
              <Text style={[
                styles.modeButtonText,
                selectionMode === 'manual' && styles.modeButtonTextActive
              ]}>
                Manual
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Content based on selection mode */}
        <View style={styles.selectionContent}>
          {selectionMode === 'category' ? (
            <CategorySelector
              selectedCategories={selectedCategories}
              selectAllCategories={selectAllCategories}
              onCategoryToggle={handleCategoryToggle}
              onSelectAll={handleSelectAllCategories}
              userCategories={mapWizardCategoriesToFocus(settings.categories || [])}
            />
          ) : (
            <ManualWordSelector
              selectedWordIds={selectedWordIds}
              onSelectionChange={setSelectedWordIds}
              userCategories={mapWizardCategoriesToFocus(settings.categories || [])}
            />
          )}
        </View>
      </View>

      {/* Continue Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            !canContinue() && styles.continueButtonDisabled
          ]}
          onPress={handleContinue}
          disabled={!canContinue()}
        >
          <Text style={[
            styles.continueButtonText,
            !canContinue() && styles.continueButtonTextDisabled
          ]}>
            Continuar ({getSelectionCount()} seleccionada{getSelectionCount() !== 1 ? 's' : ''})
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  backButtonText: {
    fontSize: 24,
    color: '#9D4EDD',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
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
  modeToggle: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    padding: 2,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  modeButtonActive: {
    backgroundColor: '#9D4EDD',
  },
  modeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
  },
  modeButtonTextActive: {
    color: '#FFFFFF',
  },
  selectionContent: {
    flex: 1,
    marginBottom: 4,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    backgroundColor: '#FFFFFF',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  continueButton: {
    backgroundColor: '#9D4EDD',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: '#C7C7CC',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  continueButtonTextDisabled: {
    color: '#8E8E93',
  },
});

FocusSelectionScreen.displayName = 'FocusSelectionScreen';

export default FocusSelectionScreen;