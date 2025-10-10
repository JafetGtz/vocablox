import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '@/navigation/AppStackNavigator';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { DEFAULT_CATEGORIES } from '@/types/wizard';
import { updateCategories, saveSuccess } from '@/store/slices/settingsSlice';
import { upsertSettings } from '@/services/auth/settingsServices';
import { useAuth } from '@/viewmodels/useAuthViewModel';

type CategoriesSettingsNavigationProp = NativeStackNavigationProp<
  AppStackParamList,
  'CategoriesSettings'
>;

export default function CategoriesSettingsScreen() {
  const navigation = useNavigation<CategoriesSettingsNavigationProp>();
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const userCategories = useAppSelector((state) => state.settings.data.categories) || [];
  const allSettings = useAppSelector((state) => state.settings.data);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([...userCategories]);
  const [isSaving, setIsSaving] = useState(false);

  const handleToggleCategory = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      // Prevenir deseleccionar si solo queda una
      if (selectedCategories.length === 1) {
        Alert.alert(
          'Categoría requerida',
          'Debes tener al menos una categoría seleccionada',
          [{ text: 'OK' }]
        );
        return;
      }
      setSelectedCategories(selectedCategories.filter((id) => id !== categoryId));
    } else {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };

  const handleSave = async () => {
    if (selectedCategories.length === 0) {
      Alert.alert(
        'Error',
        'Debes seleccionar al menos una categoría',
        [{ text: 'OK' }]
      );
      return;
    }

    if (isSaving) return;

    try {
      setIsSaving(true);

      console.log('💾 Categorías actuales en Redux:', userCategories);
      console.log('💾 Categorías a guardar:', selectedCategories);
      console.log('💾 Settings completos:', JSON.stringify(allSettings, null, 2));

      // Preparar settings actualizados (igual que en wizard)
      const settingsToSave = {
        ...allSettings,
        categories: selectedCategories,
        user_id: user?.id || allSettings.user_id,
      };

      console.log('💾 Settings a guardar:', JSON.stringify(settingsToSave, null, 2));

      // Guardar usando upsertSettings (igual que en wizard)
      const result = await upsertSettings(settingsToSave as any);
      console.log('✅ Categorías guardadas exitosamente:', JSON.stringify(result, null, 2));

      // Actualizar Redux con el resultado del servidor
      dispatch(saveSuccess(result));

      console.log('✅ Redux actualizado con categorías:', result.categories);

      Alert.alert(
        'Categorías actualizadas',
        'Tus categorías han sido actualizadas correctamente. Los cambios se verán reflejados en toda la app.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error('❌ Error al guardar categorías:', error);
      Alert.alert(
        'Error',
        'Hubo un error al guardar las categorías. Por favor intenta de nuevo.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Verificar si hay cambios
    const hasChanges =
      selectedCategories.length !== userCategories.length ||
      selectedCategories.some((cat) => !userCategories.includes(cat));

    if (hasChanges) {
      Alert.alert(
        'Descartar cambios',
        '¿Estás seguro de que deseas descartar los cambios?',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Descartar',
            style: 'destructive',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  // Separar categorías seleccionadas y no seleccionadas
  const selectedCats = DEFAULT_CATEGORIES.filter((cat) =>
    selectedCategories.includes(cat.id)
  );
  const unselectedCats = DEFAULT_CATEGORIES.filter(
    (cat) => !selectedCategories.includes(cat.id)
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancel} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.counterText}>
            {selectedCategories.length}/{DEFAULT_CATEGORIES.length} seleccionadas
          </Text>
          {selectedCategories.length < 1 && (
            <Text style={styles.minRequired}>(mínimo 1)</Text>
          )}
        </View>
        <TouchableOpacity
          onPress={handleSave}
          style={styles.saveButton}
          disabled={selectedCategories.length === 0 || isSaving}>
          <Icon
            name={isSaving ? "loader" : "check"}
            size={24}
            color={(selectedCategories.length === 0 || isSaving) ? "#CCC" : "#9B59B6"}
          />
        </TouchableOpacity>
      </View>

      {/* Info */}
      <View style={styles.infoContainer}>
        <Icon name="info" size={18} color="#9B59B6" />
        <Text style={styles.infoText}>
          Selecciona las categorías de vocabulario que quieres estudiar
        </Text>
      </View>

      {/* Categories List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Categorías seleccionadas */}
        {selectedCats.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ACTIVAS</Text>
            {selectedCats.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[styles.categoryItem, styles.selectedCategory]}
                onPress={() => handleToggleCategory(category.id)}
                activeOpacity={0.7}>
                <View style={styles.categoryIcon}>
                  <Text style={styles.categoryEmoji}>{category.icon}</Text>
                </View>
                <View style={styles.categoryInfo}>
                  <Text style={styles.categoryName}>{category.name}</Text>
                  <Text style={styles.categoryDescription}>
                    {category.description}
                  </Text>
                </View>
                <View style={styles.checkmark}>
                  <Icon name="check-circle" size={24} color="#9B59B6" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Categorías no seleccionadas */}
        {unselectedCats.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>DISPONIBLES</Text>
            {unselectedCats.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryItem}
                onPress={() => handleToggleCategory(category.id)}
                activeOpacity={0.7}>
                <View style={styles.categoryIcon}>
                  <Text style={styles.categoryEmoji}>{category.icon}</Text>
                </View>
                <View style={styles.categoryInfo}>
                  <Text style={styles.categoryName}>{category.name}</Text>
                  <Text style={styles.categoryDescription}>
                    {category.description}
                  </Text>
                </View>
                <View style={styles.addCircle}>
                  <Icon name="plus-circle" size={24} color="#CCC" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5DC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
  },
  saveButton: {
    padding: 8,
    backgroundColor: 'rgba(155, 89, 182, 0.15)',
    borderRadius: 20,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3E5FF',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 12,
    borderRadius: 12,
    gap: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  counterText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
  },
  minRequired: {
    fontSize: 12,
    color: '#E74C3C',
    textAlign: 'center',
    marginTop: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedCategory: {
    backgroundColor: '#F3E5FF',
    borderColor: '#9B59B6',
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryEmoji: {
    fontSize: 24,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  categoryDescription: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  checkmark: {
    marginLeft: 8,
  },
  addCircle: {
    marginLeft: 8,
  },
});
