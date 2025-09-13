// src/views/Wizard/ChooseCategoriesScreen.tsx
import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { Switch } from '@rneui/themed'
import { useWizardViewModel } from '@/viewmodels/useWizardViewModel'
import { DEFAULT_CATEGORIES } from '@/types/wizard'
import WizardButton from '@/components/WizardButton'

const ChooseCategoriesScreen: React.FC = () => {
  const { data, navigation, actions } = useWizardViewModel()

  const isCategorySelected = (categoryId: string) => {
    return data.categories?.includes(categoryId) || false
  }

  const handleCategoryToggle = (categoryId: string) => {
    actions.toggleCategorySelection(categoryId)
  }

  const selectedCount = data.categories?.length || 0
  const canContinue = selectedCount > 0

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Elige tus áreas de interés</Text>
        <Text style={styles.subtitle}>
          Selecciona las categorías que quieres aprender
        </Text>
        <Text style={styles.counter}>
          {selectedCount} de {DEFAULT_CATEGORIES.length} seleccionadas
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.categoriesContainer}>
          {DEFAULT_CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryItem,
                isCategorySelected(category.id) && styles.selectedCategory
              ]}
              onPress={() => handleCategoryToggle(category.id)}
            >
              <View style={styles.categoryContent}>
                <View style={styles.categoryInfo}>
                  <Text style={styles.categoryIcon}>{category.icon}</Text>
                  <View style={styles.categoryText}>
                    <Text style={styles.categoryName}>{category.name}</Text>
                    <Text style={styles.categoryDescription}>
                      {category.description}
                    </Text>
                  </View>
                </View>
                <Switch
                  value={isCategorySelected(category.id)}
                  onValueChange={() => handleCategoryToggle(category.id)}
                  trackColor={{ false: '#e0e0e0', true: '#667eea' }}
                  thumbColor={isCategorySelected(category.id) ? '#fff' : '#f4f3f4'}
                />
              </View>
            </TouchableOpacity>
          ))}
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
          disabled={!canContinue}
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
    marginBottom: 8,
  },
  counter: {
    fontSize: 14,
    color: '#667eea',
    textAlign: 'center',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  categoriesContainer: {
    gap: 12,
  },
  categoryItem: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  selectedCategory: {
    borderColor: '#667eea',
    backgroundColor: '#f0f2ff',
  },
  categoryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  categoryText: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 20,
    gap: 12,
  },
})

export default ChooseCategoriesScreen