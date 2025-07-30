import React, {useState} from 'react'
import {View, TextInput, Button, Alert} from 'react-native'
import {useAuthViewModel} from '@/viewmodels/useAuthViewModel'

const RegisterScreen = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const {handleRegister} = useAuthViewModel()

  const _handleRegister = () => {
    handleRegister(email, password, fullName)
  }

  return (
    <View style={{padding: 20}}>
      <TextInput
        placeholder="Nombre completo"
        value={fullName}
        onChangeText={setFullName}
      />
      <TextInput placeholder="Correo" value={email} onChangeText={setEmail} />
      <TextInput
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Registrarse" onPress={_handleRegister} />
    </View>
  )
}

export default RegisterScreen
