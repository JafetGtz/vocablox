package com.vocabox.hermes.widget

import android.content.Context
import androidx.work.*
import java.util.concurrent.TimeUnit

object WidgetUpdateScheduler {

    private const val WIDGET_UPDATE_WORK_TAG = "widget_update_work"
    private const val UPDATE_INTERVAL_HOURS = 2L

    /**
     * Programa actualizaciones periódicas del widget cada 2 horas
     */
    fun schedulePeriodicUpdates(context: Context) {
        val constraints = Constraints.Builder()
            .setRequiresBatteryNotLow(false)
            .build()

        val updateRequest = PeriodicWorkRequestBuilder<WidgetUpdateWorker>(
            UPDATE_INTERVAL_HOURS,
            TimeUnit.HOURS
        )
            .setConstraints(constraints)
            .addTag(WIDGET_UPDATE_WORK_TAG)
            .build()

        WorkManager.getInstance(context).enqueueUniquePeriodicWork(
            WIDGET_UPDATE_WORK_TAG,
            ExistingPeriodicWorkPolicy.KEEP,
            updateRequest
        )

        android.util.Log.d("WidgetUpdateScheduler", "Scheduled widget updates every $UPDATE_INTERVAL_HOURS hours")
    }

    /**
     * Actualiza el widget inmediatamente (para cuando el usuario toca el widget)
     */
    fun updateImmediately(context: Context) {
        val updateRequest = OneTimeWorkRequestBuilder<WidgetUpdateWorker>()
            .build()

        WorkManager.getInstance(context).enqueue(updateRequest)
        android.util.Log.d("WidgetUpdateScheduler", "Triggered immediate widget update")
    }

    /**
     * Cancela las actualizaciones programadas
     */
    fun cancelUpdates(context: Context) {
        WorkManager.getInstance(context).cancelAllWorkByTag(WIDGET_UPDATE_WORK_TAG)
        android.util.Log.d("WidgetUpdateScheduler", "Cancelled widget updates")
    }
}
