/**
 * @format
 */
import 'react-native-url-polyfill/auto';
import { AppRegistry } from 'react-native'
import TrackPlayer from 'react-native-track-player'

import App from './App'
import {name as appName} from './app.json'
import playbackService from './src/services/audioService'

AppRegistry.registerComponent(appName, () => App)
TrackPlayer.registerPlaybackService(() => playbackService)
