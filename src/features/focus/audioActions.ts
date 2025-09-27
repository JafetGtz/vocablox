import { createAsyncThunk } from '@reduxjs/toolkit';
import { audioService } from '../../services/audioService';
import { volumeService } from './volumeService';
import { startCountdown, startPlayback, pause, resume, stop } from './focusSlice';
import { RootState } from '../../store/store';

// Initialize audio for Focus session
export const initializeAudio = createAsyncThunk(
  'focus/initializeAudio',
  async (_, { rejectWithValue }) => {
    try {
      await audioService.initialize();
      await audioService.loadAmbientTrack();
      return true;
    } catch (error) {
      return rejectWithValue('Failed to initialize audio');
    }
  }
);

// Start countdown with audio and volume check
export const startCountdownWithAudio = createAsyncThunk(
  'focus/startCountdownWithAudio',
  async (_, { dispatch, getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const { settings } = state.focus;

      // Check volume before starting
      const volumeOk = await volumeService.checkVolumeBeforeSession();
      if (!volumeOk) {
        console.warn('User chose to continue with low volume');
      }

      // Initialize audio if not already done
      await dispatch(initializeAudio()).unwrap();

      // Set volume and start playback
      await audioService.setVolume(settings.musicVolume);
      await audioService.play();

      // Dispatch Redux action to update state
      dispatch(startCountdown());

      return true;
    } catch (error) {
      return rejectWithValue('Failed to start countdown with audio');
    }
  }
);

// Pause with audio
export const pauseWithAudio = createAsyncThunk(
  'focus/pauseWithAudio',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      await audioService.pause();
      dispatch(pause());
      return true;
    } catch (error) {
      return rejectWithValue('Failed to pause audio');
    }
  }
);

// Resume with audio
export const resumeWithAudio = createAsyncThunk(
  'focus/resumeWithAudio',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      await audioService.play();
      dispatch(resume());
      return true;
    } catch (error) {
      return rejectWithValue('Failed to resume audio');
    }
  }
);

// Stop with audio cleanup
export const stopWithAudio = createAsyncThunk(
  'focus/stopWithAudio',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      await audioService.stop();
      dispatch(stop());
      return true;
    } catch (error) {
      return rejectWithValue('Failed to stop audio');
    }
  }
);

// Update volume
export const updateVolume = createAsyncThunk(
  'focus/updateVolume',
  async (volume: number, { rejectWithValue }) => {
    try {
      await audioService.setVolume(volume);
      return volume;
    } catch (error) {
      return rejectWithValue('Failed to update volume');
    }
  }
);