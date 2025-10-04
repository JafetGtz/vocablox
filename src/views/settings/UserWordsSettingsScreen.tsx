import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Switch,
} from 'react-native'
import Icon from 'react-native-vector-icons/Feather'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { AppStackParamList } from '@/navigation/AppStackNavigator'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import {
  selectUserWordsEnabled,
  selectUserWordsCount,
  selectUserWordsFrequency
} from '@/features/userWords/selectors'
import {
  toggleUserWordsEnabled,
  setUserWordsFrequency
} from '@/features/userWords/userWordsSlice'

type UserWordsSettingsNavigationProp = NativeStackNavigationProp<AppStackParamList, 'UserWordsSettings'>

const FREQUENCY_LEVELS = [
  { value: 1, label: 'Normal' },
  { value: 2, label: 'Alto' },
  { value: 3, label: 'Muy alto' }
]

export default function UserWordsSettingsScreen() {
  const navigation = useNavigation<UserWordsSettingsNavigationProp>()
  const dispatch = useAppDispatch()
  const userWordsEnabled = useAppSelector(selectUserWordsEnabled)
  const userWordsCount = useAppSelector(selectUserWordsCount)
  const userWordsFrequency = useAppSelector(selectUserWordsFrequency)

  console.log('Current userWordsFrequency:', userWordsFrequency)

  const handleToggleUserWords = (value: boolean) => {
    dispatch(toggleUserWordsEnabled())
  }

  const handleFrequencyChange = (value: number) => {
    const roundedValue = Math.round(value)
    console.log('Frequency changed to:', roundedValue)
    dispatch(setUserWordsFrequency(roundedValue))
  }

  const getCurrentFrequencyLabel = () => {
    const level = FREQUENCY_LEVELS.find(level => level.value === userWordsFrequency)
    return level ? level.label : 'Normal'
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Configuración de mis palabras</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Estadísticas */}
        <View style={styles.statsCard}>
          <View style={styles.statsHeader}>
            <Icon name="book-open" size={24} color="#9B59B6" />
            <Text style={styles.statsTitle}>Resumen</Text>
          </View>
          <View style={styles.statsContent}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userWordsCount}</Text>
              <Text style={styles.statLabel}>
                {userWordsCount === 1 ? 'Palabra personal' : 'Palabras personales'}
              </Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {userWordsEnabled ? 'Activas' : 'Inactivas'}
              </Text>
              <Text style={styles.statLabel}>En el Home</Text>
            </View>
          </View>
        </View>

        {/* Toggle para activar/desactivar */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Visibilidad</Text>
          <View style={styles.optionCard}>
            <View style={styles.optionContent}>
              <View style={styles.optionIcon}>
                <Icon name="home" size={20} color="#9B59B6" />
              </View>
              <View style={styles.optionText}>
                <Text style={styles.optionTitle}>Mostrar en Home</Text>
                <Text style={styles.optionSubtitle}>
                  {userWordsEnabled
                    ? 'Tus palabras aparecen mezcladas con las categorías'
                    : 'Tus palabras no aparecen en la pantalla principal'
                  }
                </Text>
              </View>
              <Switch
                value={userWordsEnabled}
                onValueChange={handleToggleUserWords}
                trackColor={{ false: '#E0E0E0', true: 'rgba(155, 89, 182, 0.3)' }}
                thumbColor={userWordsEnabled ? '#9B59B6' : '#FFF'}
                ios_backgroundColor="#E0E0E0"
                disabled={userWordsCount === 0}
              />
            </View>
            {userWordsCount === 0 && (
              <View style={styles.warningContainer}>
                <Icon name="info" size={16} color="#FF9500" />
                <Text style={styles.warningText}>
                  Agrega palabras personales para activar esta opción
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Slider para frecuencia */}
        {userWordsEnabled && userWordsCount > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Frecuencia de aparición</Text>
            <View style={styles.frequencySelector}>
              <Text style={styles.frequencySelectorTitle}>
                Nivel actual: {getCurrentFrequencyLabel()}
              </Text>
              <Text style={styles.frequencySelectorSubtitle}>
                Selecciona qué tan seguido aparecen tus palabras
              </Text>

              <View style={styles.frequencyOptions}>
                {FREQUENCY_LEVELS.map((level) => (
                  <TouchableOpacity
                    key={level.value}
                    style={[
                      styles.frequencyOption,
                      userWordsFrequency === level.value && styles.frequencyOptionSelected
                    ]}
                    onPress={() => handleFrequencyChange(level.value)}
                  >
                    <Text style={[
                      styles.frequencyOptionText,
                      userWordsFrequency === level.value && styles.frequencyOptionTextSelected
                    ]}>
                      {level.label}
                    </Text>
                    <Text style={[
                      styles.frequencyOptionDescription,
                      userWordsFrequency === level.value && styles.frequencyOptionDescriptionSelected
                    ]}>
                      {level.value === 1 ? 'Cada 10 palabras' : level.value === 2 ? 'Cada 5 palabras' : 'Cada 2 palabras'}
                    </Text>
                    {userWordsFrequency === level.value && (
                      <View style={styles.selectedIndicator}>
                        <Icon name="check" size={16} color="#FFF" />
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.frequencyDescription}>
              <Icon name="info" size={14} color="#666" />
              <Text style={styles.frequencyDescriptionText}>
                Esta configuración controla cada cuántas palabras de categorías aparece una de tus palabras personales.
                Las palabras de categorías mantienen su orden normal.
              </Text>
            </View>
          </View>
        )}

        {/* Acceso directo a Mis Palabras */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gestionar palabras</Text>
          <TouchableOpacity
            style={styles.optionCard}
            onPress={() => navigation.navigate('UserWords')}
          >
            <View style={styles.optionContent}>
              <View style={styles.optionIcon}>
                <Icon name="edit-3" size={20} color="#9B59B6" />
              </View>
              <View style={styles.optionText}>
                <Text style={styles.optionTitle}>Mis Palabras</Text>
                <Text style={styles.optionSubtitle}>
                  Ver, editar y agregar nuevas palabras personales
                </Text>
              </View>
              <Icon name="chevron-right" size={20} color="#CCC" />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingTop: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  statsCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 12,
  },
  statsContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#9B59B6',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 20,
  },
  optionCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(155, 89, 182, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  optionSubtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 8,
  },
  warningText: {
    fontSize: 14,
    color: '#FF9500',
    marginLeft: 8,
    flex: 1,
  },
  frequencySelector: {
    backgroundColor: '#FFF',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  frequencySelectorTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
    textAlign: 'center',
  },
  frequencySelectorSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  frequencyOptions: {
    gap: 12,
  },
  frequencyOption: {
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e9ecef',
    padding: 16,
    backgroundColor: '#f8f9fa',
    position: 'relative',
  },
  frequencyOptionSelected: {
    borderColor: '#9B59B6',
    backgroundColor: '#f0f2ff',
  },
  frequencyOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  frequencyOptionTextSelected: {
    color: '#9B59B6',
  },
  frequencyOptionDescription: {
    fontSize: 14,
    color: '#666',
  },
  frequencyOptionDescriptionSelected: {
    color: '#555',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#9B59B6',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  frequencyDescription: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  frequencyDescriptionText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
    flex: 1,
    lineHeight: 16,
  },
})