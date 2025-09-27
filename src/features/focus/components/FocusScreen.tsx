import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  BackHandler,
  Alert,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../../navigation/AppStackNavigator';
import { RootState, AppDispatch } from '../../../store/store';
import { selectFocusStatus } from '../focusSelectors';
import { stopWithAudio } from '../audioActions';
import { resetSession } from '../focusSlice';
import { audioInterruptionService } from '../audioInterruptionService';
import { FocusSequencer } from '../sequencing';
import { startPlayback, next } from '../focusSlice';
import Countdown from './Countdown';
import WordSlide from './WordSlide';
import FocusHUD from './FocusHUD';
import AnimatedBackground from './AnimatedBackground';

type NavigationProp = NativeStackNavigationProp<AppStackParamList, 'Home'>;

const FocusScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<NavigationProp>();
  const status = useSelector(selectFocusStatus);
  const focusState = useSelector((state: RootState) => state.focus);
  const sequencerRef = useRef<FocusSequencer | null>(null);

  // Hide status bar and handle hardware back button
  useFocusEffect(
    React.useCallback(() => {
      // Hide status bar for immersive experience
      StatusBar.setHidden(true);

      // Initialize audio interruption service
      audioInterruptionService.initialize(dispatch);

      // Initialize sequencer
      if (!sequencerRef.current) {
        sequencerRef.current = new FocusSequencer(dispatch);
      }

      // Handle Android back button
      const onBackPress = () => {
        handleExit();
        return true; // Prevent default back action
      };

      const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => {
        // Restore status bar when leaving screen
        StatusBar.setHidden(false);

        // Cleanup audio interruption service
        audioInterruptionService.cleanup();

        // Cleanup sequencer
        if (sequencerRef.current) {
          sequencerRef.current.stop();
          sequencerRef.current = null;
        }

        // Remove back handler
        backHandler.remove();
      };
    }, [dispatch])
  );

  // Handle sequencer based on status changes
  useEffect(() => {
    if (!sequencerRef.current) return;

    switch (status) {
      case 'countdown':
        sequencerRef.current.startCountdownTimer();
        break;
      case 'playing':
        sequencerRef.current.startSlideTimer();
        break;
      case 'paused':
        sequencerRef.current.pause();
        break;
      case 'finished':
        sequencerRef.current.stop();
        // Auto-navigate to Home after session completion with a delay
        const timer = setTimeout(() => {
          dispatch(resetSession());
          navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
          });
        }, 3000); // 3 seconds delay to show completion screen

        return () => clearTimeout(timer);
      case 'idle':
        sequencerRef.current.stop();
        break;
    }
  }, [status, dispatch, navigation]);

  const handleExit = () => {
    Alert.alert(
      'Salir de Focus',
      '¿Estás seguro de que quieres salir? Se detendrá la sesión actual.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Salir',
          style: 'destructive',
          onPress: () => {
            // Stop audio and cleanup
            dispatch(stopWithAudio());
            // Reset focus state completely for next session
            dispatch(resetSession());
            // Navigate back to Home
            navigation.reset({
              index: 0,
              routes: [{ name: 'Home' }],
            });
          },
        },
      ]
    );
  };

  const renderContent = () => {
    switch (status) {
      case 'countdown':
        return <Countdown />;

      case 'playing':
      case 'paused':
        return <WordSlide />;

      case 'finished':
        return (
          <View style={styles.finishedContainer}>
            <FocusHUD />
          </View>
        );

      default:
        return null;
    }
  };

  // Determine background tint based on status or settings
  const getBackgroundTint = () => {
    switch (status) {
      case 'countdown':
        return 'blue';
      case 'playing':
        return 'purple';
      case 'paused':
        return 'green';
      case 'finished':
        return 'green';
      default:
        return 'blue';
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      {/* Ambient Background - persistent during session */}
      {status !== 'idle' && (
        <AnimatedBackground type={focusState.settings.bgAnimation} tint={getBackgroundTint()} />
      )}

      {/* Main content area */}
      <View style={styles.contentContainer}>
        {renderContent()}
      </View>

      {/* HUD overlay - only show during active session */}
      {(status === 'playing' || status === 'paused') && (
        <View style={styles.hudOverlay}>
          <FocusHUD onExit={handleExit} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1, // Below HUD overlay (zIndex: 10)
  },
  hudOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'box-none', // Allow touches to pass through to content
    zIndex: 10, // Above particles (zIndex: 2)
  },
  finishedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FocusScreen;