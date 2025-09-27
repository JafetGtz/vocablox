import { RootState } from '../../../store/store';

export const selectMemorandumState = (state: RootState) => state.memorandum;

export const selectMemoStatus = (state: RootState) => state.memorandum.status;

export const selectMemoPairs = (state: RootState) => state.memorandum.pairs;

export const selectMemoWordCards = (state: RootState) => state.memorandum.wordCards;

export const selectMemoMeaningCards = (state: RootState) => state.memorandum.meaningCards;

export const selectSelectedWordId = (state: RootState) => state.memorandum.selectedWordId;

export const selectSelectedMeaningId = (state: RootState) => state.memorandum.selectedMeaningId;

export const selectLockInput = (state: RootState) => state.memorandum.lockInput;

export const selectRemainingPairsCount = (state: RootState) => {
  const wordCards = state.memorandum.wordCards;
  return wordCards.filter(card => !card.matched).length;
};

export const selectIsBoardComplete = (state: RootState) => {
  const wordCards = state.memorandum.wordCards;
  return wordCards.length > 0 && wordCards.every(card => card.matched);
};

export const selectJustMatchedCardIds = (state: RootState) => state.memorandum.justMatchedCardIds;