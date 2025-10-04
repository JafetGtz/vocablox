import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { supabase } from '@/services/supebase'
import { useLoginMutation } from '@/services/auth/useLoginMutation'
import { useRegisterMutation } from '@/services/auth/useRegisterMutation'
import { RootState } from '@/store/store'

export const useAuth = () => {
  const user = useSelector((state: RootState) => state.auth.user)
  const initialized = useSelector((state: RootState) => state.auth.initialized)
  return { user, initialized }
}

export const useAuthViewModel = () => {
  const loginMutation = useLoginMutation()
  const registerMutation = useRegisterMutation()

  const handleLogin = useCallback(
    async (email: string, password: string) => {
      const data = await loginMutation.mutateAsync({ email, password })
      // No need to manually set user here - AuthListener will handle it automatically
      // when the auth state changes
      console.log('Login successful, AuthListener will handle user state')
    },
    [loginMutation]
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

      // AuthListener will handle user state automatically
      // Registration might require email confirmation
      console.log('Registration completed, check email if confirmation required')
    },
    [registerMutation]
  )


  return {
    handleLogin,
    handleGoogle,
    handleFacebook,
    handleRegister,
    isLoading: loginMutation.isLoading || registerMutation.isLoading,
  }
}
