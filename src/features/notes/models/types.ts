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

// Personal notes (user's custom notes for words)
export interface PersonalNote {
  id: string
  word: string // The word this note is associated with
  title: string
  content: string
  createdAt: string
  updatedAt: string
  userId?: string // For future Supabase integration
}

export interface CreatePersonalNotePayload {
  word: string
  title: string
  content: string
}

export interface UpdatePersonalNotePayload {
  id: string
  title?: string
  content?: string
}

export interface PersonalNotesState {
  personalNotes: PersonalNote[]
  loading: boolean
  error: string | null
}