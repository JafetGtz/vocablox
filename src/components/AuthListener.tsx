// src/components/AuthListener.tsx
import { useEffect } from 'react'
import { useAppDispatch } from '@/store/hooks';
import { setUser, clearUser } from '@/store/slices/authSlice';
import { supabase } from '@/services/supebase';

export default function AuthListener() {
    const dispatch = useAppDispatch()

    useEffect(() => {
        
        supabase.auth.getSession().then(({ data, error }) => {
            if (error) console.error(error)
            if (data.session) dispatch(setUser(data.session.user))
            else dispatch(clearUser())
        })

        const { data: authListener  } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                if (session) dispatch(setUser(session.user))
                else dispatch(clearUser())
            }
        )

        return () => {
              authListener.subscription.unsubscribe()
        }
    }, [dispatch])

    return null  
}
