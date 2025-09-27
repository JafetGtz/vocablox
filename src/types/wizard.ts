// src/types/wizard.ts

export interface Category {
  id: string
  name: string
  icon: string
  description: string
  enabled: boolean
}

export interface BackgroundOption {
  id: string
  name: string
  type: 'color' | 'image'
  value: string
  preview: string
}

export interface DifficultyLevel {
  id: 'easy' | 'normal' | 'challenging'
  name: string
  description: string
  intervals: number[]
}

export interface ReminderWindow {
  id: string
  name: string
  time: string
  enabled: boolean
}

export type TimeWindowId = 'morning' | 'afternoon' | 'evening'

export type WizardScreens = 
  | 'StepWelcome'
  | 'StepBackground'
  | 'StepNameMotivation'
  | 'StepCategories'
  | 'StepWeeklyTarget'
  | 'StepBurstsAndTimes'
  | 'StepStreakGoal'
  | 'StepSummary'

export interface WizardNavigation {
  currentScreen: WizardScreens
  canGoNext: boolean
  canGoBack: boolean
}

// Default data for wizard
export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'technology', name: 'Tecnología', icon: '💻', description: 'Términos de programación, hardware, software', enabled: false },
  { id: 'business', name: 'Negocios', icon: '💼', description: 'Vocabulario empresarial y financiero', enabled: false },
  { id: 'science', name: 'Ciencia', icon: '🔬', description: 'Términos científicos y médicos', enabled: false },
  { id: 'arts', name: 'Arte y Cultura', icon: '🎨', description: 'Vocabulario artístico y cultural', enabled: false },
  { id: 'sports', name: 'Deportes', icon: '⚽', description: 'Términos deportivos y fitness', enabled: false },
  { id: 'travel', name: 'Viajes', icon: '✈️', description: 'Vocabulario de viajes y geografía', enabled: false },
  { id: 'food', name: 'Comida', icon: '🍽️', description: 'Gastronomía y vocabulario culinario', enabled: false },
  { id: 'medicine', name: 'Medicina', icon: '⚕️', description: 'Terminología médica y salud', enabled: false },
  { id: 'law', name: 'Derecho', icon: '⚖️', description: 'Términos legales y jurídicos', enabled: false },
  { id: 'engineering', name: 'Ingeniería', icon: '🔧', description: 'Vocabulario de ingeniería', enabled: false },
]

export const DEFAULT_BACKGROUNDS: BackgroundOption[] = [
  { id: 'amarillo', name: 'Amarillo', type: 'image', value: require('@/assets/wallpapers/amarillo.png'), preview: require('@/assets/wallpapers/amarillo.png') },
  { id: 'azul', name: 'Azul', type: 'image', value: require('@/assets/wallpapers/azul.png'), preview: require('@/assets/wallpapers/azul.png') },
  { id: 'naranja', name: 'Naranja', type: 'image', value: require('@/assets/wallpapers/naranja.png'), preview: require('@/assets/wallpapers/naranja.png') },
  { id: 'negro', name: 'Negro', type: 'image', value: require('@/assets/wallpapers/negro.png'), preview: require('@/assets/wallpapers/negro.png') },
  { id: 'verde', name: 'Verde', type: 'image', value: require('@/assets/wallpapers/verde.png'), preview: require('@/assets/wallpapers/verde.png') },
]

export const DEFAULT_DIFFICULTY_LEVELS: DifficultyLevel[] = [
  {
    id: 'easy',
    name: 'Fácil',
    description: 'Repaso frecuente, ideal para principiantes',
    intervals: [1, 2, 4, 8, 16]
  },
  {
    id: 'normal',
    name: 'Normal',
    description: 'Balance perfecto entre reto y retención',
    intervals: [1, 3, 7, 15, 30]
  },
  {
    id: 'challenging',
    name: 'Desafiante',
    description: 'Intervalos más largos, para usuarios avanzados',
    intervals: [1, 4, 10, 25, 60]
  }
]