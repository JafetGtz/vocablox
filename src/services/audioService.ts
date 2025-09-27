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
    } catch (error) {
      console.error('Failed to load ambient track:', error);
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
      await TrackPlayer.stop();
      await TrackPlayer.reset();
    } catch (error) {
      console.error('Failed to stop:', error);
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
      this.isInitialized = false;
    } catch (error) {
      console.error('Failed to cleanup:', error);
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