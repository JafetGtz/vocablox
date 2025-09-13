// src/views/Wizard/SurveySummaryScreen.tsx
import React, { useMemo, useCallback } from 'react'
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native'
import { useWizardViewModel } from '@/viewmodels/useWizardViewModel'
import { DEFAULT_CATEGORIES, DEFAULT_BACKGROUNDS, DEFAULT_DIFFICULTY_LEVELS } from '@/types/wizard'
import WizardButton from '@/components/WizardButton'

const SurveySummaryScreen: React.FC = () => {
  const { data, actions } = useWizardViewModel()
  const [isSaving, setIsSaving] = React.useState(false)

  const handleFinish = useCallback(async () => {
    if (isSaving) return
    
    setIsSaving(true)
    try {
      const success = await actions.saveAndComplete()
      if (!success) {
        Alert.alert(
          'Error',
          'No pudimos guardar tu configuración. ¿Quieres intentar de nuevo?',
          [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Reintentar', onPress: handleFinish }
          ]
        )
      }
    } catch (error) {
      console.error('Error in handleFinish:', error)
      Alert.alert(
        'Error',
        'Ocurrió un error inesperado. ¿Quieres intentar de nuevo?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Reintentar', onPress: handleFinish }
        ]
      )
    } finally {
      setIsSaving(false)
    }
  }, [actions.saveAndComplete, isSaving])

  const getBackgroundName = useMemo(() => {
    const background = DEFAULT_BACKGROUNDS.find(bg => bg.value === data.background)
    return background?.name || 'Predeterminado'
  }, [data.background])

  const getCategoryNames = useMemo(() => {
    if (!data.categories || data.categories.length === 0) return 'Ninguna'
    return data.categories
      .map(id => DEFAULT_CATEGORIES.find(cat => cat.id === id)?.name)
      .filter(Boolean)
      .join(', ')
  }, [data.categories])

  const getDifficultyName = useMemo(() => {
    const difficulty = DEFAULT_DIFFICULTY_LEVELS.find(d => d.id === data.difficulty_level)
    return difficulty?.name || 'Normal'
  }, [data.difficulty_level])

  const getReminderDaysText = useMemo(() => {
    if (!data.reminder_days || data.reminder_days.length === 0) return 'Ninguno'
    if (data.reminder_days.length === 7) return 'Todos los días'
    if (data.reminder_days.length === 5 && 
        data.reminder_days.includes('monday') && 
        data.reminder_days.includes('friday')) {
      return 'Lunes a Viernes'
    }
    return `${data.reminder_days.length} días por semana`
  }, [data.reminder_days])

  const getEstimatedTime = useMemo(() => {
    const sessions = data.sessions_per_day || 1
    const duration = data.session_duration || 15
    const totalMinutes = sessions * duration
    
    if (totalMinutes < 60) {
      return `${totalMinutes} min/día`
    }
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    return minutes > 0 ? `${hours}h ${minutes}m/día` : `${hours}h/día`
  }, [data.sessions_per_day, data.session_duration])

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.emoji}>🎉</Text>
        <Text style={styles.title}>¡Todo listo!</Text>
        <Text style={styles.subtitle}>
          Revisa tu configuración personalizada
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.summaryCard}>
          <Text style={styles.cardTitle}>Tu plan de aprendizaje</Text>
          
          <View style={styles.summaryItem}>
            <Text style={styles.itemIcon}>🎨</Text>
            <View style={styles.itemContent}>
              <Text style={styles.itemLabel}>Fondo elegido</Text>
              <Text style={styles.itemValue}>{getBackgroundName}</Text>
            </View>
          </View>

          <View style={styles.summaryItem}>
            <Text style={styles.itemIcon}>📚</Text>
            <View style={styles.itemContent}>
              <Text style={styles.itemLabel}>Categorías</Text>
              <Text style={styles.itemValue} numberOfLines={2}>
                {getCategoryNames}
              </Text>
            </View>
          </View>

          <View style={styles.summaryItem}>
            <Text style={styles.itemIcon}>🎯</Text>
            <View style={styles.itemContent}>
              <Text style={styles.itemLabel}>Objetivo diario</Text>
              <Text style={styles.itemValue}>
                {data.daily_words || 5} palabras nuevas
              </Text>
            </View>
          </View>

          <View style={styles.summaryItem}>
            <Text style={styles.itemIcon}>⏰</Text>
            <View style={styles.itemContent}>
              <Text style={styles.itemLabel}>Tiempo de estudio</Text>
              <Text style={styles.itemValue}>{getEstimatedTime}</Text>
            </View>
          </View>

          <View style={styles.summaryItem}>
            <Text style={styles.itemIcon}>🔔</Text>
            <View style={styles.itemContent}>
              <Text style={styles.itemLabel}>Recordatorios</Text>
              <Text style={styles.itemValue}>{getReminderDaysText}</Text>
            </View>
          </View>

          <View style={styles.summaryItem}>
            <Text style={styles.itemIcon}>⚡</Text>
            <View style={styles.itemContent}>
              <Text style={styles.itemLabel}>Nivel de reto</Text>
              <Text style={styles.itemValue}>{getDifficultyName}</Text>
            </View>
          </View>

          {data.nickname && (
            <View style={styles.summaryItem}>
              <Text style={styles.itemIcon}>👋</Text>
              <View style={styles.itemContent}>
                <Text style={styles.itemLabel}>Te llamaremos</Text>
                <Text style={styles.itemValue}>{data.nickname}</Text>
              </View>
            </View>
          )}
        </View>

        {data.motivational && (
          <View style={styles.motivationalCard}>
            <Text style={styles.motivationalTitle}>Tu frase motivacional</Text>
            <Text style={styles.motivationalText}>"{data.motivational}"</Text>
          </View>
        )}

        <View style={styles.finalCard}>
          <Text style={styles.finalTitle}>¿Listo para empezar?</Text>
          <Text style={styles.finalText}>
            Vocablox está configurado especialmente para ti. ¡Comencemos tu viaje de aprendizaje!
          </Text>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <WizardButton
          title="Atrás"
          onPress={actions.prevStep}
          variant="secondary"
          disabled={isSaving}
        />
        <WizardButton
          title={isSaving ? "Guardando..." : "¡Empezar a aprender!"}
          onPress={handleFinish}
          variant="primary"
          loading={isSaving}
          disabled={isSaving}
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
    alignItems: 'center',
  },
  emoji: {
    fontSize: 60,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
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
  summaryCard: {
    backgroundColor: '#f8f9ff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  itemIcon: {
    fontSize: 20,
    marginRight: 16,
    width: 24,
    textAlign: 'center',
  },
  itemContent: {
    flex: 1,
  },
  itemLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  itemValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  motivationalCard: {
    backgroundColor: '#fff5e6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#ff9500',
  },
  motivationalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  motivationalText: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
    lineHeight: 22,
  },
  finalCard: {
    backgroundColor: '#e8f5e8',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  finalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  finalText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 20,
    gap: 12,
  },
})

export default SurveySummaryScreen