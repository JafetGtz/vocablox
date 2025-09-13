// src/navigation/RootNavigator.tsx
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import SplashScreen from '@/views/Auth/SplashScreen'
import MainNavigator from './MainNavigator'
import SettingsInitializer from '@/components/SettingsInitializer'

const Stack = createNativeStackNavigator()

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <SettingsInitializer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {/* 1) Siempre primero SplashScreen */}
          <Stack.Screen name="Splash" component={SplashScreen} />
          {/* 2) Luego el MainNavigator (Auth o App) */}
          <Stack.Screen name="Main" component={MainNavigator} />
        </Stack.Navigator>
      </SettingsInitializer>
    </NavigationContainer>
  )
}
