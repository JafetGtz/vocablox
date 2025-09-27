import React, { useState, memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../../navigation/AppStackNavigator';
import { AppDispatch } from '../../../store/store';
import { initSession, setQueue, updateSettings } from '../focusSlice';
import { startCountdownWithAudio } from '../audioActions';
import { wordDataService } from '../services/wordDataService';
import { shuffleArray } from '../sequencing';
import { BgAnimationType } from '../types';
import FocusSettings from './FocusSettings';

type RouteProps = NativeStackScreenProps<AppStackParamList, 'FocusConfigScreen'>['route'];
type NavigationProp = NativeStackNavigationProp<AppStackParamList, 'FocusConfigScreen'>;

interface SelectionData {
  mode: 'category' | 'manual';
  categories: string[];
  wordIds: string[];
}

const FocusConfigScreen: React.FC = memo(() => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const dispatch = useDispatch<AppDispatch>();

  const { selection } = route.params;

  // Focus settings
  const [focusOrder, setFocusOrder] = useState<'random' | 'fixed'>('random');
  const [bgAnimation, setBgAnimation] = useState<BgAnimationType>('particles');

  const getWordCount = () => {
    if (selection.mode === 'category') {
      return selection.categories.reduce((total, categoryId) => {
        return total + wordDataService.getCategoryWords(categoryId).length;
      }, 0);
    }
    return selection.wordIds.length;
  };

  const validateAndStartSession = () => {
    const totalWords = getWordCount();

    // Validate minimum word count
    if (totalWords < 5) {
      Alert.alert(
        'Palabras Insuficientes',
        `Necesitas al menos 5 palabras para una sesión Focus. Actualmente tienes ${totalWords}. Regresa y selecciona más categorías o palabras.`,
        [
          { text: 'OK', style: 'default' }
        ]
      );
      return;
    }

    // Update settings with user preferences
    dispatch(updateSettings({
      order: focusOrder,
      bgAnimation: bgAnimation,
    }));

    // Initialize session
    dispatch(initSession({
      source: selection.mode,
      categoryIds: selection.mode === 'category' ? selection.categories : [],
      selectedWordIds: selection.mode === 'manual' ? selection.wordIds : [],
      order: focusOrder,
    }));

    // Build and set the queue
    let wordsQueue;
    if (selection.mode === 'category') {
      wordsQueue = wordDataService.getMultipleCategoryWords(selection.categories);
    } else {
      wordsQueue = wordDataService.getWordsByIds(selection.wordIds);
    }

    // Apply ordering
    if (focusOrder === 'random') {
      wordsQueue = shuffleArray(wordsQueue);
    }

    dispatch(setQueue(wordsQueue));

    // Start the session
    dispatch(startCountdownWithAudio());

    // Navigate to Focus screen
    navigation.navigate('FocusScreen');
  };

  const getSelectionSummary = () => {
    if (selection.mode === 'category') {
      return `${selection.categories.length} categoría${selection.categories.length !== 1 ? 's' : ''}`;
    }
    return `${selection.wordIds.length} palabra${selection.wordIds.length !== 1 ? 's' : ''}`;
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
          <Text style={styles.title}>Configurar Sesión</Text>
        </View>

        {/* Selection Summary */}
        <View style={styles.section}>
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryTitle}>Tu Selección</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryText}>
                {selection.mode === 'category' ? '📂' : '📝'} {getSelectionSummary()}
              </Text>
              <Text style={styles.summarySubtext}>
                {getWordCount()} palabras total
              </Text>
            </View>
            {getWordCount() < 5 && (
              <Text style={styles.warningText}>
                ⚠️ Mínimo recomendado: 5 palabras
              </Text>
            )}
          </View>
        </View>

        {/* Focus Settings */}
        <View style={styles.section}>
          <FocusSettings
            order={focusOrder}
            onOrderChange={setFocusOrder}
            bgAnimation={bgAnimation}
            onBgAnimationChange={setBgAnimation}
          />
        </View>

        {/* Session Preview */}
        <View style={styles.section}>
          <View style={styles.previewContainer}>
            <Text style={styles.previewTitle}>Vista Previa de la Sesión</Text>
            <View style={styles.previewGrid}>
              <View style={styles.previewItem}>
                <Text style={styles.previewLabel}>Palabras</Text>
                <Text style={styles.previewValue}>{getWordCount()}</Text>
              </View>
              <View style={styles.previewItem}>
                <Text style={styles.previewLabel}>Orden</Text>
                <Text style={styles.previewValue}>
                  {focusOrder === 'random' ? '🎲 Aleatorio' : '📋 Secuencial'}
                </Text>
              </View>
              <View style={styles.previewItem}>
                <Text style={styles.previewLabel}>Duración aprox.</Text>
                <Text style={styles.previewValue}>
                  {Math.ceil(getWordCount() * 15 / 60)} min
                </Text>
              </View>
              <View style={styles.previewItem}>
                <Text style={styles.previewLabel}>Modo</Text>
                <Text style={styles.previewValue}>
                  {selection.mode === 'category' ? '📂 Categorías' : '📝 Manual'}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Start Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.startButton,
            getWordCount() < 5 && styles.startButtonDisabled
          ]}
          onPress={validateAndStartSession}
          disabled={getWordCount() < 5}
        >
          <Text style={[
            styles.startButtonText,
            getWordCount() < 5 && styles.startButtonTextDisabled
          ]}>
            🚀 Comenzar Focus ({getWordCount()} palabras)
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
  summaryContainer: {
    backgroundColor: '#F3E8FF',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#9D4EDD',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#9D4EDD',
    marginBottom: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  summaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
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
  previewContainer: {
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#22C55E',
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#22C55E',
    marginBottom: 12,
  },
  previewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  previewItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  previewLabel: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
    textAlign: 'center',
  },
  previewValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    textAlign: 'center',
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
  startButton: {
    backgroundColor: '#22C55E',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  startButtonDisabled: {
    backgroundColor: '#C7C7CC',
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  startButtonTextDisabled: {
    color: '#8E8E93',
  },
});

FocusConfigScreen.displayName = 'FocusConfigScreen';

export default FocusConfigScreen;