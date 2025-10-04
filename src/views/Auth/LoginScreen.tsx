// src/views/Auth/LoginScreen.tsx
import React, { useState, useEffect, useRef } from 'react'
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Keyboard,
  Platform,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import * as Animatable from 'react-native-animatable'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { useAuthViewModel } from '@/viewmodels/useAuthViewModel'
import LoginAnimation from '@/components/LoginAnimation'

const { width } = Dimensions.get('window')
const VISIBLE_TIME = 3000
const SLIDE_DURATION = 1000

const LoginScreen = () => {
  const navigation = useNavigation()
  const { handleLogin, handleGoogle, handleFacebook, isLoading } =
    useAuthViewModel()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [keyboardVisible, setKeyboardVisible] = useState(false)
  const [error, setError] = useState('')

  const rightRef = useRef<Animatable.View>(null)

  // Ocultar animación cuando aparece el teclado
  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => setKeyboardVisible(true)
    )
    const hideSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setKeyboardVisible(false)
    )
    return () => {
      showSub.remove()
      hideSub.remove()
    }
  }, [])

  // Ciclo simple de animación (solo derecha aquí para brevedad)
  useEffect(() => {
    let timeout = setTimeout(() => {
      rightRef.current?.animate(
        { from: { translateX: 0 }, to: { translateX: width + 50 } },
        SLIDE_DURATION
      )
    }, VISIBLE_TIME)
    return () => clearTimeout(timeout)
  }, [])

  const onLogin = async () => {
    try {
      setError('')
      await handleLogin(email.trim(), password)
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión')
      console.error('Login error:', err)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title} />
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.link}>Regístrate</Text>
        </TouchableOpacity>
      </View>

      {/* Animación Lottie */}
      {!keyboardVisible && (
        <Animatable.View
          ref={rightRef}
          style={styles.animationRight}
          pointerEvents="none"
        >
          <LoginAnimation />
        </Animatable.View>
      )}

      {/* Formulario */}
      <View style={styles.form}>
        {/* Email Input */}
        <View style={styles.inputWrapper}>
          <Icon name="email-outline" size={20} color="#999" />
          <TextInput
            style={styles.inputField}
            placeholder="Correo electrónico"
            placeholderTextColor="#999"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        {/* Password Input */}
        <View style={styles.inputWrapper}>
          <Icon name="lock-outline" size={20} color="#999" />
          <TextInput
            style={styles.inputField}
            placeholder="Contraseña"
            placeholderTextColor="#999"
            secureTextEntry={!showPass}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPass((v) => !v)}>
            <Icon
              name={showPass ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color="#999"
            />
          </TouchableOpacity>
        </View>

        {/* Error Message */}
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {/* Botón Entrar */}
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
        <Text style={styles.socialText}>
          O regístrate con una cuenta social
        </Text>
        <View style={styles.socialRow}>
          <TouchableOpacity
            style={styles.socialButton}
            onPress={handleFacebook}
          >
            <Icon name="facebook" size={20} color="#1877F2" />
            <Text style={styles.socialLabel}>Facebook</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.socialButton}
            onPress={handleGoogle}
          >
            <Icon name="google" size={20} color="#DB4437" />
            <Text style={styles.socialLabel}>Google</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default LoginScreen

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black', paddingHorizontal: 24 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  title: { fontFamily: 'Poppins_700Bold', fontSize: 28, color: 'white' },
  link: { fontFamily: 'Poppins_400Regular', fontSize: 16, color: 'white' },
  animationRight: {
    position: 'absolute',
    bottom: 24,
    right: 24,
  },
  form: { marginTop: 32 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
    marginBottom: 16,
  },
  inputField: {
    flex: 1,
    marginLeft: 8,
    color: 'white',
    fontFamily: 'Poppins_400Regular',
    fontSize: 16,
  },
  button: {
    backgroundColor: 'white',
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: 'gray',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 18,
    color: 'black',
  },
  errorContainer: {
    backgroundColor: 'rgba(220, 53, 69, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(220, 53, 69, 0.3)',
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
  },
  errorText: {
    color: '#dc3545',
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    textAlign: 'center',
  },
  socialContainer: { alignItems: 'center', marginTop: 40 },
  socialText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: 'white',
    marginBottom: 16,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: width * 0.8,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  socialLabel: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 16,
    color: 'white',
    marginLeft: 8,
  },
})
