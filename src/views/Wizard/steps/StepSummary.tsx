import React, { useMemo, useCallback } from 'react'
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native'
import { useWizardViewModel } from '@/viewmodels/useWizardViewModel'
import { DEFAULT_BACKGROUNDS } from '@/types/wizard'
import WizardButton from '@/components/WizardButton'

const StepSummary: React.FC = React.memo(() => {
  const { data, loading, actions, error } = useWizardViewModel()

  const selectedBackground = useMemo(
    () => DEFAULT_BACKGROUNDS.find(bg => bg.value === data.background),
    [data.background]
  )
  
  const handleSaveAndComplete = useCallback(async () => {
    const success = await actions.saveAndComplete()
    if (!success && error) {
      Alert.alert(
        'Error al Guardar',
        error,
        [
          { text: 'Reintentar', onPress: handleSaveAndComplete },
          { text: 'Cancelar', style: 'cancel' }
        ]
      )
    }
  }, [actions.saveAndComplete, error])

  console.log('StepSummary rendered')
  
  const timeWindowNames = useMemo(() => ({
    morning: '🌅 Mañana',
    afternoon: '☀️ Tarde',
    evening: '🌙 Noche'
  }), [])

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>¡Perfecto, {data.nickname}!</Text>
        <Text style={styles.subtitle}>
          Revisa tu configuración personalizada antes de comenzar
        </Text>
      </View>

      <View style={styles.summaryCard}>
        <View style={styles.summarySection}>
          <Text style={styles.sectionTitle}>🎨 Tu perfil</Text>
          <View style={styles.profileRow}>
            <Text style={styles.label}>Nombre:</Text>
            <Text style={styles.value}>{data.nickname}</Text>
          </View>
          <View style={styles.profileRow}>
            <Text style={styles.label}>Tema:</Text>
            <Text style={styles.value}>{selectedBackground?.name || 'No seleccionado'}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.summarySection}>
          <Text style={styles.sectionTitle}>💪 Tu frase motivacional</Text>
          <Text style={styles.motivationalText}>
            "{data.motivational}"
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.summarySection}>
          <Text style={styles.sectionTitle}>📚 Categorías de interés</Text>
          <View style={styles.categoriesContainer}>
            {data.categories?.map((category, index) => (
              <View key={category} style={styles.categoryTag}>
                <Text style={styles.categoryText}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.summarySection}>
          <Text style={styles.sectionTitle}>🎯 Tus objetivos</Text>
          <View style={styles.goalRow}>
            <Text style={styles.label}>Meta semanal:</Text>
            <Text style={styles.value}>{data.weekly_words_target} palabras</Text>
          </View>
          <View style={styles.goalRow}>
            <Text style={styles.label}>Palabras por día:</Text>
            <Text style={styles.value}>~{data.daily_words}</Text>
          </View>
          <View style={styles.goalRow}>
            <Text style={styles.label}>Racha objetivo:</Text>
            <Text style={styles.value}>{data.streak_goal_days} días</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.summarySection}>
          <Text style={styles.sectionTitle}>⏰ Tu horario</Text>
          <View style={styles.scheduleInfo}>
            <View style={styles.goalRow}>
              <Text style={styles.label}>Sesiones por día:</Text>
              <Text style={styles.value}>{data.bursts_per_day}</Text>
            </View>
            <View style={styles.goalRow}>
              <Text style={styles.label}>Palabras por sesión:</Text>
              <Text style={styles.value}>~{data.words_per_burst}</Text>
            </View>
          </View>
          
          <Text style={styles.scheduleTitle}>Horarios:</Text>
          <View style={styles.timesContainer}>
            {data.active_windows?.map((window) => (
              <View key={window} style={styles.timeSlot}>
                <Text style={styles.timeText}>
                  {timeWindowNames[window]}: {data.window_times?.[window]}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.finalMessageContainer}>
        <Text style={styles.finalMessage}>
          🚀 ¡Estás listo para comenzar tu viaje de aprendizaje!
        </Text>
        <Text style={styles.finalSubmessage}>
          Tu configuración ha sido diseñada especialmente para ti. 
          Puedes cambiarla en cualquier momento desde la configuración.
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <WizardButton
          title="Atrás"
          onPress={actions.prevStep}
          variant="secondary"
          disabled={loading}
        />
        <WizardButton
          title={loading ? "Guardando..." : "¡Comenzar!"}
          onPress={handleSaveAndComplete}
          variant="primary"
          disabled={loading}
        />
      </View>
    </ScrollView>
   )
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  header: {
    marginBottom: 24,
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
  summaryCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  summarySection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  profileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  goalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: '#666',
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  motivationalText: {
    fontSize: 16,
    color: '#4a5568',
    fontStyle: 'italic',
    lineHeight: 24,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryTag: {
    backgroundColor: '#667eea',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  categoryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  scheduleInfo: {
    marginBottom: 12,
  },
  scheduleTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  timesContainer: {
    gap: 6,
  },
  timeSlot: {
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    padding: 10,
  },
  timeText: {
    fontSize: 14,
    color: '#1565c0',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#e9ecef',
    marginVertical: 16,
  },
  finalMessageContainer: {
    backgroundColor: '#f0f8ff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#b3d9ff',
    alignItems: 'center',
  },
  finalMessage: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1565c0',
    textAlign: 'center',
    marginBottom: 12,
  },
  finalSubmessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 20,
  },
})

export default StepSummary