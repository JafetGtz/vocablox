import React from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import { store } from './src/store/store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import RootNavigator from './src/navigation/RootNavigator';
import AuthListener from './src/components/AuthListener';
const queryClient = new QueryClient()

const App = () => {
  return (
    <ReduxProvider store={store}>
      <AuthListener />     
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <RootNavigator />
        </SafeAreaProvider>
      </QueryClientProvider>
    </ReduxProvider>
  )
}

export default App
