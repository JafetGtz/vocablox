package com.awesome.notifications

import android.content.Intent
import android.net.Uri
import android.os.Build
import android.provider.Settings
import com.facebook.react.bridge.*

class NotificationModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    private val scheduler = NotificationScheduler(reactContext)
    private val wordsStore = WordsDataStore(reactContext)

    override fun getName(): String = "NotificationModule"

    @ReactMethod
    fun scheduleNotifications(settings: ReadableMap, promise: Promise) {
        try {
            scheduler.cancelAllNotifications()

            val categories = settings.getArray("categories")?.toArrayList() as? List<String>
                ?: emptyList()
            val activeWindows = settings.getArray("active_windows")?.toArrayList() as? List<String>
                ?: emptyList()
            val windowTimes = settings.getMap("window_times")
            val wordsPerBurst = settings.getInt("words_per_burst")
            val nickname = settings.getString("nickname") ?: "Usuario"

            // Guardar configuración para uso futuro (boot, etc)
            wordsStore.saveCategories(categories)
            wordsStore.saveWordsPerBurst(wordsPerBurst)
            wordsStore.saveNickname(nickname)

            // Convertir windowTimes a Map
            val windowTimesMap = mutableMapOf<String, String>()
            activeWindows.forEach { window ->
                val timeStr = windowTimes?.getString(window)
                if (timeStr != null) {
                    windowTimesMap[window] = timeStr
                }
            }
            wordsStore.saveScheduleConfig(activeWindows, windowTimesMap)

            var scheduledCount = 0
            activeWindows.forEach { window ->
                val timeStr = windowTimes?.getString(window)
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

                    scheduledCount++
                }
            }

            promise.resolve("Scheduled $scheduledCount notifications")
        } catch (e: Exception) {
            promise.reject("SCHEDULE_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun cancelAllNotifications(promise: Promise) {
        try {
            scheduler.cancelAllNotifications()
            promise.resolve("All notifications cancelled")
        } catch (e: Exception) {
            promise.reject("CANCEL_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun requestIgnoreBatteryOptimization(promise: Promise) {
        try {
            val activity = currentActivity
            if (activity == null) {
                promise.reject("NO_ACTIVITY", "Activity not available")
                return
            }

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                val packageName = reactApplicationContext.packageName
                val intent = Intent().apply {
                    action = Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS
                    data = Uri.parse("package:$packageName")
                }
                activity.startActivity(intent)
                promise.resolve("Battery optimization dialog opened")
            } else {
                promise.resolve("Not needed for this Android version")
            }
        } catch (e: Exception) {
            promise.reject("BATTERY_OPT_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun checkExactAlarmPermission(promise: Promise) {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                val alarmManager = reactApplicationContext
                    .getSystemService(android.content.Context.ALARM_SERVICE) as android.app.AlarmManager
                val canSchedule = alarmManager.canScheduleExactAlarms()
                promise.resolve(canSchedule)
            } else {
                promise.resolve(true)
            }
        } catch (e: Exception) {
            promise.reject("PERMISSION_CHECK_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun requestExactAlarmPermission(promise: Promise) {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                val intent = Intent(Settings.ACTION_REQUEST_SCHEDULE_EXACT_ALARM)
                intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK
                reactApplicationContext.startActivity(intent)
                promise.resolve("Permission dialog opened")
            } else {
                promise.resolve("Not needed for this Android version")
            }
        } catch (e: Exception) {
            promise.reject("PERMISSION_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun saveWords(wordsArray: ReadableArray, promise: Promise) {
        try {
            val words = mutableListOf<WordData>()
            for (i in 0 until wordsArray.size()) {
                val wordMap = wordsArray.getMap(i)
                if (wordMap != null) {
                    words.add(WordData(
                        id = wordMap.getString("id") ?: "",
                        word = wordMap.getString("word") ?: "",
                        meaning = wordMap.getString("meaning") ?: "",
                        category = wordMap.getString("category") ?: ""
                    ))
                }
            }
            wordsStore.saveWords(words)
            promise.resolve("Saved ${words.size} words")
        } catch (e: Exception) {
            promise.reject("SAVE_WORDS_ERROR", e.message, e)
        }
    }
}
