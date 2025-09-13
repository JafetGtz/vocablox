// src/navigation/WizardStackNavigator.tsx
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

// New unified wizard screen
import WizardScreen from '@/views/Wizard/WizardScreen'

export type WizardStackParamList = {
  Wizard: undefined
}

const Stack = createNativeStackNavigator<WizardStackParamList>()

const WizardStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
       
      }}
    >
      <Stack.Screen name="Wizard" component={WizardScreen} />
    </Stack.Navigator>
  )
}

export default WizardStackNavigator