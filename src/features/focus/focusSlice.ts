import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FocusState, InitSessionPayload, FocusWordItem } from './types';
import { updateVolume } from './audioActions';

const initialState: FocusState = {
  status: 'idle',
  source: 'category',
  categoryIds: [],
  selectedWordIds: [],
  queue: [],
  currentIndex: 0,
  countdownSeconds: 5,
  perWordSeconds: 10,
  settings: {
    order: 'random',
    musicVolume: 0.5,
    bgAnimation: 'particles'
  },
  startedAt: undefined,
  finishedAt: undefined
};

const focusSlice = createSlice({
  name: 'focus',
  initialState,
  reducers: {
    initSession: (state, action: PayloadAction<InitSessionPayload>) => {
      const { source, categoryIds = [], selectedWordIds = [], order = 'random' } = action.payload;

      state.status = 'selecting';
      state.source = source;
      state.categoryIds = categoryIds;
      state.selectedWordIds = selectedWordIds;
      state.settings.order = order;
      state.currentIndex = 0;
      state.startedAt = undefined;
      state.finishedAt = undefined;
      state.queue = [];
    },

    setQueue: (state, action: PayloadAction<FocusWordItem[]>) => {
      state.queue = action.payload;
      state.currentIndex = 0;
    },

    startCountdown: (state) => {
      state.status = 'countdown';
      state.startedAt = new Date().toISOString();
    },

    startPlayback: (state) => {
      state.status = 'playing';
    },

    next: (state) => {
      if (state.currentIndex < state.queue.length - 1) {
        state.currentIndex += 1;
      } else {
        state.status = 'finished';
        state.finishedAt = new Date().toISOString();
      }
    },

    pause: (state) => {
      if (state.status === 'playing') {
        state.status = 'paused';
      }
    },

    resume: (state) => {
      if (state.status === 'paused') {
        state.status = 'playing';
      }
    },

    stop: (state) => {
      state.status = 'idle';
      state.currentIndex = 0;
      state.queue = [];
      state.categoryIds = [];
      state.selectedWordIds = [];
      state.startedAt = undefined;
      state.finishedAt = undefined;
    },

    resetSession: (state) => {
      // Complete reset to initial state, preserving only user settings
      const currentSettings = state.settings;
      Object.assign(state, initialState);
      state.settings = currentSettings;
    },

    updateSettings: (state, action: PayloadAction<Partial<FocusState['settings']>>) => {
      state.settings = { ...state.settings, ...action.payload };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateVolume.fulfilled, (state, action) => {
        state.settings.musicVolume = action.payload;
      });
  }
});

export const {
  initSession,
  setQueue,
  startCountdown,
  startPlayback,
  next,
  pause,
  resume,
  stop,
  resetSession,
  updateSettings
} = focusSlice.actions;

export default focusSlice.reducer;