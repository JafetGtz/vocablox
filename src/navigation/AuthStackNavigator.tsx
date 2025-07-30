import React from 'react'
import {createNativeStackNavigator} from '@react-navigation/native-stack'

import WelcomeSliderScreen from '../views/Auth/WelcomeSlide';
import AuthLandingScreen from '../views/Auth/AuthLandingScreen'
import LoginScreen from '../views/Auth/LoginScreen'
import RegisterScreen from '../views/Auth/RegisterScreen'

export type AuthStackParamList = {
  WelcomeSlider: undefined
  AuthLanding: undefined
  Login: undefined
  Register: undefined
}

const Stack = createNativeStackNavigator<AuthStackParamList>()

const AuthStackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="WelcomeSlider"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="WelcomeSlider" component={WelcomeSliderScreen} />
      <Stack.Screen name="AuthLanding" component={AuthLandingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  )
}

export default AuthStackNavigator
