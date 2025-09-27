import React, { useEffect, memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../../navigation/AppStackNavigator';

type NavigationProp = NativeStackNavigationProp<AppStackParamList, 'FocusSelectionScreen'>;

const FocusSetupScreen: React.FC = memo(() => {
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    // Auto redirect to the new selection screen after a brief moment
    const timer = setTimeout(() => {
      navigation.replace('FocusSelectionScreen');
    }, 100);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Configurar Focus</Text>
        </View>

        {/* Loading/Redirecting Content */}
        <View style={styles.centerContent}>
          <Text style={styles.loadingText}>Iniciando configuración...</Text>
          <TouchableOpacity
            style={styles.manualButton}
            onPress={() => navigation.replace('FocusSelectionScreen')}
          >
            <Text style={styles.manualButtonText}>Continuar manualmente</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  backButtonText: {
    fontSize: 24,
    color: '#9D4EDD',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 20,
    textAlign: 'center',
  },
  manualButton: {
    backgroundColor: '#9D4EDD',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  manualButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

FocusSetupScreen.displayName = 'FocusSetupScreen';

export default FocusSetupScreen;