import React, { memo, useMemo } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  interpolateColor,
} from 'react-native-reanimated';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

interface AmbientBackgroundProps {
  tint?: 'blue' | 'purple' | 'green';
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const PARTICLE_COUNT = 15;

const AmbientBackground: React.FC<AmbientBackgroundProps> = memo(({ tint = 'blue' }) => {
  // Generate particles only once
  const particles = useMemo(() => {
    const particleArray: Particle[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particleArray.push({
        id: i,
        x: Math.random() * screenWidth,
        y: Math.random() * screenHeight,
        size: Math.random() * 20 + 15, // 15-35px (mucho más grandes)
        duration: Math.random() * 10000 + 15000, // 15-25 seconds
        delay: Math.random() * 5000, // 0-5 seconds delay
      });
    }
    return particleArray;
  }, []);

  // Color mapping for different tints
  const tintColors = useMemo(() => {
    switch (tint) {
      case 'purple':
        return {
          primary: 'rgba(147, 51, 234, 0.8)', // purple-600 with higher opacity
          secondary: 'rgba(168, 85, 247, 0.6)', // purple-500 with higher opacity
        };
      case 'green':
        return {
          primary: 'rgba(34, 197, 94, 0.8)', // green-500 with higher opacity
          secondary: 'rgba(74, 222, 128, 0.6)', // green-400 with higher opacity
        };
      case 'blue':
      default:
        return {
          primary: 'rgba(59, 130, 246, 0.8)', // blue-500 with higher opacity
          secondary: 'rgba(96, 165, 250, 0.6)', // blue-400 with higher opacity
        };
    }
  }, [tint]);

  return (
    <View style={[StyleSheet.absoluteFillObject, { zIndex: 1 }]}>
      {particles.map((particle, index) => (
        <AnimatedParticle
          key={particle.id}
          particle={particle}
          color={index % 2 === 0 ? tintColors.primary : tintColors.secondary}
        />
      ))}
    </View>
  );
});

interface AnimatedParticleProps {
  particle: Particle;
  color: string;
}

const AnimatedParticle: React.FC<AnimatedParticleProps> = memo(({ particle, color }) => {
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(0.6);
  const colorProgress = useSharedValue(0);

  // Pre-calculate random drift to avoid Math.random() on UI thread
  const driftAmount = useMemo(() => (Math.random() - 0.5) * 100, []);

  // Pre-calculate color variations
  const colorVariations = useMemo(() => [
    'rgba(59, 130, 246, 0.8)',   // blue
    'rgba(147, 51, 234, 0.8)',   // purple
    'rgba(34, 197, 94, 0.8)',    // green
    'rgba(236, 72, 153, 0.8)',   // pink
    'rgba(245, 158, 11, 0.8)',   // amber
    'rgba(239, 68, 68, 0.8)',    // red
  ], []);

  React.useEffect(() => {
    // Vertical movement (main movement)
    translateY.value = withDelay(
      particle.delay,
      withRepeat(
        withTiming(-screenHeight * 0.3, {
          duration: particle.duration,
        }),
        -1,
        true
      )
    );

    // Horizontal drift (subtle side-to-side)
    translateX.value = withDelay(
      particle.delay,
      withRepeat(
        withTiming(
          driftAmount, // Pre-calculated drift amount
          {
            duration: particle.duration * 0.7,
          }
        ),
        -1,
        true
      )
    );

    // Opacity pulsing
    opacity.value = withDelay(
      particle.delay,
      withRepeat(
        withTiming(0.3, {
          duration: particle.duration * 0.5,
        }),
        -1,
        true
      )
    );

    // Color cycling - rotates through colors over time
    colorProgress.value = withDelay(
      particle.delay * 0.5, // Different delay for color changes
      withRepeat(
        withTiming(colorVariations.length - 1, {
          duration: particle.duration * 2, // Slower color changes
        }),
        -1,
        false // Don't reverse, just cycle
      )
    );
  }, [particle, translateY, translateX, opacity, colorProgress, driftAmount, colorVariations]);

  const animatedStyle = useAnimatedStyle(() => {
    // Interpolate between colors based on progress
    const currentColor = interpolateColor(
      colorProgress.value,
      [0, 1, 2, 3, 4, 5], // Input range for 6 colors
      colorVariations
    );

    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
      opacity: opacity.value,
      backgroundColor: currentColor,
    };
  });

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: particle.x,
          top: particle.y,
          width: particle.size,
          height: particle.size,
          borderRadius: particle.size / 2,
          zIndex: 2,
        },
        animatedStyle,
      ]}
    />
  );
});

AmbientBackground.displayName = 'AmbientBackground';
AnimatedParticle.displayName = 'AnimatedParticle';

export default AmbientBackground;