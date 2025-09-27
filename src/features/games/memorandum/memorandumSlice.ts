import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MemorandumState, Card } from './types';
import { buildPairs } from './buildPairs';
import { shuffle } from '../../../utils/random';

const initialState: MemorandumState = {
  status: 'idle',
  pairs: [],
  wordCards: [],
  meaningCards: [],
  lockInput: false,
  justMatchedCardIds: [],
};

interface InitGamePayload {
  categories: string[];
  count?: number;
}

const memorandumSlice = createSlice({
  name: 'memorandum',
  initialState,
  reducers: {
    initGame: (state, action: PayloadAction<InitGamePayload>) => {
      const { categories, count = 10 } = action.payload;

      const pairs = buildPairs({ categories, count });

      const wordCards: Card[] = pairs.map(pair => ({
        id: `word-${pair.id}`,
        pairId: pair.id,
        type: 'word',
        label: pair.word,
        flipped: false,
        matched: false,
      }));

      const meaningCards: Card[] = pairs.map(pair => ({
        id: `meaning-${pair.id}`,
        pairId: pair.id,
        type: 'meaning',
        label: pair.meaning,
        flipped: false,
        matched: false,
      }));

      state.pairs = pairs;
      state.wordCards = shuffle(wordCards);
      state.meaningCards = shuffle(meaningCards);
      state.selectedWordId = undefined;
      state.selectedMeaningId = undefined;
      state.lockInput = false;
      state.justMatchedCardIds = [];
      state.status = 'running';
      state.startedAt = new Date().toISOString();
      state.finishedAt = undefined;
    },

    resetGame: (state) => {
      state.status = 'idle';
      state.pairs = [];
      state.wordCards = [];
      state.meaningCards = [];
      state.selectedWordId = undefined;
      state.selectedMeaningId = undefined;
      state.lockInput = false;
      state.justMatchedCardIds = [];
      state.startedAt = undefined;
      state.finishedAt = undefined;
    },

    selectWord: (state, action: PayloadAction<string>) => {
      const cardId = action.payload;
      const card = state.wordCards.find(c => c.id === cardId);

      if (!card || card.matched || state.lockInput) {
        return;
      }

      // Deselect previously selected word if any
      if (state.selectedWordId && state.selectedWordId !== cardId) {
        const previousCard = state.wordCards.find(c => c.id === state.selectedWordId);
        if (previousCard && !previousCard.matched) {
          previousCard.flipped = false;
        }
      }

      // Select the new card
      card.flipped = true;
      state.selectedWordId = cardId;
    },

    selectMeaning: (state, action: PayloadAction<string>) => {
      const cardId = action.payload;
      const card = state.meaningCards.find(c => c.id === cardId);

      if (!card || card.matched || state.lockInput) {
        return;
      }

      // Deselect previously selected meaning if any
      if (state.selectedMeaningId && state.selectedMeaningId !== cardId) {
        const previousCard = state.meaningCards.find(c => c.id === state.selectedMeaningId);
        if (previousCard && !previousCard.matched) {
          previousCard.flipped = false;
        }
      }

      // Select the new card
      card.flipped = true;
      state.selectedMeaningId = cardId;

      // If both word and meaning are selected, evaluate match
      if (state.selectedWordId) {
        state.lockInput = true;

        const selectedWordCard = state.wordCards.find(c => c.id === state.selectedWordId);
        const selectedMeaningCard = card;

        if (selectedWordCard && selectedWordCard.pairId === selectedMeaningCard.pairId) {
          // Match found!
          selectedWordCard.matched = true;
          selectedMeaningCard.matched = true;
          selectedWordCard.flipped = true;
          selectedMeaningCard.flipped = true;

          // Add to justMatched for animation feedback
          state.justMatchedCardIds = [selectedWordCard.id, selectedMeaningCard.id];

          // Clear selections
          state.selectedWordId = undefined;
          state.selectedMeaningId = undefined;
          state.lockInput = false;

          // Check if game is complete
          const allMatched = state.wordCards.every(c => c.matched);
          if (allMatched) {
            state.status = 'finished';
            state.finishedAt = new Date().toISOString();
          }
        }
        // If no match, we'll handle the timeout in a thunk or effect
      }
    },

    clearSelectionsAfterDelay: (state) => {
      // Reset flipped state for selected cards that are not matched
      if (state.selectedWordId) {
        const wordCard = state.wordCards.find(c => c.id === state.selectedWordId);
        if (wordCard && !wordCard.matched) {
          wordCard.flipped = false;
        }
      }

      if (state.selectedMeaningId) {
        const meaningCard = state.meaningCards.find(c => c.id === state.selectedMeaningId);
        if (meaningCard && !meaningCard.matched) {
          meaningCard.flipped = false;
        }
      }

      // Clear selections and unlock input
      state.selectedWordId = undefined;
      state.selectedMeaningId = undefined;
      state.lockInput = false;
    },

    clearJustMatchedCards: (state) => {
      state.justMatchedCardIds = [];
    },
  },
});

export const { initGame, resetGame, selectWord, selectMeaning, clearSelectionsAfterDelay, clearJustMatchedCards } = memorandumSlice.actions;
export default memorandumSlice.reducer;