package com.vocabox.hermes.widget

import android.content.Context
import androidx.glance.GlanceId
import androidx.glance.action.ActionParameters
import androidx.glance.appwidget.action.ActionCallback
import com.vocabox.hermes.notifications.WordsDataStore

class UpdateWidgetAction : ActionCallback {
    override suspend fun onAction(
        context: Context,
        glanceId: GlanceId,
        parameters: ActionParameters
    ) {
        android.util.Log.d("UpdateWidgetAction", "Button clicked!")

        // Obtener palabras
        val wordsStore = WordsDataStore(context)
        val allWords = wordsStore.getAllWords()

        android.util.Log.d("UpdateWidgetAction", "Total words: ${allWords.size}")

        if (allWords.isEmpty()) {
            // Si no hay palabras, usar placeholder
            val (_, _, currentBackground) = WordWidgetReceiver.getWidgetData(context)
            WordWidgetReceiver.updateWidgetData(
                context,
                "Welcome",
                "Bienvenido",
                currentBackground
            )
        } else {
            // Seleccionar palabra aleatoria
            val randomWord = allWords.random()
            val (_, _, currentBackground) = WordWidgetReceiver.getWidgetData(context)

            android.util.Log.d("UpdateWidgetAction", "Random word: ${randomWord.word}")

            WordWidgetReceiver.updateWidgetData(
                context,
                randomWord.word,
                randomWord.meaning,
                currentBackground
            )
        }

        // Forzar actualización del widget
        WordWidget().update(context, glanceId)
    }
}
