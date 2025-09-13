export interface Collection {
  id: string
  name: string
  color: string
  emoji: string
  createdAt: string
  updatedAt: string
  userId?: string // For future Supabase integration
}

export interface Note {
  id: string
  palabra: string
  significado: string
  ejemplo?: string
  collectionId: string
  createdAt: string
  updatedAt: string
  userId?: string // For future Supabase integration
  isFavorite?: boolean
  tags?: string[]
}

export interface NotesState {
  notes: Note[]
  collections: Collection[]
  loading: boolean
  error: string | null
}

export interface CreateNotePayload {
  palabra: string
  significado: string
  ejemplo?: string
  collectionId: string
}

export interface UpdateNotePayload {
  id: string
  palabra?: string
  significado?: string
  ejemplo?: string
  collectionId?: string
  isFavorite?: boolean
  tags?: string[]
}

export interface CreateCollectionPayload {
  name: string
  color: string
  emoji: string
}

export interface UpdateCollectionPayload {
  id: string
  name?: string
  color?: string
  emoji?: string
}