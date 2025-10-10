import TrackPlayer, {
  Event,
  RepeatMode,
  AppKilledPlaybackBehavior,
  Capability,
  IOSCategory,
  IOSCategoryMode,
} from 'react-native-track-player';

class AudioService {
  private isInitialized = false;
  private currentTrackType: 'ambient' | 'quiz' | 'hangman' | null = null;

  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      await TrackPlayer.setupPlayer({
        // Configure audio focus for Android
        waitForBuffer: true,
        autoHandleInterruptions: true,
      });

      await TrackPlayer.updateOptions({
        android: {
          appKilledPlaybackBehavior: AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
        },
        capabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.Stop,
        ],
        compactCapabilities: [
          Capability.Play,
          Capability.Pause,
        ],
        progressUpdateEventInterval: 1,
      });

      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize TrackPlayer:', error);
      throw error;
    }
  }

  async loadAmbientTrack(): Promise<void> {
    try {
      await TrackPlayer.reset();

      await TrackPlayer.add({
        id: 'ambient-music',
        url: require('../assets/audio/ambiente.mp3'),
        title: 'Ambient Music',
        artist: 'Focus Mode',
        duration: 300, // Approximate duration in seconds
      });

      await TrackPlayer.setRepeatMode(RepeatMode.Queue);
      this.currentTrackType = 'ambient';
    } catch (error) {
      console.error('Failed to load ambient track:', error);
      throw error;
    }
  }

  async loadGameTrack(gameType: 'quiz' | 'hangman'): Promise<void> {
    try {
      await TrackPlayer.reset();

      const trackConfig = gameType === 'quiz'
        ? {
            id: 'game-music',
            url: require('../assets/audio/game.mp3'),
            title: 'Game Music',
            artist: 'Quiz Game',
          }
        : {
            id: 'hangman-music',
            url: require('../assets/audio/game_ahorcado.mp3'),
            title: 'Hangman Music',
            artist: 'Hangman Game',
          };

      await TrackPlayer.add(trackConfig);
      await TrackPlayer.setRepeatMode(RepeatMode.Queue);
      await TrackPlayer.setVolume(0.7); // Set low volume for games
      this.currentTrackType = gameType;
    } catch (error) {
      console.error(`Failed to load ${gameType} track:`, error);
      throw error;
    }
  }

  async play(): Promise<void> {
    try {
      await TrackPlayer.play();
    } catch (error) {
      console.error('Failed to play:', error);
    }
  }

  async pause(): Promise<void> {
    try {
      await TrackPlayer.pause();
    } catch (error) {
      console.error('Failed to pause:', error);
    }
  }

  async stop(): Promise<void> {
    try {
      console.log('AudioService: Stopping player...');
      await TrackPlayer.stop();
      await TrackPlayer.reset();
      this.currentTrackType = null;
      console.log('AudioService: Player stopped and reset');
    } catch (error) {
      console.error('Failed to stop:', error);
    }
  }

  // Force stop with more aggressive cleanup
  async forceStop(): Promise<void> {
    try {
      console.log('AudioService: Force stopping player...');

      // First try to pause
      try {
        await TrackPlayer.pause();
      } catch (pauseError) {
        console.log('AudioService: Pause failed (player might not be playing)');
      }

      // Then stop
      try {
        await TrackPlayer.stop();
      } catch (stopError) {
        console.log('AudioService: Stop failed (player might already be stopped)');
      }

      // Finally reset
      try {
        await TrackPlayer.reset();
      } catch (resetError) {
        console.log('AudioService: Reset failed');
      }

      this.currentTrackType = null;
      console.log('AudioService: Force stop completed');
    } catch (error) {
      console.error('Failed to force stop:', error);
    }
  }

  async setVolume(volume: number): Promise<void> {
    try {
      await TrackPlayer.setVolume(volume);
    } catch (error) {
      console.error('Failed to set volume:', error);
    }
  }

  async cleanup(): Promise<void> {
    try {
      await TrackPlayer.stop();
      await TrackPlayer.reset();
      this.currentTrackType = null;
      this.isInitialized = false;
    } catch (error) {
      console.error('Failed to cleanup:', error);
    }
  }

  getCurrentTrackType(): 'ambient' | 'quiz' | 'hangman' | null {
    return this.currentTrackType;
  }

  async isPlaying(): Promise<boolean> {
    try {
      const state = await TrackPlayer.getState();
      return state === 'playing';
    } catch (error) {
      return false;
    }
  }
}

export const audioService = new AudioService();

// Register the playback service
export default async function playbackService() {
  TrackPlayer.addEventListener(Event.RemotePlay, () => TrackPlayer.play());
  TrackPlayer.addEventListener(Event.RemotePause, () => TrackPlayer.pause());
  TrackPlayer.addEventListener(Event.RemoteStop, () => TrackPlayer.stop());
}