import React, { memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { BgAnimationType } from '../types';

interface FocusSettingsProps {
  order: 'random' | 'fixed';
  onOrderChange: (order: 'random' | 'fixed') => void;
  bgAnimation?: BgAnimationType;
  onBgAnimationChange?: (animation: BgAnimationType) => void;
}

const FocusSettings: React.FC<FocusSettingsProps> = memo(({
  order,
  onOrderChange,
  bgAnimation = 'particles',
  onBgAnimationChange,
}) => {
  const animationOptions: { id: BgAnimationType; name: string; icon: string; description: string }[] = [
    { id: 'particles', name: 'Partículas', icon: '✨', description: 'Partículas flotantes de colores' },
    { id: 'waves', name: 'Ondas', icon: '🌊', description: 'Ondas concéntricas suaves' },
    { id: 'gradient', name: 'Gradiente', icon: '🌈', description: 'Transiciones de color fluidas' },
    { id: 'breathing', name: 'Respiración', icon: '🫁', description: 'Animación de respiración calmante' },
    { id: 'constellation', name: 'Constelación', icon: '⭐', description: 'Estrellas conectadas' },
    { id: 'minimal', name: 'Mínimal', icon: '⚬', description: 'Animación sutil y limpia' },
    { id: 'none', name: 'Sin animación', icon: '🚫', description: 'Fondo estático' },
  ];
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Configuración de la Sesión</Text>

      {/* Word Order Setting */}
      <View style={styles.settingItem}>
        <View style={styles.settingHeader}>
          <Text style={styles.settingLabel}>Orden de las Palabras</Text>
          <Text style={styles.settingDescription}>
            Cómo se presentarán las palabras durante la sesión
          </Text>
        </View>

        <View style={styles.orderToggle}>
          <TouchableOpacity
            style={[
              styles.orderButton,
              order === 'random' && styles.orderButtonActive
            ]}
            onPress={() => onOrderChange('random')}
          >
            <Text style={[
              styles.orderButtonText,
              order === 'random' && styles.orderButtonTextActive
            ]}>
              🎲 Aleatorio
            </Text>
            <Text style={[
              styles.orderButtonSubtext,
              order === 'random' && styles.orderButtonSubtextActive
            ]}>
              Orden mezclado
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.orderButton,
              order === 'fixed' && styles.orderButtonActive
            ]}
            onPress={() => onOrderChange('fixed')}
          >
            <Text style={[
              styles.orderButtonText,
              order === 'fixed' && styles.orderButtonTextActive
            ]}>
              📋 Secuencial
            </Text>
            <Text style={[
              styles.orderButtonSubtext,
              order === 'fixed' && styles.orderButtonSubtextActive
            ]}>
              Orden original
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Background Animation Setting */}
      {onBgAnimationChange && (
        <View style={styles.settingItem}>
          <View style={styles.settingHeader}>
            <Text style={styles.settingLabel}>Animación de Fondo</Text>
            <Text style={styles.settingDescription}>
              Elige la animación que te ayude a concentrarte mejor
            </Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.animationScroll}
            contentContainerStyle={styles.animationScrollContent}
          >
            {animationOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.animationButton,
                  bgAnimation === option.id && styles.animationButtonActive
                ]}
                onPress={() => onBgAnimationChange(option.id)}
              >
                <Text style={[
                  styles.animationIcon,
                  bgAnimation === option.id && styles.animationIconActive
                ]}>
                  {option.icon}
                </Text>
                <Text style={[
                  styles.animationName,
                  bgAnimation === option.id && styles.animationNameActive
                ]}>
                  {option.name}
                </Text>
                <Text style={[
                  styles.animationDescription,
                  bgAnimation === option.id && styles.animationDescriptionActive
                ]}>
                  {option.description}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Session Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>Información de la Sesión</Text>
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Countdown</Text>
            <Text style={styles.infoValue}>5 segundos</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Por palabra</Text>
            <Text style={styles.infoValue}>10 segundos</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Música</Text>
            <Text style={styles.infoValue}>Ambiente</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Pausable</Text>
            <Text style={styles.infoValue}>Sí</Text>
          </View>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 16,
  },
  settingItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  settingHeader: {
    marginBottom: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#666666',
  },
  orderToggle: {
    flexDirection: 'row',
    gap: 12,
  },
  orderButton: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    borderWidth: 2,
    borderColor: '#E5E5E5',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
  },
  orderButtonActive: {
    backgroundColor: '#F3E8FF',
    borderColor: '#9D4EDD',
  },
  orderButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
    marginBottom: 4,
  },
  orderButtonTextActive: {
    color: '#9D4EDD',
  },
  orderButtonSubtext: {
    fontSize: 12,
    color: '#999999',
  },
  orderButtonSubtextActive: {
    color: '#9D4EDD',
  },
  infoContainer: {
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#22C55E',
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  infoItem: {
    flex: 1,
    minWidth: '45%',
  },
  infoLabel: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
  },
  animationScroll: {
    maxHeight: 120,
  },
  animationScrollContent: {
    paddingRight: 16,
  },
  animationButton: {
    backgroundColor: '#F8F9FA',
    borderWidth: 2,
    borderColor: '#E5E5E5',
    borderRadius: 10,
    padding: 12,
    marginRight: 12,
    alignItems: 'center',
    minWidth: 100,
    maxWidth: 120,
  },
  animationButtonActive: {
    backgroundColor: '#F3E8FF',
    borderColor: '#9D4EDD',
  },
  animationIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  animationIconActive: {
    // No specific style change needed for active icon
  },
  animationName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666666',
    marginBottom: 2,
    textAlign: 'center',
  },
  animationNameActive: {
    color: '#9D4EDD',
  },
  animationDescription: {
    fontSize: 10,
    color: '#999999',
    textAlign: 'center',
    lineHeight: 12,
  },
  animationDescriptionActive: {
    color: '#9D4EDD',
  },
});

FocusSettings.displayName = 'FocusSettings';

export default FocusSettings;