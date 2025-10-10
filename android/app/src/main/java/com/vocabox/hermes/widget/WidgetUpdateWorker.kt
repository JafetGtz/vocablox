package com.vocabox.hermes.widget

import android.content.Context
import androidx.work.Worker
import androidx.work.WorkerParameters
import com.vocabox.hermes.notifications.WordsDataStore

class WidgetUpdateWorker(
    context: Context,
    params: WorkerParameters
) : Worker(context, params) {

    override fun doWork(): Result {
        return try {
            // Obtener palabras guardadas del almacenamiento
            val wordsStore = WordsDataStore(applicationContext)
            val allWords = wordsStore.getAllWords()

            if (allWords.isEmpty()) {
                // Si no hay palabras, usar placeholder
                WordWidgetReceiver.updateWidgetData(
                    applicationContext,
                    "Welcome",
                    "Bienvenido",
                    null
                )
            } else {
                // Seleccionar palabra aleatoria
                val randomWord = allWords.random()
                WordWidgetReceiver.updateWidgetData(
                    applicationContext,
                    randomWord.word,
                    randomWord.meaning,
                    null
                )
            }

            Result.success()
        } catch (e: Exception) {
            android.util.Log.e("WidgetUpdateWorker", "Error updating widget", e)
            Result.retry()
        }
    }
}
