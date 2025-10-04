package com.awesome.notifications

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.Build
import android.util.Log
import java.util.*

class NotificationReceiver : BroadcastReceiver() {

    private val TAG = "NotificationReceiver"

    override fun onReceive(context: Context, intent: Intent) {
        Log.d(TAG, "onReceive triggered: ${intent.action}")

        when (intent.action) {
            "com.awesome.SHOW_NOTIFICATION" -> {
                handleShowNotification(context, intent)
            }
        }
    }

    private fun handleShowNotification(context: Context, intent: Intent) {
        val notificationId = intent.getIntExtra("notification_id", 0)
        val window = intent.getStringExtra("window") ?: "morning"
        val hour = intent.getIntExtra("hour", 8)
        val minute = intent.getIntExtra("minute", 0)
        val categories = intent.getStringArrayExtra("categories")?.toList() ?: emptyList()
        val wordsPerBurst = intent.getIntExtra("words_per_burst", 2)
        val nickname = intent.getStringExtra("nickname") ?: "Usuario"

        Log.d(TAG, "Showing notification for window: $window at $hour:$minute")

        // Obtener palabras del almacenamiento local
        val wordsStore = WordsDataStore(context)
        val availableWords = wordsStore.getWordsByCategories(categories)

        // Seleccionar palabras aleatorias
        val selectedWords = availableWords
            .shuffled()
            .take(wordsPerBurst)

        if (selectedWords.isEmpty()) {
            Log.w(TAG, "No words available for categories: $categories")
            NotificationHelper.showNotification(
                context = context,
                notificationId = notificationId,
                window = window,
                nickname = nickname,
                word = "vocabulary",
                meaning = "vocabulario",
                allWords = emptyList()
            )
        } else {
            val firstWord = selectedWords[0]
            NotificationHelper.showNotification(
                context = context,
                notificationId = notificationId,
                window = window,
                nickname = nickname,
                word = firstWord.word,
                meaning = firstWord.meaning,
                allWords = selectedWords
            )
        }

        // RE-PROGRAMAR la alarma para mañana
        reprogramAlarmForTomorrow(context, intent, notificationId, hour, minute)
    }

    private fun reprogramAlarmForTomorrow(
        context: Context,
        originalIntent: Intent,
        notificationId: Int,
        hour: Int,
        minute: Int
    ) {
        val calendar = Calendar.getInstance().apply {
            add(Calendar.DAY_OF_YEAR, 1)
            set(Calendar.HOUR_OF_DAY, hour)
            set(Calendar.MINUTE, minute)
            set(Calendar.SECOND, 0)
            set(Calendar.MILLISECOND, 0)
        }

        val newIntent = Intent(originalIntent)

        val pendingIntent = PendingIntent.getBroadcast(
            context,
            notificationId,
            newIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager

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

        Log.d(TAG, "Rescheduled alarm for tomorrow at $hour:$minute")
    }
}
