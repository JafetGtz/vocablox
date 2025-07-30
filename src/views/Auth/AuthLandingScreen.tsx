import React from 'react'
import {View, Text, TouchableOpacity} from 'react-native'
import {useNavigation} from '@react-navigation/native'

const AuthLandingScreen = () => {
  const navigation = useNavigation()

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text style={{fontSize: 22, marginBottom: 40}}>
        Bienvenido a Vocablox
      </Text>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={{fontSize: 18, marginBottom: 20}}>Iniciar sesión</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={{fontSize: 18}}>Registrarse</Text>
      </TouchableOpacity>
    </View>
  )
}

export default AuthLandingScreen
