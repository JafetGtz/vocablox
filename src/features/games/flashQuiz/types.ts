export type QuizStatus = 'idle' | 'running' | 'paused' | 'finished';

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  id: string;                // e.g. `${wordId}#${rand}`
  wordId: string;            // `${category}::${palabra}`
  word: string;              // "Obsolescencia"
  example?: string;          // opcional
  options: QuizOption[];     // 4 opciones (1 correcta)
  category: string;          // 'technology' | ...
}

export interface UserAnswer {
  questionId: string;
  selectedOptionId: string;
  isCorrect: boolean;
  timeLeft: number;          // segundos restantes al responder
}

export interface FlashQuizState {
  status: QuizStatus;
  categorySeed?: string;     // para modo diario
  questions: QuizQuestion[];
  currentIndex: number;
  perQuestionSeconds: number;
  timeLeft: number;
  answers: Record<string, UserAnswer>;
  score: number;
  startedAt?: string;
  finishedAt?: string;
}

// Pool normalizado proveniente de tus JSON
export interface NormalizedWord {
  id: string;                // `${category}::${palabra}`
  word: string;              // palabra
  meaning: string;           // significado
  example?: string;
  category: string;
}