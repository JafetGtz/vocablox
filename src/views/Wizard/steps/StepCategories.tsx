import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { useWizardViewModel } from '@/viewmodels/useWizardViewModel'
import { DEFAULT_CATEGORIES } from '@/types/wizard'
import WizardButton from '@/components/WizardButton'

const StepCategories: React.FC = () => {
  const { data, actions } = useWizardViewModel()
  const selectedCategories = data.categories || []

  const handleToggleCategory = (categoryId: string) => {
    actions.toggleCategorySelection(categoryId)
  }

  const isValid = selectedCategories.length >= 3

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Elige tus categorías de interés</Text>
        <Text style={styles.subtitle}>
          Selecciona al menos 3 categorías para personalizar tu vocabulario
        </Text>
        <Text style={styles.counter}>
          {selectedCategories.length}/10 seleccionadas
          {selectedCategories.length < 3 && (
            <Text style={styles.minRequired}> (mínimo 3)</Text>
          )}
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.categoriesGrid}>
          {DEFAULT_CATEGORIES.map((category) => {
            const isSelected = selectedCategories.includes(category.id)
            
            return (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryOption,
                  isSelected && styles.selectedCategory
                ]}
                onPress={() => handleToggleCategory(category.id)}
              >
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text style={[
                  styles.categoryName,
                  isSelected && styles.selectedCategoryName
                ]}>
                  {category.name}
                </Text>
                <Text style={[
                  styles.categoryDescription,
                  isSelected && styles.selectedCategoryDescription
                ]}>
                  {category.description}
                </Text>
                {isSelected && (
                  <View style={styles.checkmark}>
                    <Text style={styles.checkmarkText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            )
          })}
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <WizardButton
          title="Atrás"
          onPress={actions.prevStep}
          variant="secondary"
        />
        <WizardButton
          title="Continuar"
          onPress={actions.nextStep}
          disabled={!isValid}
          variant="primary"
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 12,
  },
  counter: {
    fontSize: 14,
    fontWeight: '600',
    color: '#667eea',
    textAlign: 'center',
  },
  minRequired: {
    color: '#e74c3c',
  },
  content: {
    flex: 1,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryOption: {
    width: '48%',
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e9ecef',
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    minHeight: 120,
  },
  selectedCategory: {
    borderColor: '#667eea',
    backgroundColor: '#f0f2ff',
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
  },
  selectedCategoryName: {
    color: '#667eea',
  },
  categoryDescription: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
    lineHeight: 14,
  },
  selectedCategoryDescription: {
    color: '#555',
  },
  checkmark: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#667eea',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 20,
    gap: 12,
  },
})

export default StepCategories