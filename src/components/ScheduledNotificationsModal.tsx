import React, { useEffect, useState } from 'react'
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native'
import Icon from 'react-native-vector-icons/Feather'
import NotificationModule from '@/services/notificationService'

interface ScheduledNotification {
  id: number
  window: string
  dayOffset: number
  time: string
  dateTime: string
  timestamp: number
}

interface Props {
  visible: boolean
  onClose: () => void
}

const windowLabels: Record<string, string> = {
  morning: '🌅 Mañana',
  afternoon: '☀️ Tarde',
  evening: '🌙 Noche',
}

export default function ScheduledNotificationsModal({ visible, onClose }: Props) {
  const [notifications, setNotifications] = useState<ScheduledNotification[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (visible) {
      loadNotifications()
    }
  }, [visible])

  const loadNotifications = async () => {
    setLoading(true)
    setError(null)
    try {
      const scheduled = await NotificationModule.getScheduledNotifications()
      console.log(scheduled)
      setNotifications(scheduled)
    } catch (err) {
      console.error('Error loading scheduled notifications:', err)
      setError('No se pudieron cargar las notificaciones')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateTimeStr: string) => {
    const date = new Date(dateTimeStr)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const isToday = date.toDateString() === today.toDateString()
    const isTomorrow = date.toDateString() === tomorrow.toDateString()

    if (isToday) return 'Hoy'
    if (isTomorrow) return 'Mañana'

    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    }
    return date.toLocaleDateString('es-ES', options)
  }

  // Agrupar por día
  const groupedByDate = notifications.reduce((acc, notif) => {
    const date = notif.dateTime.split(' ')[0]
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(notif)
    return acc
  }, {} as Record<string, ScheduledNotification[]>)

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Notificaciones Programadas</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="x" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#9B59B6" />
              <Text style={styles.loadingText}>Cargando notificaciones...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Icon name="alert-circle" size={48} color="#E74C3C" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : notifications.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Icon name="bell-off" size={48} color="#999" />
              <Text style={styles.emptyText}>No hay notificaciones programadas</Text>
            </View>
          ) : (
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
              <View style={styles.summary}>
                <Text style={styles.summaryText}>
                  📅 Total: {notifications.length} notificaciones
                </Text>
                <Text style={styles.summarySubtext}>
                  Próximas 2 semanas
                </Text>
              </View>

              {Object.entries(groupedByDate).map(([date, notifs]) => (
                <View key={date} style={styles.dateGroup}>
                  <Text style={styles.dateHeader}>
                    {formatDate(notifs[0].dateTime)}
                  </Text>
                  {notifs.map((notif) => (
                    <View key={notif.id} style={styles.notificationCard}>
                      <View style={styles.notifContent}>
                        <Text style={styles.windowLabel}>
                          {windowLabels[notif.window] || notif.window}
                        </Text>
                        <Text style={styles.timeLabel}>{notif.time}</Text>
                      </View>
                      <Text style={styles.dayOffset}>Día +{notif.dayOffset}</Text>
                    </View>
                  ))}
                </View>
              ))}

              <View style={styles.footer}>
                <Text style={styles.footerText}>
                  ✅ Todas las notificaciones están agendadas con alarmas exactas
                </Text>
              </View>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  summary: {
    backgroundColor: 'rgba(155, 89, 182, 0.1)',
    padding: 16,
    margin: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  summaryText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#9B59B6',
    marginBottom: 4,
  },
  summarySubtext: {
    fontSize: 14,
    color: '#666',
  },
  dateGroup: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  dateHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 12,
    textTransform: 'capitalize',
  },
  notificationCard: {
    backgroundColor: '#F8F8F8',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  notifContent: {
    flex: 1,
  },
  windowLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  timeLabel: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'monospace',
  },
  dayOffset: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: '#E74C3C',
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#999',
  },
  footer: {
    marginTop: 20,
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  footerText: {
    fontSize: 14,
    color: '#27AE60',
    textAlign: 'center',
    lineHeight: 20,
  },
})
