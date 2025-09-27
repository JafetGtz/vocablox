import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

interface HintBarProps {
  meaning?: string;
  example?: string;
  showMeaning: boolean;
  showExample: boolean;
  canUseMeaning: boolean;
  canUseExample: boolean;
  canUseReveal: boolean;
  onUseMeaning: () => void;
  onUseExample: () => void;
  onUseReveal: () => void;
}

export default function HintBar({
  meaning,
  example,
  showMeaning,
  showExample,
  canUseMeaning,
  canUseExample,
  canUseReveal,
  onUseMeaning,
  onUseExample,
  onUseReveal
}: HintBarProps) {
  return (
    <View style={styles.container}>
      {showMeaning && meaning && (
        <View style={styles.hintContainer}>
          <View style={styles.hintHeader}>
            <Icon name="info" size={16} color="#666" />
            <Text style={styles.hintLabel}>Significado:</Text>
          </View>
          <Text style={styles.hintText}>{meaning}</Text>
        </View>
      )}

      {showExample && example && (
        <View style={styles.hintContainer}>
          <View style={styles.hintHeader}>
            <Icon name="book-open" size={16} color="#666" />
            <Text style={styles.hintLabel}>Ejemplo:</Text>
          </View>
          <Text style={styles.hintText}>{example}</Text>
        </View>
      )}

      <View style={styles.hintsButtonsContainer}>
        <TouchableOpacity
          style={[styles.hintButton, !canUseMeaning && styles.disabledButton]}
          onPress={onUseMeaning}
          disabled={!canUseMeaning}
        >
          <Icon
            name="info"
            size={18}
            color={canUseMeaning ? '#666' : '#ccc'}
          />
          <Text style={[styles.hintButtonText, !canUseMeaning && styles.disabledButtonText]}>
            Significado
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.hintButton, !canUseExample && styles.disabledButton]}
          onPress={onUseExample}
          disabled={!canUseExample}
        >
          <Icon
            name="book-open"
            size={18}
            color={canUseExample ? '#666' : '#ccc'}
          />
          <Text style={[styles.hintButtonText, !canUseExample && styles.disabledButtonText]}>
            Ejemplo
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.hintButton, !canUseReveal && styles.disabledButton]}
          onPress={onUseReveal}
          disabled={!canUseReveal}
        >
          <Icon
            name="eye"
            size={18}
            color={canUseReveal ? '#666' : '#ccc'}
          />
          <Text style={[styles.hintButtonText, !canUseReveal && styles.disabledButtonText]}>
            Revelar
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  hintContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  hintHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  hintLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  hintText: {
    fontSize: 16,
    color: '#444',
    lineHeight: 22,
  },
  hintsButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 8,
    marginTop: 10,
  },
  hintButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 8,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  disabledButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    shadowOpacity: 0,
    elevation: 0,
  },
  hintButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  disabledButtonText: {
    color: '#ccc',
  },
});