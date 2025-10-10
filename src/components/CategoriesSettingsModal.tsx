import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { DEFAULT_CATEGORIES } from '@/types/wizard';
import { updateCategories } from '@/store/slices/settingsSlice';

interface CategoriesSettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

const CategoriesSettingsModal: React.FC<CategoriesSettingsModalProps> = ({
  visible,
  onClose,
}) => {
  console.log('CategoriesSettingsModal rendered, visible:', visible);

  const dispatch = useAppDispatch();
  const userCategories = useAppSelector((state) => state.settings.data.categories) || [];
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Inicializar con las categorías del usuario
  useEffect(() => {
    console.log('CategoriesSettingsModal useEffect, visible:', visible, 'userCategories:', userCategories);
    if (visible) {
      setSelectedCategories([...userCategories]);
    }
  }, [visible, userCategories]);

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

  const handleSave = () => {
    if (selectedCategories.length === 0) {
      Alert.alert(
        'Error',
        'Debes seleccionar al menos una categoría',
        [{ text: 'OK' }]
      );
      return;
    }

    dispatch(updateCategories(selectedCategories));

    Alert.alert(
      'Categorías actualizadas',
      'Tus categorías han sido actualizadas correctamente. Los cambios se verán reflejados en toda la app.',
      [{ text: 'OK', onPress: onClose }]
    );
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
            onPress: () => {
              setSelectedCategories([...userCategories]);
              onClose();
            },
          },
        ]
      );
    } else {
      onClose();
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
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleCancel}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleCancel} style={styles.closeButton}>
              <Icon name="x" size={24} color="#666" />
            </TouchableOpacity>
            <Text style={styles.title}>Configurar Categorías</Text>
            <View style={styles.headerSpacer} />
          </View>

          {/* Info */}
          <View style={styles.infoContainer}>
            <Icon name="info" size={18} color="#9B59B6" />
            <Text style={styles.infoText}>
              Selecciona las categorías de vocabulario que quieres estudiar
            </Text>
          </View>

          {/* Counter */}
          <View style={styles.counterContainer}>
            <Text style={styles.counterText}>
              {selectedCategories.length}/{DEFAULT_CATEGORIES.length} seleccionadas
            </Text>
            {selectedCategories.length < 1 && (
              <Text style={styles.minRequired}> (mínimo 1)</Text>
            )}
          </View>

          {/* Categories List */}
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Categorías seleccionadas */}
            {selectedCats.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Activas</Text>
                {selectedCats.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={[styles.categoryItem, styles.selectedCategory]}
                    onPress={() => handleToggleCategory(category.id)}>
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
                <Text style={styles.sectionTitle}>Disponibles</Text>
                {unselectedCats.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={styles.categoryItem}
                    onPress={() => handleToggleCategory(category.id)}>
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

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.saveButton,
                selectedCategories.length === 0 && styles.saveButtonDisabled,
              ]}
              onPress={handleSave}
              disabled={selectedCategories.length === 0}>
              <Text style={styles.saveButtonText}>Guardar cambios</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  closeButton: {
    padding: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  headerSpacer: {
    width: 32,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3E5FF',
    marginHorizontal: 20,
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
  counterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
  },
  counterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9B59B6',
  },
  minRequired: {
    fontSize: 14,
    color: '#E74C3C',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
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
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
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
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#9B59B6',
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#CCC',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
});

export default CategoriesSettingsModal;
