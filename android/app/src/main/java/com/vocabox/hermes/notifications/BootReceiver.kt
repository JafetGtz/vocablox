package com.vocabox.hermes.notifications

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.util.Log

class BootReceiver : BroadcastReceiver() {

    private val TAG = "BootReceiver"

    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action == Intent.ACTION_BOOT_COMPLETED ||
            intent.action == "android.intent.action.QUICKBOOT_POWERON") {

            Log.d(TAG, "Device booted, rescheduling notifications")

            // Leer configuración guardada y reprogramar
            val wordsStore = WordsDataStore(context)
            val scheduler = NotificationScheduler(context)

            val activeWindows = wordsStore.getActiveWindows()
            val windowTimes = wordsStore.getWindowTimes()
            val categories = wordsStore.getCategories()
            val wordsPerBurst = wordsStore.getWordsPerBurst()
            val nickname = wordsStore.getNickname()

            if (activeWindows.isNotEmpty() && categories.isNotEmpty()) {
                // Reprogramar cada ventana
                activeWindows.forEach { window ->
                    val timeStr = windowTimes[window]
                    if (timeStr != null) {
                        val (hour, minute) = timeStr.split(":").map { it.toInt() }
                        val notificationId = window.hashCode()

                        scheduler.scheduleExactAlarm(
                            notificationId = notificationId,
                            window = window,
                            hour = hour,
                            minute = minute,
                            categories = categories,
                            wordsPerBurst = wordsPerBurst,
                            nickname = nickname
                        )

                        Log.d(TAG, "Rescheduled alarm for $window at $hour:$minute")
                    }
                }
            } else {
                Log.w(TAG, "No notification configuration found")
            }
        }
    }
}
