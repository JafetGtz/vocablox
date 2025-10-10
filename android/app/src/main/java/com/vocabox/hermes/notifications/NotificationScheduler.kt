package com.vocabox.hermes.notifications

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import android.util.Log
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableMap
import java.text.SimpleDateFormat
import java.util.*

class NotificationScheduler(private val context: Context) {

    private val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
    private val wordsStore = WordsDataStore(context)
    private val TAG = "NotificationScheduler"
    private val DAYS_TO_SCHEDULE = 14 // 2 semanas

    /**
     * Agenda notificaciones para los próximos 14 días
     * Cada día puede tener múltiples ventanas (morning, afternoon, evening)
     */
    fun scheduleTwoWeeksNotifications(
        activeWindows: List<String>,
        windowTimes: Map<String, String>,
        categories: List<String>,
        wordsPerBurst: Int,
        nickname: String
    ) {
        Log.d(TAG, "Scheduling notifications for $DAYS_TO_SCHEDULE days")
        Log.d(TAG, "Active windows: $activeWindows")
        Log.d(TAG, "Window times: $windowTimes")

        // Cancelar todas las notificaciones anteriores
        cancelAllNotifications()

        val now = Calendar.getInstance()
        var totalScheduled = 0

        // Para cada día de las próximas 2 semanas
        for (dayOffset in 0 until DAYS_TO_SCHEDULE) {
            // Para cada ventana activa (morning, afternoon, evening)
            activeWindows.forEach { window ->
                val timeStr = windowTimes[window]
                if (timeStr != null) {
                    val (hour, minute) = timeStr.split(":").map { it.toInt() }

                    // Calcular el timestamp para este día + ventana
                    val calendar = Calendar.getInstance().apply {
                        set(Calendar.HOUR_OF_DAY, hour)
                        set(Calendar.MINUTE, minute)
                        set(Calendar.SECOND, 0)
                        set(Calendar.MILLISECOND, 0)
                        add(Calendar.DAY_OF_YEAR, dayOffset)
                    }

                    // Solo programar si es en el futuro
                    if (calendar.timeInMillis > now.timeInMillis) {
                        // ID único: combinación de ventana + día
                        val uniqueId = "${window}_day${dayOffset}".hashCode()

                        scheduleExactAlarm(
                            notificationId = uniqueId,
                            window = window,
                            hour = hour,
                            minute = minute,
                            categories = categories,
                            wordsPerBurst = wordsPerBurst,
                            nickname = nickname,
                            dayOffset = dayOffset,
                            triggerTime = calendar.timeInMillis
                        )

                        totalScheduled++
                    }
                }
            }
        }

        // Guardar timestamp de cuándo se programaron estas notificaciones
        wordsStore.saveLastScheduledDate(System.currentTimeMillis())

        Log.d(TAG, "✅ Successfully scheduled $totalScheduled notifications for 14 days")
    }

    /**
     * Verifica si necesita reprogramar (si ya pasaron 14 días desde la última vez)
     */
    fun needsRescheduling(): Boolean {
        val lastScheduled = wordsStore.getLastScheduledDate()
        if (lastScheduled == 0L) {
            Log.d(TAG, "No previous schedule found, needs scheduling")
            return true
        }

        val daysSinceLastSchedule = (System.currentTimeMillis() - lastScheduled) / (1000 * 60 * 60 * 24)
        val needsReschedule = daysSinceLastSchedule >= DAYS_TO_SCHEDULE

        Log.d(TAG, "Days since last schedule: $daysSinceLastSchedule, needs reschedule: $needsReschedule")
        return needsReschedule
    }

    private fun scheduleExactAlarm(
        notificationId: Int,
        window: String,
        hour: Int,
        minute: Int,
        categories: List<String>,
        wordsPerBurst: Int,
        nickname: String,
        dayOffset: Int,
        triggerTime: Long
    ) {
        val intent = Intent(context, NotificationReceiver::class.java).apply {
            action = "com.vocabox.hermes.SHOW_NOTIFICATION"
            putExtra("notification_id", notificationId)
            putExtra("window", window)
            putExtra("hour", hour)
            putExtra("minute", minute)
            putExtra("categories", categories.toTypedArray())
            putExtra("words_per_burst", wordsPerBurst)
            putExtra("nickname", nickname)
            putExtra("day_offset", dayOffset)
        }

        val pendingIntent = PendingIntent.getBroadcast(
            context,
            notificationId,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        // setExactAndAllowWhileIdle para ignorar Doze mode
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            alarmManager.setExactAndAllowWhileIdle(
                AlarmManager.RTC_WAKEUP,
                triggerTime,
                pendingIntent
            )
        } else {
            alarmManager.setExact(
                AlarmManager.RTC_WAKEUP,
                triggerTime,
                pendingIntent
            )
        }

        val calendar = Calendar.getInstance().apply { timeInMillis = triggerTime }
        Log.d(TAG, "Scheduled: $window Day+$dayOffset at $hour:$minute -> ${calendar.time} (ID: $notificationId)")
    }

    fun cancelAllNotifications() {
        Log.d(TAG, "Cancelling all scheduled notifications")

        val windows = listOf("morning", "afternoon", "evening")
        var cancelledCount = 0

        // Cancelar todos los días (0 a 13) para todas las ventanas
        for (dayOffset in 0 until DAYS_TO_SCHEDULE) {
            windows.forEach { window ->
                val uniqueId = "${window}_day${dayOffset}".hashCode()
                val intent = Intent(context, NotificationReceiver::class.java)
                val pendingIntent = PendingIntent.getBroadcast(
                    context,
                    uniqueId,
                    intent,
                    PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
                )
                alarmManager.cancel(pendingIntent)
                pendingIntent.cancel()
                cancelledCount++
            }
        }

        Log.d(TAG, "Cancelled $cancelledCount alarms")
    }

    /**
     * Obtiene la lista de notificaciones agendadas para las próximas 2 semanas
     */
    fun getScheduledNotifications(): WritableArray {
        val scheduledArray = Arguments.createArray()
        val activeWindows = wordsStore.getActiveWindows()
        val windowTimes = wordsStore.getWindowTimes()
        val now = Calendar.getInstance()
        val dateFormat = SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.getDefault())

        for (dayOffset in 0 until DAYS_TO_SCHEDULE) {
            activeWindows.forEach { window ->
                val timeStr = windowTimes[window]
                if (timeStr != null) {
                    val (hour, minute) = timeStr.split(":").map { it.toInt() }

                    val calendar = Calendar.getInstance().apply {
                        set(Calendar.HOUR_OF_DAY, hour)
                        set(Calendar.MINUTE, minute)
                        set(Calendar.SECOND, 0)
                        set(Calendar.MILLISECOND, 0)
                        add(Calendar.DAY_OF_YEAR, dayOffset)
                    }

                    // Solo incluir si es en el futuro
                    if (calendar.timeInMillis > now.timeInMillis) {
                        val uniqueId = "${window}_day${dayOffset}".hashCode()

                        val notifMap: WritableMap = Arguments.createMap()
                        notifMap.putInt("id", uniqueId)
                        notifMap.putString("window", window)
                        notifMap.putInt("dayOffset", dayOffset)
                        notifMap.putString("time", "$hour:${minute.toString().padStart(2, '0')}")
                        notifMap.putString("dateTime", dateFormat.format(calendar.time))
                        notifMap.putDouble("timestamp", calendar.timeInMillis.toDouble())

                        scheduledArray.pushMap(notifMap)
                    }
                }
            }
        }

        Log.d(TAG, "Found ${scheduledArray.size()} scheduled notifications")
        return scheduledArray
    }
}
