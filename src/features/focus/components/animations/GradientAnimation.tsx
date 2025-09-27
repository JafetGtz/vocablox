import React, { memo, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';

interface GradientAnimationProps {
  tint?: 'blue' | 'purple' | 'green';
}

const GradientAnimation: React.FC<GradientAnimationProps> = memo(({ tint = 'blue' }) => {
  const colorProgress = useSharedValue(0);

  // Color sets for gradient transitions
  const gradientColors = useMemo(() => {
    switch (tint) {
      case 'purple':
        return {
          colors1: ['rgba(79, 70, 229, 0.3)', 'rgba(147, 51, 234, 0.2)', 'rgba(168, 85, 247, 0.1)'],
          colors2: ['rgba(147, 51, 234, 0.3)', 'rgba(168, 85, 247, 0.2)', 'rgba(196, 181, 253, 0.1)'],
          colors3: ['rgba(168, 85, 247, 0.3)', 'rgba(196, 181, 253, 0.2)', 'rgba(221, 214, 254, 0.1)'],
        };
      case 'green':
        return {
          colors1: ['rgba(5, 150, 105, 0.3)', 'rgba(34, 197, 94, 0.2)', 'rgba(74, 222, 128, 0.1)'],
          colors2: ['rgba(34, 197, 94, 0.3)', 'rgba(74, 222, 128, 0.2)', 'rgba(134, 239, 172, 0.1)'],
          colors3: ['rgba(74, 222, 128, 0.3)', 'rgba(134, 239, 172, 0.2)', 'rgba(187, 247, 208, 0.1)'],
        };
      case 'blue':
      default:
        return {
          colors1: ['rgba(30, 64, 175, 0.3)', 'rgba(59, 130, 246, 0.2)', 'rgba(96, 165, 250, 0.1)'],
          colors2: ['rgba(59, 130, 246, 0.3)', 'rgba(96, 165, 250, 0.2)', 'rgba(147, 197, 253, 0.1)'],
          colors3: ['rgba(96, 165, 250, 0.3)', 'rgba(147, 197, 253, 0.2)', 'rgba(191, 219, 254, 0.1)'],
        };
    }
  }, [tint]);

  React.useEffect(() => {
    colorProgress.value = withRepeat(
      withTiming(2, {
        duration: 12000, // Slow, peaceful transition
      }),
      -1,
      true
    );
  }, [colorProgress]);

  const animatedStyle1 = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      colorProgress.value,
      [0, 1, 2],
      [gradientColors.colors1[0], gradientColors.colors2[0], gradientColors.colors3[0]]
    );

    return {
      backgroundColor,
    };
  });

  const animatedStyle2 = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      colorProgress.value,
      [0, 1, 2],
      [gradientColors.colors1[1], gradientColors.colors2[1], gradientColors.colors3[1]]
    );

    return {
      backgroundColor,
    };
  });

  const animatedStyle3 = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      colorProgress.value,
      [0, 1, 2],
      [gradientColors.colors1[2], gradientColors.colors2[2], gradientColors.colors3[2]]
    );

    return {
      backgroundColor,
    };
  });

  return (
    <View style={StyleSheet.absoluteFillObject}>
      <Animated.View style={[styles.layer, styles.layer1, animatedStyle1]} />
      <Animated.View style={[styles.layer, styles.layer2, animatedStyle2]} />
      <Animated.View style={[styles.layer, styles.layer3, animatedStyle3]} />
    </View>
  );
});

const styles = StyleSheet.create({
  layer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  layer1: {
    top: 0,
    height: '60%',
  },
  layer2: {
    top: '30%',
    height: '50%',
  },
  layer3: {
    top: '60%',
    height: '40%',
  },
});

GradientAnimation.displayName = 'GradientAnimation';

export default GradientAnimation;