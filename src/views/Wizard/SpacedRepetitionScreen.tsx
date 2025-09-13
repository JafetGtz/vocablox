// src/views/Wizard/SpacedRepetitionScreen.tsx
import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { useWizardViewModel } from '@/viewmodels/useWizardViewModel'
import { DEFAULT_DIFFICULTY_LEVELS } from '@/types/wizard'
import WizardButton from '@/components/WizardButton'

const SpacedRepetitionScreen: React.FC = () => {
  const { data, navigation, actions } = useWizardViewModel()

  const handleDifficultySelect = (level: 'easy' | 'normal' | 'challenging') => {
    actions.setDifficulty(level)
  }

  const selectedLevel = data.difficulty_level || 'normal'
  const selectedLevelData = DEFAULT_DIFFICULTY_LEVELS.find(level => level.id === selectedLevel)

  const formatIntervals = (intervals: number[]) => {
    return intervals.map(interval => {
      if (interval === 1) return '1 día'
      if (interval < 30) return `${interval} días`
      if (interval === 30) return '1 mes'
      return `${Math.round(interval / 30)} meses`
    }).join(' → ')
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Elige tu nivel de reto</Text>
        <Text style={styles.subtitle}>
          Personaliza la frecuencia de repaso
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>¿Qué es la repetición espaciada?</Text>
          <Text style={styles.infoText}>
            Es una técnica que programa repasos en intervalos crecientes para optimizar la retención en tu memoria a largo plazo.
          </Text>
        </View>

        <View style={styles.levelsContainer}>
          {DEFAULT_DIFFICULTY_LEVELS.map((level) => (
            <TouchableOpacity
              key={level.id}
              style={[
                styles.levelCard,
                selectedLevel === level.id && styles.selectedLevel
              ]}
              onPress={() => handleDifficultySelect(level.id)}
            >
              <View style={styles.levelHeader}>
                <Text style={[
                  styles.levelName,
                  selectedLevel === level.id && styles.selectedLevelText
                ]}>
                  {level.name}
                </Text>
                {selectedLevel === level.id && (
                  <View style={styles.checkmark}>
                    <Text style={styles.checkmarkText}>✓</Text>
                  </View>
                )}
              </View>
              
              <Text style={styles.levelDescription}>
                {level.description}
              </Text>
              
              <View style={styles.intervalContainer}>
                <Text style={styles.intervalTitle}>Intervalos de repaso:</Text>
                <Text style={styles.intervalText}>
                  {formatIntervals(level.intervals)}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {selectedLevelData && (
          <View style={styles.exampleCard}>
            <Text style={styles.exampleTitle}>Ejemplo con "{selectedLevelData.name}"</Text>
            <Text style={styles.exampleText}>
              Si aprendes una palabra hoy, la verás nuevamente:
            </Text>
            <View style={styles.exampleTimeline}>
              {selectedLevelData.intervals.map((interval, index) => (
                <View key={index} style={styles.timelineItem}>
                  <View style={styles.timelineDot} />
                  <Text style={styles.timelineText}>
                    {interval === 1 ? 'Mañana' : 
                     interval < 7 ? `En ${interval} días` :
                     interval < 30 ? `En ${Math.round(interval / 7)} semanas` :
                     `En ${Math.round(interval / 30)} mes${interval > 30 ? 'es' : ''}`}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
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
  infoCard: {
    backgroundColor: '#f0f2ff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  levelsContainer: {
    gap: 16,
    marginBottom: 24,
  },
  levelCard: {
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    padding: 16,
    backgroundColor: '#fff',
  },
  selectedLevel: {
    borderColor: '#667eea',
    backgroundColor: '#f8f9ff',
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  levelName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  selectedLevelText: {
    color: '#667eea',
  },
  checkmark: {
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
  levelDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 18,
  },
  intervalContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
  },
  intervalTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  intervalText: {
    fontSize: 12,
    color: '#667eea',
    fontWeight: '500',
  },
  exampleCard: {
    backgroundColor: '#f8f9ff',
    borderRadius: 12,
    padding: 16,
  },
  exampleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  exampleText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  exampleTimeline: {
    gap: 8,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timelineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#667eea',
    marginRight: 12,
  },
  timelineText: {
    fontSize: 14,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 20,
    gap: 12,
  },
})

export default SpacedRepetitionScreen