package com.vocabox.hermes.widget

import android.appwidget.AppWidgetManager
import android.content.Context
import android.content.SharedPreferences
import androidx.glance.appwidget.GlanceAppWidget
import androidx.glance.appwidget.GlanceAppWidgetReceiver
import androidx.glance.appwidget.GlanceAppWidgetManager
import kotlinx.coroutines.MainScope
import kotlinx.coroutines.launch

class WordWidgetReceiver : GlanceAppWidgetReceiver() {
    override val glanceAppWidget: GlanceAppWidget = WordWidget()

    companion object {
        private const val PREFS_NAME = "WordWidgetPrefs"
        private const val KEY_WORD = "current_word"
        private const val KEY_MEANING = "current_meaning"
        private const val KEY_BACKGROUND = "background_uri"

        fun updateWidgetData(context: Context, word: String, meaning: String, backgroundUri: String?) {
            val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
            prefs.edit().apply {
                putString(KEY_WORD, word)
                putString(KEY_MEANING, meaning)
                putString(KEY_BACKGROUND, backgroundUri)
                apply()
            }

            android.util.Log.d("WordWidgetReceiver", "Updated widget data: word=$word, meaning=$meaning, bg=$backgroundUri")

            // Trigger widget update using Glance API
            MainScope().launch {
                try {
                    val glanceIds = GlanceAppWidgetManager(context).getGlanceIds(WordWidget::class.java)
                    android.util.Log.d("WordWidgetReceiver", "Found ${glanceIds.size} widgets to update")
                    glanceIds.forEach { glanceId ->
                        WordWidget().update(context, glanceId)
                    }
                } catch (e: Exception) {
                    android.util.Log.e("WordWidgetReceiver", "Error updating widget", e)
                }
            }
        }

        fun getWidgetData(context: Context): Triple<String, String, String?> {
            val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
            val word = prefs.getString(KEY_WORD, "Welcome") ?: "Welcome"
            val meaning = prefs.getString(KEY_MEANING, "Bienvenido") ?: "Bienvenido"
            val background = prefs.getString(KEY_BACKGROUND, null)
            return Triple(word, meaning, background)
        }
    }
}
