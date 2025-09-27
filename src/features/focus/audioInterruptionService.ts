import TrackPlayer, { Event, State } from 'react-native-track-player';
import { AppState, AppStateStatus } from 'react-native';
import { pauseWithAudio } from './audioActions';
import { AppDispatch } from '../../store/store';

export class AudioInterruptionService {
  private appStateListener: ((state: AppStateStatus) => void) | null = null;
  private trackPlayerListeners: (() => void)[] = [];
  private dispatch: AppDispatch | null = null;

  initialize(dispatch: AppDispatch) {
    this.dispatch = dispatch;
    this.setupAppStateListener();
    this.setupTrackPlayerListeners();
  }

  private setupAppStateListener() {
    this.appStateListener = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'background' || nextAppState === 'inactive') {
        // App going to background - pause the session
        if (this.dispatch) {
          this.dispatch(pauseWithAudio());
        }
      }
      // Note: We don't auto-resume when returning to foreground
      // The user must manually resume the session
    };

    AppState.addEventListener('change', this.appStateListener);
  }

  private setupTrackPlayerListeners() {
    // Audio focus loss (phone call, another app takes audio focus)
    const audioFocusListener = TrackPlayer.addEventListener(
      Event.RemoteDuck,
      (event) => {
        if (event.paused) {
          // Audio was ducked/paused by the system
          if (this.dispatch) {
            this.dispatch(pauseWithAudio());
          }
        }
      }
    );

    // Headphones disconnected or "becoming noisy"
    const becomingNoisyListener = TrackPlayer.addEventListener(
      Event.PlaybackError,
      (error) => {
        console.error('Playback error:', error);
        // Pause on playback errors
        if (this.dispatch) {
          this.dispatch(pauseWithAudio());
        }
      }
    );

    // Handle playback state changes that might indicate interruptions
    const playbackStateListener = TrackPlayer.addEventListener(
      Event.PlaybackState,
      async (state) => {
        // If playback was stopped unexpectedly (not by user action)
        if (state.state === State.Stopped || state.state === State.Error) {
          if (this.dispatch) {
            this.dispatch(pauseWithAudio());
          }
        }
      }
    );

    // Track when audio session is interrupted (iOS specific but works on Android too)
    const audioSessionListener = TrackPlayer.addEventListener(
      Event.RemotePause,
      () => {
        // Remote pause (could be from lock screen, notification, etc.)
        if (this.dispatch) {
          this.dispatch(pauseWithAudio());
        }
      }
    );

    this.trackPlayerListeners = [
      audioFocusListener,
      becomingNoisyListener,
      playbackStateListener,
      audioSessionListener,
    ];
  }

  cleanup() {
    // Remove app state listener
    if (this.appStateListener) {
      AppState.removeEventListener('change', this.appStateListener);
      this.appStateListener = null;
    }

    // Remove track player listeners
    this.trackPlayerListeners.forEach(removeListener => {
      removeListener();
    });
    this.trackPlayerListeners = [];

    this.dispatch = null;
  }
}

export const audioInterruptionService = new AudioInterruptionService();