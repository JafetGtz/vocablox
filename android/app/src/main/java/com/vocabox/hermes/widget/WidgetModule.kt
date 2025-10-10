package com.vocabox.hermes.widget

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise

class WidgetModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "WidgetModule"

    @ReactMethod
    fun updateWidget(word: String, meaning: String, backgroundUri: String?, promise: Promise) {
        try {
            WordWidgetReceiver.updateWidgetData(
                reactApplicationContext,
                word,
                meaning,
                backgroundUri
            )

            // Iniciar scheduler de actualizaciones cada 2 horas (solo la primera vez)
            WidgetUpdateScheduler.schedulePeriodicUpdates(reactApplicationContext)

            promise.resolve("Widget updated successfully")
        } catch (e: Exception) {
            promise.reject("WIDGET_UPDATE_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun getWidgetData(promise: Promise) {
        try {
            val (word, meaning, background) = WordWidgetReceiver.getWidgetData(reactApplicationContext)
            val result = com.facebook.react.bridge.Arguments.createMap().apply {
                putString("word", word)
                putString("meaning", meaning)
                putString("background", background)
            }
            promise.resolve(result)
        } catch (e: Exception) {
            promise.reject("WIDGET_GET_ERROR", e.message, e)
        }
    }
}
