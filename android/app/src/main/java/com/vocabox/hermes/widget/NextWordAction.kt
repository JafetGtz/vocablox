package com.vocabox.hermes.widget

import android.content.Context
import androidx.glance.GlanceId
import androidx.glance.action.ActionParameters
import androidx.glance.appwidget.action.ActionCallback
import com.vocabox.hermes.notifications.WordsDataStore

class NextWordAction : ActionCallback {
    override suspend fun onAction(
        context: Context,
        glanceId: GlanceId,
        parameters: ActionParameters
    ) {
        android.util.Log.d("NextWordAction", "Button clicked!")

        // Obtener palabras
        val wordsStore = WordsDataStore(context)
        val allWords = wordsStore.getAllWords()

        android.util.Log.d("NextWordAction", "Total words: ${allWords.size}")

        if (allWords.isEmpty()) {
            android.util.Log.w("NextWordAction", "No words available")
            return
        }

        // Obtener palabra y fondo actual
        val (currentWord, _, currentBackground) = WordWidgetReceiver.getWidgetData(context)
        android.util.Log.d("NextWordAction", "Current word: $currentWord")

        // Encontrar índice de la palabra actual
        val currentIndex = allWords.indexOfFirst { it.word == currentWord }

        // Calcular índice siguiente (circular)
        val nextIndex = if (currentIndex >= allWords.size - 1) {
            0
        } else {
            currentIndex + 1
        }

        val nextWord = allWords[nextIndex]
        android.util.Log.d("NextWordAction", "Next word: ${nextWord.word}")

        // Actualizar widget preservando el fondo
        WordWidgetReceiver.updateWidgetData(
            context,
            nextWord.word,
            nextWord.meaning,
            currentBackground
        )

        // Forzar actualización del widget
        WordWidget().update(context, glanceId)
    }
}
