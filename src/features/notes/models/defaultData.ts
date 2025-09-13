import { Collection } from './types'

export const defaultCollections: Collection[] = [
  {
    id: 'default-1',
    name: 'Favoritos',
    color: '#FF6B6B',
    emoji: '❤️',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'default-2',
    name: 'Trabajo',
    color: '#4ECDC4',
    emoji: '💼',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'default-3',
    name: 'Estudio',
    color: '#45B7D1',
    emoji: '📚',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]