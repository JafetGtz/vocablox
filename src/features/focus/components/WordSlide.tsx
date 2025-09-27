import React, { memo, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { useSelector } from 'react-redux';
import { selectCurrentItem, selectFocusState } from '../focusSelectors';

const WordSlide: React.FC = memo(() => {
  const currentItem = useSelector(selectCurrentItem);
  const { currentIndex } = useSelector(selectFocusState);
  const opacity = useSharedValue(0);
  const [previousIndex, setPreviousIndex] = useState(currentIndex);

  // Handle fade transitions when word changes
  useEffect(() => {
    if (currentIndex !== previousIndex) {
      // Fade out first, then fade in
      opacity.value = withTiming(0, { duration: 200 }, () => {
        // After fade out, update the previous index and fade in
        runOnJS(setPreviousIndex)(currentIndex);
        opacity.value = withTiming(1, { duration: 300 });
      });
    } else {
      // Initial fade in
      opacity.value = withTiming(1, { duration: 300 });
    }
  }, [currentIndex, previousIndex, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  if (!currentItem) {
    return (
      <Animated.View style={[styles.container, animatedStyle]}>
        <Text style={styles.errorText}>
          No hay palabras para mostrar
        </Text>
      </Animated.View>
    );
  }

  const { word, meaning, category } = currentItem;

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      {/* Category indicator */}
      <Text style={styles.categoryText}>
        {category}
      </Text>

      {/* Main word */}
      <View style={styles.wordContainer}>
        <Text style={styles.wordText}>
          {word}
        </Text>
      </View>

      {/* Meaning */}
      <View style={styles.meaningContainer}>
        <Text
          style={styles.meaningText}
          numberOfLines={5}
          ellipsizeMode="tail"
        >
          {meaning}
        </Text>
      </View>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    backgroundColor: 'transparent',
  },
  categoryText: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.7,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 20,
    textAlign: 'center',
  },
  wordContainer: {
    marginVertical: 30,
    paddingHorizontal: 20,
  },
  wordText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 56,
  },
  meaningContainer: {
    maxWidth: '90%',
    marginTop: 20,
  },
  meaningText: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 26,
    opacity: 0.9,
  },
  errorText: {
    fontSize: 20,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.7,
  },
});

WordSlide.displayName = 'WordSlide';

export default WordSlide;