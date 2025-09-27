import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store/store';
import { FocusWordItem } from './types';
import { shuffleArray } from './sequencing';
import { wordDataService } from './services/wordDataService';

export const selectFocusState = (state: RootState) => state.focus;

export const selectFocusStatus = createSelector(
  [selectFocusState],
  (focus) => focus.status
);

export const selectCurrentItem = createSelector(
  [selectFocusState],
  (focus): FocusWordItem | null => {
    if (focus.queue.length === 0 || focus.currentIndex >= focus.queue.length) {
      return null;
    }
    return focus.queue[focus.currentIndex];
  }
);

export const selectProgress = createSelector(
  [selectFocusState],
  (focus) => ({
    current: focus.currentIndex + 1,
    total: focus.queue.length,
    percentage: focus.queue.length > 0 ? ((focus.currentIndex + 1) / focus.queue.length) * 100 : 0
  })
);

export const selectIsFinished = createSelector(
  [selectFocusState],
  (focus) => focus.status === 'finished'
);

export const selectFocusSettings = createSelector(
  [selectFocusState],
  (focus) => focus.settings
);

export const selectFocusQueue = createSelector(
  [selectFocusState],
  (focus) => focus.queue
);

export const selectIsActive = createSelector(
  [selectFocusStatus],
  (status) => ['countdown', 'playing', 'paused'].includes(status)
);

// Helper selector to build queue from categories or manual selection
export const buildFocusQueue = createSelector(
  [selectFocusState],
  (focus) => {
    let queue: FocusWordItem[] = [];

    if (focus.source === 'category') {
      // Build queue from selected categories
      queue = wordDataService.getMultipleCategoryWords(focus.categoryIds);
    } else if (focus.source === 'manual') {
      // Build queue from manually selected word IDs
      queue = wordDataService.getWordsByIds(focus.selectedWordIds);
    }

    // Apply ordering
    if (focus.settings.order === 'random') {
      queue = shuffleArray(queue);
    }

    return queue;
  }
);