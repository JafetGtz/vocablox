import {useDispatch} from 'react-redux'
import {useLoginMutation} from '@/services/auth/useLoginMutation'
import {useRegisterMutation} from '@/services/auth/useRegisterMutation'
import {setUser} from '@/store/slices/authSlice'

export const useAuthViewModel = () => {
  const dispatch = useDispatch()

  const loginMutation = useLoginMutation()
  const registerMutation = useRegisterMutation()

  const handleLogin = async (email: string, password: string) => {
    try {
      const {user} = await loginMutation.mutateAsync({email, password})
      if (user) dispatch(setUser(user))
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const handleGoogle = () => { }
  const handleFacebook = () => {}

  const handleRegister = async (
    email: string,
    password: string,
    fullName: string
  ) => {
    try {
      const {user} = await registerMutation.mutateAsync({
        email,
        password,
        fullName
      })
      if (user) dispatch(setUser(user))
    } catch (error) {
      console.error('Register error:', error)
      throw error
    }
  }

  return {
    handleGoogle,
    handleFacebook,
    handleLogin,
    handleRegister,
    isLoading: loginMutation.isPending || registerMutation.isPending
  }
}
