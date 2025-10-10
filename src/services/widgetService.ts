import { NativeModules } from 'react-native'

interface WidgetModuleInterface {
  updateWidget(word: string, meaning: string, backgroundUri: string | null): Promise<string>
  getWidgetData(): Promise<{
    word: string
    meaning: string
    background: string | null
  }>
}

const { WidgetModule } = NativeModules
export default WidgetModule as WidgetModuleInterface
