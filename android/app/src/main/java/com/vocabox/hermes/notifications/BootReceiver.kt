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

            Log.d(TAG, "Device booted, rescheduling notifications for 14 days")

            // Leer configuración guardada y reprogramar
            val wordsStore = WordsDataStore(context)
            val scheduler = NotificationScheduler(context)

            val activeWindows = wordsStore.getActiveWindows()
            val windowTimes = wordsStore.getWindowTimes()
            val categories = wordsStore.getCategories()
            val wordsPerBurst = wordsStore.getWordsPerBurst()
            val nickname = wordsStore.getNickname()

            if (activeWindows.isNotEmpty() && categories.isNotEmpty()) {
                // Reprogramar 14 días completos
                scheduler.scheduleTwoWeeksNotifications(
                    activeWindows = activeWindows,
                    windowTimes = windowTimes,
                    categories = categories,
                    wordsPerBurst = wordsPerBurst,
                    nickname = nickname
                )

                Log.d(TAG, "Successfully rescheduled 14 days of notifications after boot")
            } else {
                Log.w(TAG, "No notification configuration found")
            }
        }
    }
}
