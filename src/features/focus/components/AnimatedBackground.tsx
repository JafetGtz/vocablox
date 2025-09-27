import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { BgAnimationType } from '../types';
import ParticlesAnimation from './animations/ParticlesAnimation';
import WavesAnimation from './animations/WavesAnimation';
import GradientAnimation from './animations/GradientAnimation';
import BreathingAnimation from './animations/BreathingAnimation';
import ConstellationAnimation from './animations/ConstellationAnimation';
import MinimalAnimation from './animations/MinimalAnimation';

interface AnimatedBackgroundProps {
  type: BgAnimationType;
  tint?: 'blue' | 'purple' | 'green';
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = memo(({ type, tint = 'blue' }) => {
  const renderAnimation = () => {
    switch (type) {
      case 'particles':
        return <ParticlesAnimation tint={tint} />;
      case 'waves':
        return <WavesAnimation tint={tint} />;
      case 'gradient':
        return <GradientAnimation tint={tint} />;
      case 'breathing':
        return <BreathingAnimation tint={tint} />;
      case 'constellation':
        return <ConstellationAnimation tint={tint} />;
      case 'minimal':
        return <MinimalAnimation tint={tint} />;
      case 'none':
      default:
        return null;
    }
  };

  return (
    <View style={StyleSheet.absoluteFillObject}>
      {renderAnimation()}
    </View>
  );
});

AnimatedBackground.displayName = 'AnimatedBackground';

export default AnimatedBackground;