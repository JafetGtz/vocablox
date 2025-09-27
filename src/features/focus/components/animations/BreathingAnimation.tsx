import React, { memo, useMemo } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  interpolate,
} from 'react-native-reanimated';

interface BreathingAnimationProps {
  tint?: 'blue' | 'purple' | 'green';
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const BreathingAnimation: React.FC<BreathingAnimationProps> = memo(({ tint = 'blue' }) => {
  const breathingProgress = useSharedValue(0);

  // Color mapping for different tints
  const colors = useMemo(() => {
    switch (tint) {
      case 'purple':
        return {
          primary: 'rgba(147, 51, 234, 0.15)',
          secondary: 'rgba(168, 85, 247, 0.1)',
          accent: 'rgba(196, 181, 253, 0.05)',
        };
      case 'green':
        return {
          primary: 'rgba(34, 197, 94, 0.15)',
          secondary: 'rgba(74, 222, 128, 0.1)',
          accent: 'rgba(134, 239, 172, 0.05)',
        };
      case 'blue':
      default:
        return {
          primary: 'rgba(59, 130, 246, 0.15)',
          secondary: 'rgba(96, 165, 250, 0.1)',
          accent: 'rgba(147, 197, 253, 0.05)',
        };
    }
  }, [tint]);

  React.useEffect(() => {
    // Breathing pattern: inhale (4s) -> hold (1s) -> exhale (4s) -> hold (1s)
    breathingProgress.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 4000 }), // Inhale
        withTiming(1, { duration: 1000 }), // Hold
        withTiming(0, { duration: 4000 }), // Exhale
        withTiming(0, { duration: 1000 }), // Hold
      ),
      -1,
      false
    );
  }, [breathingProgress]);

  const animatedStyle1 = useAnimatedStyle(() => {
    const scale = interpolate(breathingProgress.value, [0, 1], [0.3, 1.2]);
    const opacity = interpolate(breathingProgress.value, [0, 1], [0.8, 0.3]);

    return {
      transform: [{ scale }],
      opacity,
    };
  });

  const animatedStyle2 = useAnimatedStyle(() => {
    const scale = interpolate(breathingProgress.value, [0, 1], [0.5, 1.0]);
    const opacity = interpolate(breathingProgress.value, [0, 1], [0.6, 0.2]);

    return {
      transform: [{ scale }],
      opacity,
    };
  });

  const animatedStyle3 = useAnimatedStyle(() => {
    const scale = interpolate(breathingProgress.value, [0, 1], [0.7, 0.8]);
    const opacity = interpolate(breathingProgress.value, [0, 1], [0.4, 0.1]);

    return {
      transform: [{ scale }],
      opacity,
    };
  });

  return (
    <View style={StyleSheet.absoluteFillObject}>
      <View style={styles.centerContainer}>
        <Animated.View style={[styles.circle, styles.circle1, { backgroundColor: colors.primary }, animatedStyle1]} />
        <Animated.View style={[styles.circle, styles.circle2, { backgroundColor: colors.secondary }, animatedStyle2]} />
        <Animated.View style={[styles.circle, styles.circle3, { backgroundColor: colors.accent }, animatedStyle3]} />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    position: 'absolute',
    borderRadius: Math.min(screenWidth, screenHeight) / 2,
  },
  circle1: {
    width: Math.min(screenWidth, screenHeight) * 0.8,
    height: Math.min(screenWidth, screenHeight) * 0.8,
  },
  circle2: {
    width: Math.min(screenWidth, screenHeight) * 0.6,
    height: Math.min(screenWidth, screenHeight) * 0.6,
  },
  circle3: {
    width: Math.min(screenWidth, screenHeight) * 0.4,
    height: Math.min(screenWidth, screenHeight) * 0.4,
  },
});

BreathingAnimation.displayName = 'BreathingAnimation';

export default BreathingAnimation;