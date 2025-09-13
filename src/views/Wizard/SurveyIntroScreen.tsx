// src/views/Wizard/SurveyIntroScreen.tsx
import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useWizardViewModel } from '@/viewmodels/useWizardViewModel'
import WizardButton from '@/components/WizardButton'

const SurveyIntroScreen: React.FC = () => {
  const { actions } = useWizardViewModel()

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.emoji}>🎯</Text>
        <Text style={styles.title}>¡Casi listos!</Text>
        <Text style={styles.subtitle}>
          Queremos conocerte mejor para personalizar Vocablox
        </Text>
        <Text style={styles.description}>
          Te haremos algunas preguntas rápidas para crear la mejor experiencia de aprendizaje para ti.
        </Text>
        <Text style={styles.timeInfo}>Solo tomará 2-3 minutos</Text>
      </View>
      
      <View style={styles.buttonContainer}>
        <WizardButton
          title="Comenzar"
          onPress={actions.nextStep}
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
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 80,
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 24,
  },
  description: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 16,
  },
  timeInfo: {
    fontSize: 14,
    color: '#aaa',
    textAlign: 'center',
  },
  buttonContainer: {
    paddingBottom: 20,
  },
})

export default SurveyIntroScreen