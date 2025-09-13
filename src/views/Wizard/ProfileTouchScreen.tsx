// src/views/Wizard/ProfileTouchScreen.tsx
import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native'
import { useWizardViewModel } from '@/viewmodels/useWizardViewModel'
import WizardButton from '@/components/WizardButton'

const ProfileTouchScreen: React.FC = () => {
  const { data, navigation, actions } = useWizardViewModel()
  
  const [nickname, setNickname] = useState(data.nickname || '')
  const [motivational, setMotivational] = useState(data.motivational || '')

  const motivationalSuggestions = [
    "¡Cada palabra me acerca a mis objetivos!",
    "Aprender es mi superpoder",
    "Hoy es un buen día para crecer",
    "Mi vocabulario es mi tesoro",
    "Paso a paso, palabra a palabra",
    "La constancia construye el éxito",
    "Siempre hay algo nuevo que descubrir"
  ]

  const handleContinue = () => {
    actions.setProfile({
      nickname: nickname.trim() || undefined,
      motivational: motivational.trim() || undefined,
    })
    actions.nextStep()
  }

  const handleSuggestionSelect = (suggestion: string) => {
    setMotivational(suggestion)
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Toque personal</Text>
        <Text style={styles.subtitle}>
          Personaliza tu experiencia (opcional)
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>¿Cómo te gusta que te llamen?</Text>
          <Text style={styles.sectionSubtitle}>
            Usaremos este nombre en tus notificaciones y mensajes
          </Text>
          <TextInput
            style={styles.textInput}
            placeholder="Ej: Alex, María, Dr. Smith..."
            value={nickname}
            onChangeText={setNickname}
            maxLength={20}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frase motivacional</Text>
          <Text style={styles.sectionSubtitle}>
            Te la mostraremos cuando necesites un impulso extra
          </Text>
          <TextInput
            style={[styles.textInput, styles.multilineInput]}
            placeholder="Escribe tu frase motivacional..."
            value={motivational}
            onChangeText={setMotivational}
            multiline
            maxLength={100}
          />
          
          <Text style={styles.suggestionsTitle}>Sugerencias:</Text>
          <View style={styles.suggestionsContainer}>
            {motivationalSuggestions.map((suggestion, index) => (
              <Text
                key={index}
                style={styles.suggestion}
                onPress={() => handleSuggestionSelect(suggestion)}
              >
                "{suggestion}"
              </Text>
            ))}
          </View>
        </View>

        <View style={styles.timeZoneSection}>
          <Text style={styles.sectionTitle}>Zona horaria</Text>
          <Text style={styles.timeZoneInfo}>
            Detectamos automáticamente: {data.timezone}
          </Text>
          <Text style={styles.timeZoneSubtext}>
            Esto nos ayuda a enviarte recordatorios en el momento adecuado
          </Text>
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
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 18,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  suggestionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 12,
  },
  suggestionsContainer: {
    gap: 8,
  },
  suggestion: {
    fontSize: 14,
    color: '#667eea',
    fontStyle: 'italic',
    padding: 12,
    backgroundColor: '#f0f2ff',
    borderRadius: 8,
    lineHeight: 18,
  },
  timeZoneSection: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  timeZoneInfo: {
    fontSize: 16,
    fontWeight: '600',
    color: '#667eea',
    marginBottom: 8,
  },
  timeZoneSubtext: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 20,
    gap: 12,
  },
})

export default ProfileTouchScreen