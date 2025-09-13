import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { supabase } from '@/services/supebase'
import { useLoginMutation } from '@/services/auth/useLoginMutation'
import { useRegisterMutation } from '@/services/auth/useRegisterMutation'
import { setUser } from '@/store/slices/authSlice'
import { RootState } from '@/store/store'

export const useAuth = () => {
  const user = useSelector((state: RootState) => state.auth.user)
  const initialized = useSelector((state: RootState) => state.auth.initialized)
  return { user, initialized }
}

export const useAuthViewModel = () => {
  const dispatch = useDispatch()
  const loginMutation = useLoginMutation()
  const registerMutation = useRegisterMutation()

  const handleLogin = useCallback(
    async (email: string, password: string) => {
      const { data, error } = await loginMutation.mutateAsync({ email, password })
      if (error) throw error
      if (data.user) dispatch(setUser(data.user))
    },
    [dispatch, loginMutation]
  )

  const handleGoogle = useCallback(async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' })
    if (error) throw error
  }, [])

  const handleFacebook = useCallback(async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'facebook' })
    if (error) throw error
  }, [])


  const handleRegister = useCallback(
    async (email: string, password: string, fullName: string) => {
      const registerData = await registerMutation.mutateAsync({
        email,
        password,
        fullName,
      })
     
      if (registerData.user) {
        dispatch(setUser(registerData.user))
      } else {
        console.warn('Registro completado: revisa tu correo para confirmar la cuenta')
      }
    },
    [dispatch, registerMutation]
  )


  return {
    handleLogin,
    handleGoogle,
    handleFacebook,
    handleRegister,
    isLoading: loginMutation.isLoading || registerMutation.isLoading,
  }
}
