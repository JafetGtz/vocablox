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
  { id: 'gradient1', name: 'Azul Océano', type: 'color', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', preview: '#667eea' },
  { id: 'gradient2', name: 'Atardecer', type: 'color', value: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', preview: '#f093fb' },
  { id: 'gradient3', name: 'Bosque', type: 'color', value: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', preview: '#4facfe' },
  { id: 'gradient4', name: 'Primavera', type: 'color', value: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', preview: '#43e97b' },
  { id: 'gradient5', name: 'Noche', type: 'color', value: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', preview: '#fa709a' },
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