import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import Slider from '@react-native-community/slider';
import { useWizardViewModel } from '@/viewmodels/useWizardViewModel'
import WizardButton from '@/components/WizardButton'

const presetGoals = [
  { days: 3, label: '3 días', description: 'Un fin de semana de práctica', icon: '🔥' },
  { days: 7, label: '1 semana', description: 'Una semana completa de aprendizaje', icon: '⭐' },
  { days: 21, label: '21 días', description: 'Forma un hábito sólido', icon: '💪' },
]

const StepStreakGoal: React.FC = () => {
  const { data, actions } = useWizardViewModel()
  
  const [selectedGoal, setSelectedGoal] = useState<number>(
    data.streak_goal_days || 7
  )
  const [useSlider, setUseSlider] = useState<boolean>(
    !presetGoals.some(goal => goal.days === data.streak_goal_days)
  )

  const handlePresetSelect = (days: number) => {
    setSelectedGoal(days)
    setUseSlider(false)
  }

  const handleSliderChange = (value: number) => {
    setSelectedGoal(Math.round(value))
    setUseSlider(true)
  }

  const handleContinue = () => {
    actions.setStreakGoal(selectedGoal)
    actions.nextStep()
  }

  const getGoalDescription = (days: number) => {
    if (days <= 3) return 'Perfecto para empezar'
    if (days <= 7) return 'Un buen desafío inicial'
    if (days <= 14) return 'Construyendo consistencia'
    if (days <= 21) return 'Formando un hábito sólido'
    if (days <= 30) return 'Un mes de disciplina'
    return 'Un reto ambicioso'
  }

  const getGoalEmoji = (days: number) => {
    if (days <= 3) return '🌱'
    if (days <= 7) return '🔥'
    if (days <= 14) return '⭐'
    if (days <= 21) return '💪'
    if (days <= 30) return '🏆'
    return '🚀'
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>¿Cuál es tu objetivo de racha?</Text>
        <Text style={styles.subtitle}>
          Establece una meta de días consecutivos de estudio que te motive a ser constante
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.presetsSection}>
          <Text style={styles.sectionTitle}>Objetivos recomendados</Text>
          {presetGoals.map((goal) => (
            <TouchableOpacity
              key={goal.days}
              style={[
                styles.presetOption,
                selectedGoal === goal.days && !useSlider && styles.selectedPreset
              ]}
              onPress={() => handlePresetSelect(goal.days)}
            >
              <View style={styles.presetContent}>
                <Text style={styles.presetIcon}>{goal.icon}</Text>
                <View style={styles.presetText}>
                  <Text style={[
                    styles.presetLabel,
                    selectedGoal === goal.days && !useSlider && styles.selectedText
                  ]}>
                    {goal.label}
                  </Text>
                  <Text style={[
                    styles.presetDescription,
                    selectedGoal === goal.days && !useSlider && styles.selectedDescription
                  ]}>
                    {goal.description}
                  </Text>
                </View>
              </View>
              {selectedGoal === goal.days && !useSlider && (
                <View style={styles.checkmark}>
                  <Text style={styles.checkmarkText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>o personaliza</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.customSection}>
          <Text style={styles.sectionTitle}>Objetivo personalizado</Text>
          <View style={[
            styles.sliderContainer,
            useSlider && styles.selectedSlider
          ]}>
            <View style={styles.sliderHeader}>
              <Text style={styles.sliderValue}>
                {getGoalEmoji(selectedGoal)} {selectedGoal} día{selectedGoal !== 1 ? 's' : ''}
              </Text>
              <Text style={styles.sliderDescription}>
                {getGoalDescription(selectedGoal)}
              </Text>
            </View>

            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={90}
              value={selectedGoal}
              onValueChange={handleSliderChange}
              step={1}
              minimumTrackTintColor="#667eea"
              maximumTrackTintColor="#e9ecef"
              thumbTintColor="#667eea"
            />

            <View style={styles.sliderLabels}>
              <Text style={styles.sliderLabel}>1 día</Text>
              <Text style={styles.sliderLabel}>90 días</Text>
            </View>
          </View>
        </View>

        <View style={styles.motivationContainer}>
          <Text style={styles.motivationTitle}>💡 Consejo</Text>
          <Text style={styles.motivationText}>
            {selectedGoal <= 7 
              ? "Empezar con objetivos pequeños es una estrategia inteligente. Siempre puedes aumentar tu meta después." 
              : selectedGoal <= 21
              ? "¡Excelente elección! Los estudios muestran que 21 días pueden ayudar a formar un hábito duradero."
              : "¡Ambicioso! Recuerda que la consistencia es más importante que la perfección. Puedes ajustar tu meta en cualquier momento."
            }
          </Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <WizardButton
          title="Atrás"
          onPress={actions.prevStep}
          variant="secondary"
        />
        <WizardButton
          title="Continuar"
          onPress={handleContinue}
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
  presetsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  presetOption: {
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e9ecef',
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#f8f9fa',
    position: 'relative',
  },
  selectedPreset: {
    borderColor: '#667eea',
    backgroundColor: '#f0f2ff',
  },
  presetContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  presetIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  presetText: {
    flex: 1,
  },
  presetLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  presetDescription: {
    fontSize: 14,
    color: '#666',
  },
  selectedText: {
    color: '#667eea',
  },
  selectedDescription: {
    color: '#555',
  },
  checkmark: {
    position: 'absolute',
    top: 12,
    right: 12,
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
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e9ecef',
  },
  dividerText: {
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#666',
    backgroundColor: '#fff',
  },
  customSection: {
    marginBottom: 24,
  },
  sliderContainer: {
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e9ecef',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  selectedSlider: {
    borderColor: '#667eea',
    backgroundColor: '#f0f2ff',
  },
  sliderHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  sliderValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  sliderDescription: {
    fontSize: 14,
    color: '#666',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  sliderLabel: {
    fontSize: 12,
    color: '#999',
  },
  motivationContainer: {
    backgroundColor: '#fff9e6',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ffebb3',
  },
  motivationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#d4a017',
    marginBottom: 8,
  },
  motivationText: {
    fontSize: 14,
    color: '#8b6f00',
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 20,
    gap: 12,
  },
})

export default StepStreakGoal