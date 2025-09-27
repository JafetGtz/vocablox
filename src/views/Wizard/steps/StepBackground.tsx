import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native'
import { useWizardViewModel } from '@/viewmodels/useWizardViewModel'
import { DEFAULT_BACKGROUNDS } from '@/types/wizard'
import WizardButton from '@/components/WizardButton'

const StepBackground: React.FC = () => {
  const { data, navigation, actions } = useWizardViewModel()

  const handleBackgroundSelect = (backgroundId: string) => {
    const selected = DEFAULT_BACKGROUNDS.find(bg => bg.id === backgroundId)
    if (selected) {
      actions.setBackground(selected.id)
    }
  }

  const selectedBackground = DEFAULT_BACKGROUNDS.find(bg => bg.id === data.background)

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Elige tu tema favorito</Text>
        <Text style={styles.subtitle}>
          Personaliza la apariencia de tu experiencia de aprendizaje
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.backgroundGrid}>
          {DEFAULT_BACKGROUNDS.map((background) => (
            <TouchableOpacity
              key={background.id}
              style={[
                styles.backgroundOption,
                selectedBackground?.id === background.id && styles.selectedBackground
              ]}
              onPress={() => handleBackgroundSelect(background.id)}
            >
              {background.type === 'image' ? (
                <Image
                  source={background.preview}
                  style={styles.backgroundPreview}
                  resizeMode="cover"
                />
              ) : (
                <View
                  style={[
                    styles.backgroundPreview,
                    { backgroundColor: background.preview }
                  ]}
                />
              )}
              <Text style={styles.backgroundName}>{background.name}</Text>
              {selectedBackground?.id === background.id && (
                <View style={styles.checkmark}>
                  <Text style={styles.checkmarkText}>✓</Text>
                </View>
              )}
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
          disabled={!data.background}
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
  },
  content: {
    flex: 1,
  },
  backgroundGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  backgroundOption: {
    width: '48%',
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    padding: 16,
    alignItems: 'center',
  },
  selectedBackground: {
    borderColor: '#667eea',
    backgroundColor: '#f0f2ff',
  },
  backgroundPreview: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 12,
  },
  backgroundName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
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

export default StepBackground