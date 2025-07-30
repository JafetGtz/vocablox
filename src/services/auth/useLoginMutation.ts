import {useMutation} from '@tanstack/react-query'
import {supabase} from '@/services/supebase'

type LoginPayload = {
  email: string
  password: string
}

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: async ({email, password}: LoginPayload) => {
      const {data, error} = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        throw new Error(error.message)
      }

      return data
    }
  })
}
