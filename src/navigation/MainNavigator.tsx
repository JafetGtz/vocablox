// src/navigation/MainNavigator.tsx
import React from 'react'
import { useAppSelector } from '@/store/hooks'
import { RootState } from '@/store/store'
import AuthStackNavigator from './AuthStackNavigator'
import AppStackNavigator from './AppStackNavigator'
import WizardStackNavigator from './WizardStackNavigator'

export default function MainNavigator() {
    const user = useAppSelector((s: RootState) => s.auth.user)
    const { wizard } = useAppSelector((s: RootState) => s.settings)
    
    // If user is not logged in, show auth flow
    if (!user) {
        return <AuthStackNavigator />
    }
    
    // If user is logged in but hasn't completed wizard, show wizard
    if (!wizard.isCompleted) {
        return <WizardStackNavigator />
    }
    
    // If user is logged in and wizard is completed, show main app
    return <AppStackNavigator />
}
