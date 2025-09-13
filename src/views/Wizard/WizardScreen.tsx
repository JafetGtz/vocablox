import React from 'react'
import { View, StyleSheet } from 'react-native'
import { useWizardViewModel } from '@/viewmodels/useWizardViewModel'

// Import step components
import StepWelcome from './steps/StepWelcome'
import StepBackground from './steps/StepBackground'
import StepNameMotivation from './steps/StepNameMotivation'
import StepCategories from './steps/StepCategories'
import StepWeeklyTarget from './steps/StepWeeklyTarget'
import StepBurstsAndTimes from './steps/StepBurstsAndTimes'
import StepStreakGoal from './steps/StepStreakGoal'
import StepSummary from './steps/StepSummary'

const WizardScreen: React.FC = () => {
  const { wizard } = useWizardViewModel()

  const renderCurrentStep = () => {
    switch (wizard.currentStep) {
      case 0:
        return <StepWelcome />
      case 1:
        return <StepBackground />
      case 2:
        return <StepNameMotivation />
      case 3:
        return <StepCategories />
      case 4:
        return <StepWeeklyTarget />
      case 5:
        return <StepBurstsAndTimes />
      case 6:
        return <StepStreakGoal />
      case 7:
        return <StepSummary />
      default:
        return <StepWelcome />
    }
  }

  return (
    <View style={styles.container}>
      {renderCurrentStep()}
      
      {/* Progress indicator */}
    
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  progressContainer: {
    position: 'absolute',
    top: 60,
    left: 24,
    right: 24,
    zIndex: 1,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e9ecef',
    borderRadius: 2,
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#667eea',
    borderRadius: 2,
  },
  stepDots: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e9ecef',
  },
  stepDotActive: {
    backgroundColor: '#667eea',
  },
})

export default WizardScreen