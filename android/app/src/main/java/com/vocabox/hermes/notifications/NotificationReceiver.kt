package com.vocabox.hermes.notifications

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.Build
import android.util.Log
import com.vocabox.hermes.widget.WordWidgetReceiver
import java.util.*

class NotificationReceiver : BroadcastReceiver() {

    private val TAG = "NotificationReceiver"

    override fun onReceive(context: Context, intent: Intent) {
        Log.d(TAG, "onReceive triggered: ${intent.action}")

        when (intent.action) {
            "com.vocabox.hermes.SHOW_NOTIFICATION" -> {
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
        val dayOffset = intent.getIntExtra("day_offset", 0)

        Log.d(TAG, "Showing notification for window: $window at $hour:$minute (Day: $dayOffset)")

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

            // Actualizar widget con palabra de notificación
            val (_, _, currentBackground) = WordWidgetReceiver.getWidgetData(context)
            WordWidgetReceiver.updateWidgetData(context, "vocabulary", "vocabulario", currentBackground)
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

            // Actualizar widget con la palabra de la notificación
            val (_, _, currentBackground) = WordWidgetReceiver.getWidgetData(context)
            WordWidgetReceiver.updateWidgetData(context, firstWord.word, firstWord.meaning, currentBackground)
            Log.d(TAG, "Widget updated with notification word: ${firstWord.word}")
        }

        // NO reprogramar aquí - las notificaciones ya están agendadas para 14 días
        Log.d(TAG, "Notification shown. No rescheduling needed (already scheduled for 14 days)")
    }
}
