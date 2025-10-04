// src/components/AuthListener.tsx
import { useEffect } from 'react'
import { useAppDispatch } from '@/store/hooks';
import { setUser, clearUser } from '@/store/slices/authSlice';
import { clearSettings } from '@/store/slices/settingsSlice';
import { supabase } from '@/services/supebase';
import * as settingsService from '@/services/auth/settingsServices';
import { loadStart, loadSuccess, loadFailure } from '@/store/slices/settingsSlice';

export default function AuthListener() {
    const dispatch = useAppDispatch()

    // Function to load user settings after login
    const loadUserSettings = async (userId: string) => {
        try {
            console.log('AuthListener: Loading user settings for:', userId)
            dispatch(loadStart())
            const settings = await settingsService.fetchSettings(userId)
            console.log('AuthListener: Loaded settings:', settings)
            dispatch(loadSuccess(settings))
        } catch (error: any) {
            console.log('AuthListener: No settings found for user, will show wizard:', error.message)
            // If settings don't exist (new user), that's okay - wizard will handle it
            if (error.message.includes('No rows') || error.message.includes('not found')) {
                dispatch(loadFailure('New user - no settings found'))
            } else {
                dispatch(loadFailure(error.message))
            }
        }
    }

    useEffect(() => {

        supabase.auth.getSession().then(({ data, error }) => {
            if (error) console.error(error)
            if (data.session) {
                dispatch(setUser(data.session.user))
                loadUserSettings(data.session.user.id)
            } else {
                dispatch(clearUser())
                dispatch(clearSettings())
            }
        })

        const { data: authListener  } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                if (session) {
                    dispatch(setUser(session.user))
                    loadUserSettings(session.user.id)
                } else {
                    dispatch(clearUser())
                    dispatch(clearSettings())
                }
            }
        )

        return () => {
              authListener.subscription.unsubscribe()
        }
    }, [dispatch])

    return null
}
