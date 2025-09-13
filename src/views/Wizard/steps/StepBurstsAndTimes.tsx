import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { useWizardViewModel } from '@/viewmodels/useWizardViewModel'
import { TimeWindowId } from '@/services/auth/settingsServices'
import WizardButton from '@/components/WizardButton'

const burstOptions = [
  { value: 1, label: '1 sesión al día', description: 'Una sesión concentrada' },
  { value: 2, label: '2 sesiones al día', description: 'Mañana y tarde/noche' },
  { value: 3, label: '3 sesiones al día', description: 'Mañana, tarde y noche' },
] as const

const timeWindows = [
  { id: 'morning' as TimeWindowId, name: 'Mañana', icon: '🌅', defaultTime: '08:00' },
  { id: 'afternoon' as TimeWindowId, name: 'Tarde', icon: '☀️', defaultTime: '14:00' },
  { id: 'evening' as TimeWindowId, name: 'Noche', icon: '🌙', defaultTime: '20:00' },
]

const timeSlots = [
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
  '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
]

const StepBurstsAndTimes: React.FC = () => {
  const { data, actions } = useWizardViewModel()
  
  const [burstsPerDay, setBurstsPerDay] = useState<1 | 2 | 3>(
    data.bursts_per_day || 1
  )
  const [activeWindows, setActiveWindows] = useState<TimeWindowId[]>(
    data.active_windows || ['morning']
  )
  const [windowTimes, setWindowTimes] = useState<{
    morning?: string
    afternoon?: string
    evening?: string
  }>(data.window_times || { morning: '08:00' })

  const handleBurstsChange = (bursts: 1 | 2 | 3) => {
    setBurstsPerDay(bursts)
    
    // Auto-select appropriate windows
    let newActiveWindows: TimeWindowId[]
    let newWindowTimes: typeof windowTimes
    
    switch (bursts) {
      case 1:
        newActiveWindows = ['morning']
        newWindowTimes = { morning: windowTimes.morning || '08:00' }
        break
      case 2:
        newActiveWindows = ['morning', 'evening']
        newWindowTimes = { 
          morning: windowTimes.morning || '08:00', 
          evening: windowTimes.evening || '20:00' 
        }
        break
      case 3:
        newActiveWindows = ['morning', 'afternoon', 'evening']
        newWindowTimes = { 
          morning: windowTimes.morning || '08:00', 
          afternoon: windowTimes.afternoon || '14:00',
          evening: windowTimes.evening || '20:00' 
        }
        break
    }
    
    setActiveWindows(newActiveWindows)
    setWindowTimes(newWindowTimes)
  }

  const handleTimeChange = (window: TimeWindowId, time: string) => {
    const newTimes = { ...windowTimes, [window]: time }
    setWindowTimes(newTimes)
  }

  const handleContinue = () => {
    actions.setBurstsAndTimes({
      bursts_per_day: burstsPerDay,
      active_windows: activeWindows,
      window_times: windowTimes
    })
    actions.nextStep()
  }

  const wordsPerBurst = Math.ceil((data.weekly_words_target || 10) / 7 / burstsPerDay)

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>¿Cuándo prefieres estudiar?</Text>
        <Text style={styles.subtitle}>
          Configura tus sesiones de estudio y horarios preferidos
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sesiones por día</Text>
        {burstOptions.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.burstOption,
              burstsPerDay === option.value && styles.selectedBurst
            ]}
            onPress={() => handleBurstsChange(option.value)}
          >
            <View style={styles.burstContent}>
              <Text style={[
                styles.burstLabel,
                burstsPerDay === option.value && styles.selectedText
              ]}>
                {option.label}
              </Text>
              <Text style={[
                styles.burstDescription,
                burstsPerDay === option.value && styles.selectedDescription
              ]}>
                {option.description}
              </Text>
            </View>
            {burstsPerDay === option.value && (
              <View style={styles.checkmark}>
                <Text style={styles.checkmarkText}>✓</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Horarios preferidos</Text>
        <Text style={styles.sectionSubtitle}>
          Selecciona la hora exacta para cada sesión
        </Text>
        
        {timeWindows
          .filter(window => activeWindows.includes(window.id))
          .map((window) => (
            <View key={window.id} style={styles.timeWindowContainer}>
              <View style={styles.timeWindowHeader}>
                <Text style={styles.timeWindowIcon}>{window.icon}</Text>
                <Text style={styles.timeWindowName}>{window.name}</Text>
              </View>
              
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.timeSlotScroll}
              >
                {timeSlots.map((time) => (
                  <TouchableOpacity
                    key={time}
                    style={[
                      styles.timeSlot,
                      windowTimes[window.id] === time && styles.selectedTimeSlot
                    ]}
                    onPress={() => handleTimeChange(window.id, time)}
                  >
                    <Text style={[
                      styles.timeSlotText,
                      windowTimes[window.id] === time && styles.selectedTimeText
                    ]}>
                      {time}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          ))}
      </View>

      <View style={styles.previewContainer}>
        <Text style={styles.previewTitle}>Tu horario de estudio:</Text>
        <View style={styles.previewCard}>
          <Text style={styles.previewSessions}>
            {burstsPerDay} sesión{burstsPerDay > 1 ? 'es' : ''} al día
          </Text>
          <Text style={styles.previewWords}>
            ~{wordsPerBurst} palabras por sesión
          </Text>
          <View style={styles.previewTimes}>
            {activeWindows.map((window) => {
              const windowInfo = timeWindows.find(w => w.id === window)
              const time = windowTimes[window]
              return (
                <View key={window} style={styles.previewTime}>
                  <Text style={styles.previewTimeIcon}>{windowInfo?.icon}</Text>
                  <Text style={styles.previewTimeText}>
                    {windowInfo?.name}: {time}
                  </Text>
                </View>
              )
            })}
          </View>
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
    </ScrollView>
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
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  burstOption: {
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e9ecef',
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#f8f9fa',
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedBurst: {
    borderColor: '#667eea',
    backgroundColor: '#f0f2ff',
  },
  burstContent: {
    flex: 1,
  },
  burstLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  burstDescription: {
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
  timeWindowContainer: {
    marginBottom: 24,
  },
  timeWindowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  timeWindowIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  timeWindowName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  timeSlotScroll: {
    flexDirection: 'row',
  },
  timeSlot: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f8f9fa',
    marginRight: 8,
  },
  selectedTimeSlot: {
    borderColor: '#667eea',
    backgroundColor: '#667eea',
  },
  timeSlotText: {
    fontSize: 14,
    color: '#333',
  },
  selectedTimeText: {
    color: '#fff',
    fontWeight: '600',
  },
  previewContainer: {
    marginBottom: 32,
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
    alignItems: 'center',
  },
  previewSessions: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  previewWords: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  previewTimes: {
    alignItems: 'center',
  },
  previewTime: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  previewTimeIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  previewTimeText: {
    fontSize: 14,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 20,
  },
})

export default StepBurstsAndTimes