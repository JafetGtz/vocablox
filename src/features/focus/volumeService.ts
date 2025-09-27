import SystemSetting from 'react-native-system-setting';
import { Platform, Alert } from 'react-native';

export class VolumeService {
  private readonly MINIMUM_VOLUME = 0.15; // 15% minimum volume

  async checkVolumeBeforeSession(): Promise<boolean> {
    if (Platform.OS !== 'android') {
      return true; // Skip volume check for iOS
    }

    try {
      const currentVolume = await SystemSetting.getVolume('music');

      if (currentVolume < this.MINIMUM_VOLUME) {
        return new Promise((resolve) => {
          Alert.alert(
            'Volumen Bajo',
            'Sube el volumen multimedia para disfrutar la música de fondo.',
            [
              {
                text: 'Continuar sin cambios',
                onPress: () => resolve(false),
                style: 'cancel',
              },
              {
                text: 'Abrir control de volumen',
                onPress: async () => {
                  try {
                    await this.openVolumeControl();
                    resolve(true);
                  } catch (error) {
                    console.error('Failed to open volume control:', error);
                    resolve(false);
                  }
                },
              },
            ]
          );
        });
      }

      return true;
    } catch (error) {
      console.error('Failed to check volume:', error);
      return true; // Continue if volume check fails
    }
  }

  private async openVolumeControl(): Promise<void> {
    try {
      // Try to open volume settings
      await SystemSetting.switchVolume();
    } catch (error) {
      // Fallback: set volume to a reasonable level
      await SystemSetting.setVolume(0.5, 'music');
      console.warn('Opened volume control failed, set volume to 50%');
    }
  }

  async getCurrentVolume(): Promise<number> {
    try {
      return await SystemSetting.getVolume('music');
    } catch (error) {
      console.error('Failed to get current volume:', error);
      return 0.5; // Default fallback
    }
  }

  async setVolume(volume: number): Promise<void> {
    try {
      await SystemSetting.setVolume(volume, 'music');
    } catch (error) {
      console.error('Failed to set volume:', error);
    }
  }

  // Listen to volume changes during session
  addVolumeListener(callback: (volume: number) => void): () => void {
    const listener = SystemSetting.addVolumeListener((data) => {
      if (data.type === 'music') {
        callback(data.value);
      }
    });

    return () => {
      SystemSetting.removeVolumeListener(listener);
    };
  }
}

export const volumeService = new VolumeService();