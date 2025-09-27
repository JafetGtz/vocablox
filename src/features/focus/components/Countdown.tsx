import React, { useState, useEffect, memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { selectFocusState } from '../focusSelectors';
import { startPlayback } from '../focusSlice';
import { AppDispatch } from '../../../store/store';

const Countdown: React.FC = memo(() => {
  const dispatch = useDispatch<AppDispatch>();
  const { countdownSeconds } = useSelector(selectFocusState);
  const [currentCount, setCurrentCount] = useState(countdownSeconds);
  const [scaleAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    if (currentCount > 0) {
      // Animate scale in/out for each number
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Countdown timer
      const timer = setTimeout(() => {
        const newCount = currentCount - 1;
        setCurrentCount(newCount);

        // When countdown reaches 0, automatically start playback
        if (newCount <= 0) {
          setTimeout(() => {
            dispatch(startPlayback());
          }, 1000); // Wait 1 second after showing "¡Comencemos!"
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [currentCount, scaleAnim, dispatch]);

  // Reset countdown when component mounts
  useEffect(() => {
    setCurrentCount(countdownSeconds);
  }, [countdownSeconds]);

  if (currentCount <= 0) {
    return (
      <View style={styles.container}>
        <Animated.Text
          style={[
            styles.countdownText,
            styles.startText,
            { transform: [{ scale: scaleAnim }] }
          ]}
        >
          ¡Comencemos!
        </Animated.Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.preparingText}>Preparándote para el focus...</Text>

      <Animated.View
        style={[
          styles.countdownContainer,
          { transform: [{ scale: scaleAnim }] }
        ]}
      >
        <Text style={styles.countdownText}>
          {currentCount}
        </Text>
      </Animated.View>

      <Text style={styles.instructionText}>
        Relájate y concéntrate
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  preparingText: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 40,
    textAlign: 'center',
    opacity: 0.8,
  },
  countdownContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  countdownText: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  startText: {
    fontSize: 32,
    marginVertical: 20,
  },
  instructionText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginTop: 40,
    textAlign: 'center',
    opacity: 0.7,
  },
});

Countdown.displayName = 'Countdown';

export default Countdown;