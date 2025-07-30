// src/views/Auth/LoginScreen.tsx
import React, { useState } from 'react'
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from 'react-native'

import { useNavigation } from '@react-navigation/native'
import { useAuthViewModel } from '@/viewmodels/useAuthViewModel'

const { width } = Dimensions.get('window')

const LoginScreen = () => {
  const navigation = useNavigation()
  const { handleLogin, handleGoogle, handleFacebook, isLoading } =
    useAuthViewModel()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const onLogin = async () => {
    try {
      await handleLogin(email.trim(), password)
    } catch { }
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}></Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.link}>Registrate</Text>
        </TouchableOpacity>
      </View>

      {/* Form */}
      <View style={styles.form}>
        <Text style={styles.label}>Tu correo</Text>
        <TextInput
          style={styles.input}
          placeholder="hello@gmail.com"
          placeholderTextColor="#999"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <View style={styles.passwordRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Constraseña</Text>
            <TextInput
              style={styles.input}
              placeholder="********"
              placeholderTextColor="#999"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>
          <TouchableOpacity
            style={{marginTop: 3}}
            onPress={() => navigation.navigate('ForgotPassword')}
          >
            <Text style={styles.forgot}>Olvidé mi contraseña</Text>
          </TouchableOpacity>
        </View>

        {/* Login Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={onLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.buttonText}>Entrar</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Social Login */}
      <View style={styles.socialContainer}>
        <Text style={styles.socialText}>O regístrate con una cuenta social</Text>
        <View style={styles.socialRow}>
          <TouchableOpacity
            style={styles.socialButton}
            onPress={handleFacebook}
          >
            
            <Text style={styles.socialLabel}>Facebook</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.socialButton}
            onPress={handleGoogle}
          >
            
            <Text style={styles.socialLabel}>Google</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default LoginScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  title: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 28,
    color: 'white',
  },
  link: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 16,
    color: 'white',
  },
  form: {
    marginTop: 32,
  },
  label: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: 'white',
    marginBottom: 4,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: 'white',
    paddingVertical: 8,
    fontFamily: 'Poppins_400Regular',
    fontSize: 16,
    color: 'white',
    marginBottom: 24,
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 32,
  },
  forgot: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: 'white',
    marginLeft: 12,
    marginBottom: 8,
  },
  button: {
    backgroundColor: 'white',
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,

    /* Sombra iOS */
    shadowColor: 'gray',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    /* Sombra Android */
    elevation: 3,
  },

  buttonText: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 18,
    color: 'black',
  },
  socialContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  socialText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: 'white',
    marginBottom: 16,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: width * 0.8,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  socialLabel: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 16,
    color: 'white',
    marginLeft: 8,
  },
})
