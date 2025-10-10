package com.vocabox.hermes.widget

import android.content.Context
import androidx.glance.GlanceId
import androidx.glance.action.ActionParameters
import androidx.glance.appwidget.action.ActionCallback
import com.vocabox.hermes.notifications.WordsDataStore

class PreviousWordAction : ActionCallback {
    override suspend fun onAction(
        context: Context,
        glanceId: GlanceId,
        parameters: ActionParameters
    ) {
        android.util.Log.d("PreviousWordAction", "Button clicked!")

        // Obtener palabras
        val wordsStore = WordsDataStore(context)
        val allWords = wordsStore.getAllWords()

        android.util.Log.d("PreviousWordAction", "Total words: ${allWords.size}")

        if (allWords.isEmpty()) {
            android.util.Log.w("PreviousWordAction", "No words available")
            return
        }

        // Obtener palabra y fondo actual
        val (currentWord, _, currentBackground) = WordWidgetReceiver.getWidgetData(context)
        android.util.Log.d("PreviousWordAction", "Current word: $currentWord")

        // Encontrar índice de la palabra actual
        val currentIndex = allWords.indexOfFirst { it.word == currentWord }

        // Calcular índice anterior (circular)
        val previousIndex = if (currentIndex <= 0) {
            allWords.size - 1
        } else {
            currentIndex - 1
        }

        val previousWord = allWords[previousIndex]
        android.util.Log.d("PreviousWordAction", "Previous word: ${previousWord.word}")

        // Actualizar widget preservando el fondo
        WordWidgetReceiver.updateWidgetData(
            context,
            previousWord.word,
            previousWord.meaning,
            currentBackground
        )

        // Forzar actualización del widget
        WordWidget().update(context, glanceId)
    }
}
