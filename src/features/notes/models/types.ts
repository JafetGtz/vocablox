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

// Rich text formatting types
export interface TextStyle {
  bold?: boolean
  italic?: boolean
  underline?: boolean
  color?: string
  fontSize?: number
  heading?: 'h1' | 'h2' | 'h3'
}

export interface RichTextSegment {
  text: string
  style?: TextStyle
}

// Personal notes (user's custom notes for words)
export interface PersonalNote {
  id: string
  word: string // The word this note is associated with
  title: string
  content: string // Plain text content (for backward compatibility and search)
  richContent?: RichTextSegment[] // Rich text content with formatting
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
  richContent?: RichTextSegment[]
}

export interface PersonalNotesState {
  personalNotes: PersonalNote[]
  loading: boolean
  error: string | null
}