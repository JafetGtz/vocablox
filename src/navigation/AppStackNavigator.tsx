// src/navigation/AppStackNavigator.tsx
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import HomeScreen from '@/views/home'

export type AppStackParamList = {
    Home: undefined
}

const Stack = createNativeStackNavigator<AppStackParamList>()

export default function AppStackNavigator() {
    return (
        <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{ headerShown: false }}
        >
            <Stack.Screen name="Home" component={HomeScreen} />
            {/*
        // aquí luego irán más pantallas de tu app
        <Stack.Screen name="Profile" component={ProfileScreen} />
      */}
        </Stack.Navigator>
    )
}
