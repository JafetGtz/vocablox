import React, { useState } from 'react'
import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import { useWizardViewModel } from '@/viewmodels/useWizardViewModel'
import WizardButton from '@/components/WizardButton'

const StepNameMotivation: React.FC = () => {
  const { data, actions } = useWizardViewModel()
  const [nickname, setNickname] = useState(data.nickname || '')
  const [motivational, setMotivational] = useState(data.motivational || '')

  const handleContinue = () => {
    actions.setProfile({ 
      nickname: nickname.trim(), 
      motivational: motivational.trim() 
    })
    actions.nextStep()
  }

  const isValid = nickname.trim().length >= 2 && motivational.trim().length >= 5

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>¡Personalicemos tu experiencia!</Text>
          <Text style={styles.subtitle}>
            Cuéntanos un poco sobre ti para hacer el aprendizaje más personal
          </Text>
        </View>

        <View style={styles.content}>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>¿Cómo te gusta que te llamen?</Text>
            <Text style={styles.hint}>Tu nombre o pseudónimo favorito</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: Alex, María, Dr. Smith..."
              value={nickname}
              onChangeText={setNickname}
              maxLength={30}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Tu frase motivacional</Text>
            <Text style={styles.hint}>
              Una frase que te inspire a seguir aprendiendo cada día
            </Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder="Ej: 'Cada palabra nueva es una puerta a nuevas oportunidades'"
              value={motivational}
              onChangeText={setMotivational}
              maxLength={120}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
            <Text style={styles.charCounter}>{motivational.length}/120</Text>
          </View>

          <View style={styles.previewContainer}>
            <Text style={styles.previewLabel}>Vista previa:</Text>
            <View style={styles.previewCard}>
              <Text style={styles.previewGreeting}>
                ¡Hola, {nickname || '[Tu nombre]'}! 👋
              </Text>
              <Text style={styles.previewMotivation}>
                "{motivational || '[Tu frase motivacional]'}"
              </Text>
            </View>
          </View>
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
          disabled={!isValid}
          variant="primary"
        />
      </View>
    </KeyboardAvoidingView>
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
  fieldContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  hint: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
  },
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  charCounter: {
    textAlign: 'right',
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  previewContainer: {
    marginTop: 16,
  },
  previewLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  previewCard: {
    backgroundColor: '#f0f2ff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#667eea',
  },
  previewGreeting: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  previewMotivation: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 20,
    gap: 12,
  },
})

export default StepNameMotivation