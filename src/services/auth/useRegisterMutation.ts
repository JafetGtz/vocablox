import {useMutation} from '@tanstack/react-query'
import {supabase} from '@/services/supebase'

type RegisterPayload = {
  email: string
  password: string
  fullName: string
}

export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: async ({email, password, fullName}: RegisterPayload) => {
      const {data, error} = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            fullName
          }
        }
      })

      if (error) {
        throw new Error(error.message)
      }

      return data
    }
  })
}
