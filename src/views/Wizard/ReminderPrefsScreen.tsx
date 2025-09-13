// src/views/Wizard/ReminderPrefsScreen.tsx
import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { CheckBox } from '@rneui/themed'
import { useWizardViewModel } from '@/viewmodels/useWizardViewModel'
import WizardButton from '@/components/WizardButton'

const ReminderPrefsScreen: React.FC = () => {
  const { data, navigation, actions } = useWizardViewModel()
  
  const [selectedDays, setSelectedDays] = useState(data.reminder_days || [])
  const [selectedWindows, setSelectedWindows] = useState({
    morning: true,
    afternoon: false,
    evening: false
  })

  const daysOfWeek = [
    { id: 'monday', name: 'Lunes', short: 'L' },
    { id: 'tuesday', name: 'Martes', short: 'M' },
    { id: 'wednesday', name: 'Miércoles', short: 'X' },
    { id: 'thursday', name: 'Jueves', short: 'J' },
    { id: 'friday', name: 'Viernes', short: 'V' },
    { id: 'saturday', name: 'Sábado', short: 'S' },
    { id: 'sunday', name: 'Domingo', short: 'D' },
  ]

  const timeWindows = [
    { id: 'morning', name: 'Mañana', time: '8:00 - 12:00', icon: '🌅' },
    { id: 'afternoon', name: 'Tarde', time: '12:00 - 18:00', icon: '☀️' },
    { id: 'evening', name: 'Noche', time: '18:00 - 22:00', icon: '🌙' },
  ]

  const handleDayToggle = (dayId: string) => {
    const newDays = selectedDays.includes(dayId)
      ? selectedDays.filter(d => d !== dayId)
      : [...selectedDays, dayId]
    setSelectedDays(newDays)
  }

  const handleQuickSelect = (type: 'weekdays' | 'weekends' | 'all') => {
    switch (type) {
      case 'weekdays':
        setSelectedDays(['monday', 'tuesday', 'wednesday', 'thursday', 'friday'])
        break
      case 'weekends':
        setSelectedDays(['saturday', 'sunday'])
        break
      case 'all':
        setSelectedDays(daysOfWeek.map(d => d.id))
        break
    }
  }

  const handleWindowToggle = (windowId: string) => {
    setSelectedWindows(prev => ({
      ...prev,
      [windowId]: !prev[windowId as keyof typeof prev]
    }))
  }

  const handleContinue = () => {
    actions.setReminderDays(selectedDays)
    
    const windows: any = {}
    if (selectedWindows.morning) windows.morning = '08:00'
    if (selectedWindows.afternoon) windows.afternoon = '14:00'
    if (selectedWindows.evening) windows.evening = '20:00'
    
    actions.setReminderWindows(windows)
    actions.nextStep()
  }

  const canContinue = selectedDays.length > 0 && Object.values(selectedWindows).some(Boolean)

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Configura recordatorios</Text>
        <Text style={styles.subtitle}>
          Te ayudaremos a mantener tu rutina de estudio
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Días de la semana</Text>
          
          <View style={styles.quickButtons}>
            <TouchableOpacity
              style={styles.quickButton}
              onPress={() => handleQuickSelect('weekdays')}
            >
              <Text style={styles.quickButtonText}>L-V</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickButton}
              onPress={() => handleQuickSelect('weekends')}
            >
              <Text style={styles.quickButtonText}>Fines</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickButton}
              onPress={() => handleQuickSelect('all')}
            >
              <Text style={styles.quickButtonText}>Todos</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.daysContainer}>
            {daysOfWeek.map((day) => (
              <TouchableOpacity
                key={day.id}
                style={[
                  styles.dayButton,
                  selectedDays.includes(day.id) && styles.selectedDay
                ]}
                onPress={() => handleDayToggle(day.id)}
              >
                <Text style={[
                  styles.dayText,
                  selectedDays.includes(day.id) && styles.selectedDayText
                ]}>
                  {day.short}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Horarios preferidos</Text>
          {timeWindows.map((window) => (
            <CheckBox
              key={window.id}
              title={
                <View style={styles.windowContent}>
                  <Text style={styles.windowIcon}>{window.icon}</Text>
                  <View>
                    <Text style={styles.windowName}>{window.name}</Text>
                    <Text style={styles.windowTime}>{window.time}</Text>
                  </View>
                </View>
              }
              checked={selectedWindows[window.id as keyof typeof selectedWindows]}
              onPress={() => handleWindowToggle(window.id)}
              containerStyle={styles.checkboxContainer}
              checkedColor="#667eea"
            />
          ))}
        </View>

        {selectedDays.length > 0 && Object.values(selectedWindows).some(Boolean) && (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Resumen</Text>
            <Text style={styles.summaryText}>
              📅 {selectedDays.length} día{selectedDays.length > 1 ? 's' : ''} por semana
            </Text>
            <Text style={styles.summaryText}>
              ⏰ {Object.values(selectedWindows).filter(Boolean).length} horario{Object.values(selectedWindows).filter(Boolean).length > 1 ? 's' : ''} al día
            </Text>
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
          onPress={handleContinue}
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
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  quickButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  quickButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: '#f0f2ff',
    borderRadius: 20,
  },
  quickButtonText: {
    color: '#667eea',
    fontWeight: '600',
    fontSize: 14,
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedDay: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
  },
  dayText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  selectedDayText: {
    color: '#fff',
  },
  checkboxContainer: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    padding: 0,
    marginVertical: 8,
  },
  windowContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  windowIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  windowName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  windowTime: {
    fontSize: 14,
    color: '#666',
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

export default ReminderPrefsScreen