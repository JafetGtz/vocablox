import React from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'
import { useWizardViewModel } from '@/viewmodels/useWizardViewModel'
import WizardButton from '@/components/WizardButton'

const StepWelcome: React.FC = () => {
  const { actions } = useWizardViewModel()

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>¡Bienvenido a Vocablox!</Text>
          <Text style={styles.subtitle}>
            Tu asistente personal para aprender vocabulario de forma inteligente
          </Text>
        </View>

        <View style={styles.benefitsContainer}>
          <Text style={styles.benefitsTitle}>¿Qué puedes lograr?</Text>
          
          <View style={styles.benefit}>
            <Text style={styles.benefitIcon}>🧠</Text>
            <Text style={styles.benefitText}>Aprende vocabulario especializado en tu área</Text>
          </View>
          
          <View style={styles.benefit}>
            <Text style={styles.benefitIcon}>🎯</Text>
            <Text style={styles.benefitText}>Establece metas personalizadas y alcanzables</Text>
          </View>
          
          <View style={styles.benefit}>
            <Text style={styles.benefitIcon}>⚡</Text>
            <Text style={styles.benefitText}>Sesiones rápidas adaptadas a tu horario</Text>
          </View>
          
          <View style={styles.benefit}>
            <Text style={styles.benefitIcon}>📈</Text>
            <Text style={styles.benefitText}>Progreso medible con rachas de estudio</Text>
          </View>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <WizardButton
          title="Comenzar"
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
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  benefitsContainer: {
    paddingHorizontal: 8,
  },
  benefitsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 24,
    textAlign: 'center',
  },
  benefit: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  benefitIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  benefitText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    lineHeight: 24,
  },
  buttonContainer: {
    paddingTop: 20,
  },
})

export default StepWelcome