// src/components/SettingsInitializer.tsx
import React, { useEffect } from 'react'
import { useSettingsViewModel } from '@/viewmodels/useSettingsViewModel'
import { useAppSelector } from '@/store/hooks'

interface SettingsInitializerProps {
  children: React.ReactNode
}

const SettingsInitializer: React.FC<SettingsInitializerProps> = ({ children }) => {
  const user = useAppSelector((s) => s.auth.user)
  const wizard = useAppSelector((s) => s.settings.wizard)
  const { load } = useSettingsViewModel()

  useEffect(() => {
    // Only load settings automatically if the wizard is already completed
    // For new users, the wizard will handle the initial setup
    if (user && wizard.isCompleted) {
      load()
    }
  }, [user, wizard.isCompleted, load])

  return <>{children}</>
}

export default SettingsInitializer