import { NativeModules } from 'react-native'

interface NotificationModuleInterface {
  scheduleNotifications(settings: {
    categories: string[]
    active_windows: string[]
    window_times: {
      morning?: string
      afternoon?: string
      evening?: string
    }
    words_per_burst: number
    nickname: string
  }): Promise<string>

  cancelAllNotifications(): Promise<string>
  requestIgnoreBatteryOptimization(): Promise<string>
  checkExactAlarmPermission(): Promise<boolean>
  requestExactAlarmPermission(): Promise<string>
  saveWords(words: Array<{
    id: string
    word: string
    meaning: string
    category: string
  }>): Promise<string>
}

const { NotificationModule } = NativeModules
export default NotificationModule as NotificationModuleInterface
