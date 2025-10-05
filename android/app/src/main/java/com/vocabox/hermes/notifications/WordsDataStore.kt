package com.vocabox.hermes.notifications

import android.content.Context
import android.content.SharedPreferences
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken

data class WordData(
    val id: String,
    val word: String,
    val meaning: String,
    val category: String
)

class WordsDataStore(context: Context) {

    private val prefs: SharedPreferences = context.getSharedPreferences(
        "words_storage",
        Context.MODE_PRIVATE
    )
    private val gson = Gson()

    fun saveWords(words: List<WordData>) {
        val json = gson.toJson(words)
        prefs.edit().putString("all_words", json).apply()
    }

    fun getAllWords(): List<WordData> {
        val json = prefs.getString("all_words", "[]") ?: "[]"
        val type = object : TypeToken<List<WordData>>() {}.type
        return gson.fromJson(json, type)
    }

    fun getWordsByCategories(categories: List<String>): List<WordData> {
        return getAllWords().filter { word ->
            categories.contains(word.category)
        }
    }

    fun saveCategories(categories: List<String>) {
        val json = gson.toJson(categories)
        prefs.edit().putString("categories", json).apply()
    }

    fun saveWordsPerBurst(count: Int) {
        prefs.edit().putInt("words_per_burst", count).apply()
    }

    fun saveNickname(nickname: String) {
        prefs.edit().putString("nickname", nickname).apply()
    }

    fun getNickname(): String {
        return prefs.getString("nickname", "Usuario") ?: "Usuario"
    }

    fun getWordsPerBurst(): Int {
        return prefs.getInt("words_per_burst", 2)
    }

    fun getCategories(): List<String> {
        val json = prefs.getString("categories", "[]") ?: "[]"
        val type = object : TypeToken<List<String>>() {}.type
        return gson.fromJson(json, type)
    }

    fun saveScheduleConfig(
        activeWindows: List<String>,
        windowTimes: Map<String, String>
    ) {
        val windowsJson = gson.toJson(activeWindows)
        val timesJson = gson.toJson(windowTimes)
        prefs.edit()
            .putString("active_windows", windowsJson)
            .putString("window_times", timesJson)
            .apply()
    }

    fun getActiveWindows(): List<String> {
        val json = prefs.getString("active_windows", "[]") ?: "[]"
        val type = object : TypeToken<List<String>>() {}.type
        return gson.fromJson(json, type)
    }

    fun getWindowTimes(): Map<String, String> {
        val json = prefs.getString("window_times", "{}") ?: "{}"
        val type = object : TypeToken<Map<String, String>>() {}.type
        return gson.fromJson(json, type)
    }
}
