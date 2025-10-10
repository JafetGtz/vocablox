import React, { useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Platform,
  NativeModules,
  AppState,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const { PermissionsModule } = NativeModules;

interface PermissionsModalProps {
  visible: boolean;
  onClose: () => void;
  batteryOptimizationEnabled: boolean;
  notificationsEnabled: boolean;
  onPermissionsChanged: () => void;
}

const PermissionsModal: React.FC<PermissionsModalProps> = ({
  visible,
  onClose,
  batteryOptimizationEnabled,
  notificationsEnabled,
  onPermissionsChanged,
}) => {
  // Listen for app state changes to revalidate permissions when user returns from settings
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active' && visible) {
        console.log('📲 App became active - revalidating permissions');
        onPermissionsChanged();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [visible, onPermissionsChanged]);

  const handleBatteryPress = () => {
    if (Platform.OS === 'android' && PermissionsModule) {
      PermissionsModule.openBatterySettings();
    }
  };

  const handleNotificationsPress = () => {
    if (Platform.OS === 'android' && PermissionsModule) {
      PermissionsModule.openNotificationSettings();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => {
        // Prevent closing modal with back button if notifications are not enabled
        if (notificationsEnabled) {
          onClose();
        }
      }}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Icon name="settings-outline" size={48} color="#9B59B6" />
            <Text style={styles.title}>Permisos Necesarios</Text>
            <Text style={styles.subtitle}>
              Para una mejor experiencia, activa estos permisos
            </Text>
          </View>

          {/* Content */}
          <View style={styles.content}>
            {/* Battery Optimization */}
            <TouchableOpacity
              style={styles.permissionItem}
              onPress={handleBatteryPress}
              activeOpacity={0.7}>
              <View style={styles.permissionInfo}>
                <View style={styles.iconContainer}>
                  <Icon name="battery-charging-outline" size={28} color="#9B59B6" />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.permissionTitle}>Optimización de Batería</Text>
                  <Text style={styles.permissionDescription}>
                    {batteryOptimizationEnabled
                      ? 'Desactívala para recibir notificaciones a tiempo. No afectará tu batería.'
                      : 'Optimización desactivada correctamente'}
                  </Text>
                </View>
              </View>
              <Switch
                value={!batteryOptimizationEnabled}
                onValueChange={handleBatteryPress}
                trackColor={{ false: '#ccc', true: '#D4A5F5' }}
                thumbColor={!batteryOptimizationEnabled ? '#9B59B6' : '#f4f3f4'}
                ios_backgroundColor="#ccc"
                disabled={true}
              />
            </TouchableOpacity>

            {/* Notifications */}
            <TouchableOpacity
              style={styles.permissionItem}
              onPress={handleNotificationsPress}
              activeOpacity={0.7}>
              <View style={styles.permissionInfo}>
                <View style={styles.iconContainer}>
                  <Icon name="notifications-outline" size={28} color="#9B59B6" />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.permissionTitle}>Notificaciones</Text>
                  <Text style={styles.permissionDescription}>
                    {notificationsEnabled
                      ? 'Las notificaciones están activas'
                      : 'Actívalas para recibir recordatorios'}
                  </Text>
                </View>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={handleNotificationsPress}
                trackColor={{ false: '#ccc', true: '#D4A5F5' }}
                thumbColor={notificationsEnabled ? '#9B59B6' : '#f4f3f4'}
                ios_backgroundColor="#ccc"
                disabled={true}
              />
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <TouchableOpacity
            style={[
              styles.closeButton,
              !notificationsEnabled && styles.closeButtonDisabled
            ]}
            onPress={onClose}
            disabled={!notificationsEnabled}>
            <Text style={[
              styles.closeButtonText,
              !notificationsEnabled && styles.closeButtonTextDisabled
            ]}>
              {notificationsEnabled ? 'Continuar' : 'Activa las notificaciones para continuar'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.footerNote}>
            {notificationsEnabled
              ? 'Podrás cambiar estos ajustes más tarde en la configuración de tu dispositivo'
              : 'Las notificaciones son necesarias para que la app funcione correctamente'}
          </Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: '100%',
    maxWidth: 450,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#7F8C8D',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  content: {
    marginBottom: 24,
  },
  permissionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  permissionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F3E5FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  permissionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 4,
  },
  permissionDescription: {
    fontSize: 13,
    color: '#7F8C8D',
    lineHeight: 18,
  },
  closeButton: {
    backgroundColor: '#9B59B6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#9B59B6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  closeButtonDisabled: {
    backgroundColor: '#BDC3C7',
    shadowColor: '#BDC3C7',
    shadowOpacity: 0.1,
    elevation: 2,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  closeButtonTextDisabled: {
    color: '#ECF0F1',
  },
  footerNote: {
    fontSize: 12,
    color: '#95A5A6',
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: 10,
  },
});

export default PermissionsModal;
