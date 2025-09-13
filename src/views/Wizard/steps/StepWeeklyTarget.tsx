import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { useWizardViewModel } from '@/viewmodels/useWizardViewModel'
import WizardButton from '@/components/WizardButton'

const weeklyTargetOptions = [
  { value: 10, label: '10 palabras', description: 'Ritmo relajado - ideal para comenzar', dailyWords: 2 },
  { value: 30, label: '30 palabras', description: 'Ritmo moderado - crecimiento constante', dailyWords: 5 },
  { value: 40, label: '40 palabras', description: 'Ritmo intenso - progreso acelerado', dailyWords: 6 },
  { value: 50, label: '50 palabras', description: 'Ritmo desafiante - máximo crecimiento', dailyWords: 8 },
] as const

const StepWeeklyTarget: React.FC = () => {
  const { data, actions } = useWizardViewModel()
  const [selectedTarget, setSelectedTarget] = useState<10 | 30 | 40 | 50 | null>(
    data.weekly_words_target || null
  )

  const handleSelectTarget = (target: 10 | 30 | 40 | 50) => {
    setSelectedTarget(target)
    actions.setWeeklyTarget(target)
  }

  const selectedOption = weeklyTargetOptions.find(opt => opt.value === selectedTarget)

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>¿Cuántas palabras quieres aprender por semana?</Text>
        <Text style={styles.subtitle}>
          Elige una meta realista que puedas mantener consistentemente
        </Text>
      </View>

      <View style={styles.content}>
        {weeklyTargetOptions.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.targetOption,
              selectedTarget === option.value && styles.selectedTarget
            ]}
            onPress={() => handleSelectTarget(option.value)}
          >
            <View style={styles.targetHeader}>
              <Text style={[
                styles.targetLabel,
                selectedTarget === option.value && styles.selectedText
              ]}>
                {option.label}
              </Text>
              <Text style={[
                styles.dailyBreakdown,
                selectedTarget === option.value && styles.selectedText
              ]}>
                ~{option.dailyWords} palabras/día
              </Text>
            </View>
            <Text style={[
              styles.targetDescription,
              selectedTarget === option.value && styles.selectedDescription
            ]}>
              {option.description}
            </Text>
            {selectedTarget === option.value && (
              <View style={styles.checkmark}>
                <Text style={styles.checkmarkText}>✓</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}

        {selectedOption && (
          <View style={styles.previewContainer}>
            <Text style={styles.previewTitle}>Tu meta semanal:</Text>
            <View style={styles.previewCard}>
              <View style={styles.previewRow}>
                <Text style={styles.previewLabel}>Palabras por semana:</Text>
                <Text style={styles.previewValue}>{selectedOption.value}</Text>
              </View>
              <View style={styles.previewRow}>
                <Text style={styles.previewLabel}>Palabras por día:</Text>
                <Text style={styles.previewValue}>~{selectedOption.dailyWords}</Text>
              </View>
              <Text style={styles.previewNote}>
                📅 Basado en 7 días de estudio por semana
              </Text>
            </View>
          </View>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <WizardButton
          title="Atrás"
          onPress={actions.prevStep}
          variant="secondary"
        />
        <WizardButton
          title="Continuar"
          onPress={actions.nextStep}
          disabled={!selectedTarget}
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
    lineHeight: 24,
  },
  content: {
    flex: 1,
  },
  targetOption: {
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e9ecef',
    padding: 20,
    marginBottom: 16,
    backgroundColor: '#f8f9fa',
    position: 'relative',
  },
  selectedTarget: {
    borderColor: '#667eea',
    backgroundColor: '#f0f2ff',
  },
  targetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  targetLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  dailyBreakdown: {
    fontSize: 14,
    fontWeight: '600',
    color: '#667eea',
  },
  selectedText: {
    color: '#667eea',
  },
  targetDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  selectedDescription: {
    color: '#555',
  },
  checkmark: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#667eea',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  previewContainer: {
    marginTop: 24,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
    textAlign: 'center',
  },
  previewCard: {
    backgroundColor: '#f0f8ff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#b3d9ff',
  },
  previewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  previewLabel: {
    fontSize: 14,
    color: '#666',
  },
  previewValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  previewNote: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 20,
    gap: 12,
  },
})

export default StepWeeklyTarget