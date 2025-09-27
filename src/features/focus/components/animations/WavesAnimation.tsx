import React, { memo, useMemo } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  interpolate,
} from 'react-native-reanimated';

interface WavesAnimationProps {
  tint?: 'blue' | 'purple' | 'green';
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const WAVE_COUNT = 4;

const WavesAnimation: React.FC<WavesAnimationProps> = memo(({ tint = 'blue' }) => {
  // Color mapping for different tints
  const tintColors = useMemo(() => {
    switch (tint) {
      case 'purple':
        return ['rgba(147, 51, 234, 0.1)', 'rgba(168, 85, 247, 0.15)', 'rgba(196, 181, 253, 0.1)', 'rgba(221, 214, 254, 0.05)'];
      case 'green':
        return ['rgba(34, 197, 94, 0.1)', 'rgba(74, 222, 128, 0.15)', 'rgba(134, 239, 172, 0.1)', 'rgba(187, 247, 208, 0.05)'];
      case 'blue':
      default:
        return ['rgba(59, 130, 246, 0.1)', 'rgba(96, 165, 250, 0.15)', 'rgba(147, 197, 253, 0.1)', 'rgba(191, 219, 254, 0.05)'];
    }
  }, [tint]);

  return (
    <View style={StyleSheet.absoluteFillObject}>
      {Array.from({ length: WAVE_COUNT }).map((_, index) => (
        <AnimatedWave
          key={index}
          index={index}
          color={tintColors[index]}
          delay={index * 2000}
        />
      ))}
    </View>
  );
});

interface AnimatedWaveProps {
  index: number;
  color: string;
  delay: number;
}

const AnimatedWave: React.FC<AnimatedWaveProps> = memo(({ index, color, delay }) => {
  const scale = useSharedValue(0.5);
  const opacity = useSharedValue(0.8);

  React.useEffect(() => {
    scale.value = withDelay(
      delay,
      withRepeat(
        withTiming(3 + index * 0.5, {
          duration: 8000 + index * 2000, // Staggered durations
        }),
        -1,
        false
      )
    );

    opacity.value = withDelay(
      delay,
      withRepeat(
        withTiming(0, {
          duration: 8000 + index * 2000,
        }),
        -1,
        false
      )
    );
  }, [index, delay, scale, opacity]);

  const animatedStyle = useAnimatedStyle(() => {
    const size = interpolate(scale.value, [0.5, 3 + index * 0.5], [50, screenWidth * 2]);

    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
      width: size,
      height: size,
      borderRadius: size / 2,
    };
  });

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: screenWidth / 2 - 25,
          top: screenHeight / 2 - 25,
          backgroundColor: color,
          borderWidth: 2,
          borderColor: color.replace(/0\.\d+/, '0.3'),
        },
        animatedStyle,
      ]}
    />
  );
});

WavesAnimation.displayName = 'WavesAnimation';
AnimatedWave.displayName = 'AnimatedWave';

export default WavesAnimation;