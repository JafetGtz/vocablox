export type FocusStatus = 'idle' | 'selecting' | 'countdown' | 'playing' | 'paused' | 'finished';

export type FocusSource = 'category' | 'manual';

export type FocusOrder = 'random' | 'fixed';

export interface FocusWordItem {
  id: string;
  word: string;
  meaning: string;
  category: string;
}

export type BgAnimationType =
  | 'particles'
  | 'waves'
  | 'gradient'
  | 'breathing'
  | 'constellation'
  | 'minimal'
  | 'none';

export interface FocusSettings {
  order: FocusOrder;
  musicVolume: number;
  bgAnimation: BgAnimationType;
}

export interface FocusState {
  status: FocusStatus;
  source: FocusSource;
  categoryIds: string[];
  selectedWordIds: string[];
  queue: FocusWordItem[];
  currentIndex: number;
  countdownSeconds: number;
  perWordSeconds: number;
  settings: FocusSettings;
  startedAt?: string;
  finishedAt?: string;
}

export interface InitSessionPayload {
  source: FocusSource;
  categoryIds?: string[];
  selectedWordIds?: string[];
  order?: FocusOrder;
}