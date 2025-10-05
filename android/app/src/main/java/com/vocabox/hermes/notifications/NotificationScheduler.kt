package com.vocabox.hermes.notifications

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import android.util.Log
import java.util.*

class NotificationScheduler(private val context: Context) {

    private val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
    private val TAG = "NotificationScheduler"

    fun scheduleExactAlarm(
        notificationId: Int,
        window: String,
        hour: Int,
        minute: Int,
        categories: List<String>,
        wordsPerBurst: Int,
        nickname: String
    ) {
        val calendar = Calendar.getInstance().apply {
            set(Calendar.HOUR_OF_DAY, hour)
            set(Calendar.MINUTE, minute)
            set(Calendar.SECOND, 0)
            set(Calendar.MILLISECOND, 0)

            // Si la hora ya pasó hoy, programar para mañana
            if (timeInMillis <= System.currentTimeMillis()) {
                add(Calendar.DAY_OF_YEAR, 1)
            }
        }

        val intent = Intent(context, NotificationReceiver::class.java).apply {
            action = "com.vocabox.hermes.SHOW_NOTIFICATION"
            putExtra("notification_id", notificationId)
            putExtra("window", window)
            putExtra("hour", hour)
            putExtra("minute", minute)
            putExtra("categories", categories.toTypedArray())
            putExtra("words_per_burst", wordsPerBurst)
            putExtra("nickname", nickname)
        }

        val pendingIntent = PendingIntent.getBroadcast(
            context,
            notificationId,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        // setExactAndAllowWhileIdle ignora Doze mode y optimización de batería
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            alarmManager.setExactAndAllowWhileIdle(
                AlarmManager.RTC_WAKEUP,
                calendar.timeInMillis,
                pendingIntent
            )
        } else {
            alarmManager.setExact(
                AlarmManager.RTC_WAKEUP,
                calendar.timeInMillis,
                pendingIntent
            )
        }

        Log.d(TAG, "Scheduled exact alarm for $window at $hour:$minute (ID: $notificationId)")
        Log.d(TAG, "Next trigger: ${calendar.time}")
    }

    fun cancelAllNotifications() {
        val windows = listOf("morning", "afternoon", "evening")

        windows.forEach { window ->
            val notificationId = window.hashCode()
            val intent = Intent(context, NotificationReceiver::class.java)
            val pendingIntent = PendingIntent.getBroadcast(
                context,
                notificationId,
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )
            alarmManager.cancel(pendingIntent)
            pendingIntent.cancel()
            Log.d(TAG, "Cancelled alarm for $window (ID: $notificationId)")
        }
    }
}
