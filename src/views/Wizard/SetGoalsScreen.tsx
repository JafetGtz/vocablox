// src/views/Wizard/SetGoalsScreen.tsx
import React, { useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Slider } from '@rneui/themed'
import { useWizardViewModel } from '@/viewmodels/useWizardViewModel'
import WizardButton from '@/components/WizardButton'

const SetGoalsScreen: React.FC = () => {
  const { data, navigation, actions } = useWizardViewModel()
  
  const [dailyWords, setDailyWords] = useState(data.daily_words || 5)
  const [sessionsPerDay, setSessionsPerDay] = useState(data.sessions_per_day || 1)
  const [sessionDuration, setSessionDuration] = useState(data.session_duration || 15)

  const handleContinue = () => {
    actions.setGoals({
      daily_words: dailyWords,
      sessions_per_day: sessionsPerDay,
      session_duration: sessionDuration
    })
    actions.nextStep()
  }

  const getEstimatedTime = () => {
    const totalMinutes = sessionsPerDay * sessionDuration
    if (totalMinutes < 60) {
      return `${totalMinutes} min/día`
    }
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    return minutes > 0 ? `${hours}h ${minutes}m/día` : `${hours}h/día`
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Define tus objetivos</Text>
        <Text style={styles.subtitle}>
          Personaliza tu plan de aprendizaje
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.goalSection}>
          <Text style={styles.sectionTitle}>Palabras por día</Text>
          <Text style={styles.valueDisplay}>{dailyWords} palabras</Text>
          <Slider
            value={dailyWords}
            onValueChange={setDailyWords}
            minimumValue={3}
            maximumValue={20}
            step={1}
            thumbStyle={styles.sliderThumb}
            trackStyle={styles.sliderTrack}
            minimumTrackTintColor="#667eea"
          />
          <View style={styles.sliderLabels}>
            <Text style={styles.sliderLabel}>3</Text>
            <Text style={styles.sliderLabel}>20</Text>
          </View>
        </View>

        <View style={styles.goalSection}>
          <Text style={styles.sectionTitle}>Sesiones por día</Text>
          <Text style={styles.valueDisplay}>{sessionsPerDay} sesión{sessionsPerDay > 1 ? 'es' : ''}</Text>
          <Slider
            value={sessionsPerDay}
            onValueChange={setSessionsPerDay}
            minimumValue={1}
            maximumValue={4}
            step={1}
            thumbStyle={styles.sliderThumb}
            trackStyle={styles.sliderTrack}
            minimumTrackTintColor="#667eea"
          />
          <View style={styles.sliderLabels}>
            <Text style={styles.sliderLabel}>1</Text>
            <Text style={styles.sliderLabel}>4</Text>
          </View>
        </View>

        <View style={styles.goalSection}>
          <Text style={styles.sectionTitle}>Duración por sesión</Text>
          <Text style={styles.valueDisplay}>{sessionDuration} minutos</Text>
          <Slider
            value={sessionDuration}
            onValueChange={setSessionDuration}
            minimumValue={10}
            maximumValue={60}
            step={5}
            thumbStyle={styles.sliderThumb}
            trackStyle={styles.sliderTrack}
            minimumTrackTintColor="#667eea"
          />
          <View style={styles.sliderLabels}>
            <Text style={styles.sliderLabel}>10m</Text>
            <Text style={styles.sliderLabel}>60m</Text>
          </View>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Resumen</Text>
          <Text style={styles.summaryText}>
            📚 {dailyWords} palabras nuevas por día
          </Text>
          <Text style={styles.summaryText}>
            ⏰ {getEstimatedTime()} de estudio
          </Text>
          <Text style={styles.summaryText}>
            🎯 {dailyWords * 7} palabras por semana
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
  },
  content: {
    flex: 1,
  },
  goalSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  valueDisplay: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#667eea',
    textAlign: 'center',
    marginBottom: 16,
  },
  sliderThumb: {
    backgroundColor: '#667eea',
    width: 24,
    height: 24,
  },
  sliderTrack: {
    height: 6,
    borderRadius: 3,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  sliderLabel: {
    fontSize: 12,
    color: '#888',
  },
  summaryCard: {
    backgroundColor: '#f8f9ff',
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  summaryText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 20,
    gap: 12,
  },
})

export default SetGoalsScreen