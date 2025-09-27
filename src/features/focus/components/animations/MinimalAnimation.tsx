import React, { memo, useMemo } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
} from 'react-native-reanimated';

interface MinimalAnimationProps {
  tint?: 'blue' | 'purple' | 'green';
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const MinimalAnimation: React.FC<MinimalAnimationProps> = memo(({ tint = 'blue' }) => {
  const progress = useSharedValue(0);

  // Color mapping for different tints
  const colors = useMemo(() => {
    switch (tint) {
      case 'purple':
        return {
          accent: 'rgba(147, 51, 234, 0.08)',
          line: 'rgba(168, 85, 247, 0.15)',
        };
      case 'green':
        return {
          accent: 'rgba(34, 197, 94, 0.08)',
          line: 'rgba(74, 222, 128, 0.15)',
        };
      case 'blue':
      default:
        return {
          accent: 'rgba(59, 130, 246, 0.08)',
          line: 'rgba(96, 165, 250, 0.15)',
        };
    }
  }, [tint]);

  React.useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, {
        duration: 8000, // Very slow, calming movement
      }),
      -1,
      true
    );
  }, [progress]);

  const animatedLineStyle = useAnimatedStyle(() => {
    const translateX = interpolate(progress.value, [0, 1], [-screenWidth * 0.2, screenWidth * 0.2]);
    const opacity = interpolate(progress.value, [0, 0.5, 1], [0.3, 0.8, 0.3]);

    return {
      transform: [{ translateX }],
      opacity,
    };
  });

  const animatedAccentStyle = useAnimatedStyle(() => {
    const scale = interpolate(progress.value, [0, 1], [0.8, 1.1]);
    const opacity = interpolate(progress.value, [0, 1], [0.05, 0.12]);

    return {
      transform: [{ scale }],
      opacity,
    };
  });

  return (
    <View style={StyleSheet.absoluteFillObject}>
      {/* Subtle accent circle in center */}
      <View style={styles.centerContainer}>
        <Animated.View
          style={[
            styles.accentCircle,
            { backgroundColor: colors.accent },
            animatedAccentStyle,
          ]}
        />
      </View>

      {/* Minimal moving line */}
      <Animated.View
        style={[
          styles.line,
          { backgroundColor: colors.line },
          animatedLineStyle,
        ]}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  accentCircle: {
    width: Math.min(screenWidth, screenHeight) * 0.6,
    height: Math.min(screenWidth, screenHeight) * 0.6,
    borderRadius: Math.min(screenWidth, screenHeight) * 0.3,
  },
  line: {
    position: 'absolute',
    top: screenHeight * 0.3,
    left: screenWidth * 0.2,
    width: screenWidth * 0.6,
    height: 2,
  },
});

MinimalAnimation.displayName = 'MinimalAnimation';

export default MinimalAnimation;