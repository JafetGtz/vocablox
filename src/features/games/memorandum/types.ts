export type MemoStatus = 'idle' | 'running' | 'finished';

export interface Pair {
  id: string;
  word: string;
  meaning: string;
  category: string;
}

export interface Card {
  id: string;
  pairId: string;
  type: 'word' | 'meaning';
  label: string;
  flipped: boolean;
  matched: boolean;
}

export interface MemorandumState {
  status: MemoStatus;
  pairs: Pair[];
  wordCards: Card[];
  meaningCards: Card[];
  selectedWordId?: string;
  selectedMeaningId?: string;
  lockInput: boolean;
  justMatchedCardIds: string[];
  startedAt?: string;
  finishedAt?: string;
  categorySeed?: string;
}