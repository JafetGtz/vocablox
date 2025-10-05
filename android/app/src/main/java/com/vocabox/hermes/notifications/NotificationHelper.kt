package com.vocabox.hermes.notifications

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import androidx.core.app.NotificationCompat
import com.vocabox.hermes.MainActivity
import com.vocabox.hermes.R

object NotificationHelper {

    private const val CHANNEL_ID = "daily_study_channel"
    private const val CHANNEL_NAME = "Estudio Diario"
    private const val CHANNEL_DESCRIPTION = "Notificaciones para aprender palabras diarias"

    fun createNotificationChannel(context: Context) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val importance = NotificationManager.IMPORTANCE_HIGH
            val channel = NotificationChannel(CHANNEL_ID, CHANNEL_NAME, importance).apply {
                description = CHANNEL_DESCRIPTION
                enableLights(true)
                enableVibration(true)
            }

            val notificationManager = context.getSystemService(Context.NOTIFICATION_SERVICE)
                as NotificationManager
            notificationManager.createNotificationChannel(channel)
        }
    }

    fun showNotification(
        context: Context,
        notificationId: Int,
        window: String,
        nickname: String,
        word: String,
        meaning: String,
        allWords: List<WordData>
    ) {
        createNotificationChannel(context)

        val intent = Intent(context, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
            putExtra("notification_data", true)
            putExtra("window", window)
            putExtra("words_json", wordsToJson(allWords))
        }

        val pendingIntent = PendingIntent.getActivity(
            context,
            notificationId,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        // Título personalizado según ventana
        val title = when (window) {
            "morning" -> "¡Buenos días, $nickname! 🌅"
            "afternoon" -> "¡Buenas tardes, $nickname! ☀️"
            "evening" -> "¡Buenas noches, $nickname! 🌙"
            else -> "¡Hola, $nickname! 👋"
        }

        // Cuerpo: palabra = significado
        val body = "📚 $word = $meaning"

        val notification = NotificationCompat.Builder(context, CHANNEL_ID)
            .setSmallIcon(R.drawable.ic_notification)
            .setContentTitle(title)
            .setContentText(body)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setCategory(NotificationCompat.CATEGORY_REMINDER)
            .setAutoCancel(true)
            .setContentIntent(pendingIntent)
            .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
            .build()

        val notificationManager = context.getSystemService(Context.NOTIFICATION_SERVICE)
            as NotificationManager
        notificationManager.notify(notificationId, notification)
    }

    private fun wordsToJson(words: List<WordData>): String {
        return words.joinToString(separator = ",", prefix = "[", postfix = "]") { word ->
            """{"id":"${word.id}","word":"${word.word}","meaning":"${word.meaning}","category":"${word.category}"}"""
        }
    }
}
