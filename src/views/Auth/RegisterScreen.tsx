// src/views/Auth/RegisterScreen.tsx
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
import Icon from 'react-native-vector-icons/Ionicons'
import { useAuthViewModel } from '@/viewmodels/useAuthViewModel'

const { width } = Dimensions.get('window')

const RegisterScreen = () => {
  const navigation = useNavigation()
  const { handleRegister, isLoading } = useAuthViewModel()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)

  const onRegisterPress = async () => {
    try {
      await handleRegister(email.trim(), password, fullName.trim())
    } catch (err: any) {
      alert(err.message)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header con back */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Regístrate</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Formulario */}
      <View style={styles.form}>
        {/* Nombre completo */}
        <View style={styles.inputWrapper}>
          <Icon name="person-outline" size={20} color="#999" />
          <TextInput
            style={styles.inputField}
            placeholder="Nombre completo"
            placeholderTextColor="#999"
            value={fullName}
            onChangeText={setFullName}
          />
        </View>

        {/* Correo */}
        <View style={styles.inputWrapper}>
          <Icon name="mail-outline" size={20} color="#999" />
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

        {/* Contraseña */}
        <View style={styles.inputWrapper}>
          <Icon name="lock-closed-outline" size={20} color="#999" />
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

        {/* Botón Registrarse */}
        <TouchableOpacity
          style={styles.button}
          onPress={onRegisterPress}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.buttonText}>Registrarse</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default RegisterScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  backButton: {
    width: 24,
    alignItems: 'flex-start',
  },
  title: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 28,
    color: 'white',
  },
  form: {
    marginTop: 32,
  },
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
})
