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

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

interface ConstellationAnimationProps {
  tint?: 'blue' | 'purple' | 'green';
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const STAR_COUNT = 8;

const ConstellationAnimation: React.FC<ConstellationAnimationProps> = memo(({ tint = 'blue' }) => {
  // Generate stars only once
  const stars = useMemo(() => {
    const starArray: Star[] = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      starArray.push({
        id: i,
        x: Math.random() * (screenWidth - 40) + 20,
        y: Math.random() * (screenHeight - 40) + 20,
        size: Math.random() * 4 + 2, // 2-6px
        duration: Math.random() * 3000 + 2000, // 2-5 seconds
        delay: Math.random() * 2000, // 0-2 seconds delay
      });
    }
    return starArray;
  }, []);

  // Color mapping for different tints
  const starColor = useMemo(() => {
    switch (tint) {
      case 'purple':
        return 'rgba(196, 181, 253, 0.8)';
      case 'green':
        return 'rgba(134, 239, 172, 0.8)';
      case 'blue':
      default:
        return 'rgba(147, 197, 253, 0.8)';
    }
  }, [tint]);

  const lineColor = useMemo(() => {
    switch (tint) {
      case 'purple':
        return 'rgba(147, 51, 234, 0.3)';
      case 'green':
        return 'rgba(34, 197, 94, 0.3)';
      case 'blue':
      default:
        return 'rgba(59, 130, 246, 0.3)';
    }
  }, [tint]);

  return (
    <View style={StyleSheet.absoluteFillObject}>
      {/* Connection Lines - Using View instead of SVG */}
      {stars.map((star, index) => {
        if (index < stars.length - 1) {
          const nextStar = stars[index + 1];
          const distance = Math.sqrt(
            Math.pow(nextStar.x - star.x, 2) + Math.pow(nextStar.y - star.y, 2)
          );
          const angle = Math.atan2(nextStar.y - star.y, nextStar.x - star.x);

          return (
            <View
              key={`line-${star.id}`}
              style={[
                styles.connectionLine,
                {
                  left: star.x,
                  top: star.y,
                  width: distance,
                  backgroundColor: lineColor,
                  transform: [{ rotate: `${angle}rad` }],
                },
              ]}
            />
          );
        }
        return null;
      })}

      {/* Stars */}
      {stars.map((star) => (
        <AnimatedStar
          key={star.id}
          star={star}
          color={starColor}
        />
      ))}
    </View>
  );
});

interface AnimatedStarProps {
  star: Star;
  color: string;
}

const AnimatedStar: React.FC<AnimatedStarProps> = memo(({ star, color }) => {
  const opacity = useSharedValue(0.3);
  const scale = useSharedValue(0.5);

  React.useEffect(() => {
    // Twinkling effect
    opacity.value = withDelay(
      star.delay,
      withRepeat(
        withTiming(1, {
          duration: star.duration,
        }),
        -1,
        true
      )
    );

    // Gentle pulsing
    scale.value = withDelay(
      star.delay * 0.5,
      withRepeat(
        withTiming(1.2, {
          duration: star.duration * 1.5,
        }),
        -1,
        true
      )
    );
  }, [star, opacity, scale]);

  const animatedStyle = useAnimatedStyle(() => {
    const currentOpacity = interpolate(opacity.value, [0.3, 1], [0.3, 0.9]);

    return {
      opacity: currentOpacity,
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: star.x - star.size / 2,
          top: star.y - star.size / 2,
          width: star.size,
          height: star.size,
          backgroundColor: color,
          borderRadius: star.size / 2,
        },
        animatedStyle,
      ]}
    />
  );
});

const styles = StyleSheet.create({
  connectionLine: {
    position: 'absolute',
    height: 1,
    opacity: 0.5,
  },
});

ConstellationAnimation.displayName = 'ConstellationAnimation';
AnimatedStar.displayName = 'AnimatedStar';

export default ConstellationAnimation;