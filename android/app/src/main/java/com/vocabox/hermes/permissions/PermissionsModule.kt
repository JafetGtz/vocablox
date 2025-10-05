package com.vocabox.hermes.permissions

import android.app.NotificationManager
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.os.PowerManager
import android.provider.Settings
import com.facebook.react.bridge.*

class PermissionsModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "PermissionsModule"
    }

    @ReactMethod
    fun checkBatteryOptimization(promise: Promise) {
        try {
            // Battery optimization checks are only available from Android 6.0 (API 23)
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                val powerManager = reactApplicationContext.getSystemService(Context.POWER_SERVICE) as PowerManager
                val packageName = reactApplicationContext.packageName
                val isIgnoringBatteryOptimizations = powerManager.isIgnoringBatteryOptimizations(packageName)

                android.util.Log.d("PermissionsModule", "Battery optimization ignored: $isIgnoringBatteryOptimizations")
                promise.resolve(isIgnoringBatteryOptimizations)
            } else {
                // For Android versions below 6.0, battery optimization doesn't exist
                android.util.Log.d("PermissionsModule", "Battery optimization not available on this Android version")
                promise.resolve(true) // Return true to indicate no battery optimization
            }
        } catch (e: Exception) {
            android.util.Log.e("PermissionsModule", "Error checking battery optimization", e)
            promise.reject("ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun checkNotificationsEnabled(promise: Promise) {
        try {
            // NotificationManager.areNotificationsEnabled() is available from API 19 (Android 4.4)
            // This method works on all supported Android versions
            // For Android 13 (API 33) and above, POST_NOTIFICATIONS permission is also required
            // But areNotificationsEnabled() handles all cases correctly

            val notificationManager = reactApplicationContext.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

            val areNotificationsEnabled = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
                // API 19+ (Android 4.4+) - most common case
                notificationManager.areNotificationsEnabled()
            } else {
                // Fallback for very old devices (should rarely happen)
                true
            }

            android.util.Log.d("PermissionsModule", "Android API Level: ${Build.VERSION.SDK_INT}")
            android.util.Log.d("PermissionsModule", "Android Version: ${Build.VERSION.RELEASE}")
            android.util.Log.d("PermissionsModule", "Notifications enabled: $areNotificationsEnabled")

            promise.resolve(areNotificationsEnabled)
        } catch (e: Exception) {
            android.util.Log.e("PermissionsModule", "Error checking notifications", e)
            promise.reject("ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun openBatterySettings() {
        try {
            // Battery optimization settings are only available from Android 6.0 (API 23)
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                try {
                    val intent = Intent()
                    intent.action = Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS
                    intent.data = Uri.parse("package:${reactApplicationContext.packageName}")
                    intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK
                    reactApplicationContext.startActivity(intent)
                } catch (e: Exception) {
                    // Fallback to general battery optimization settings
                    try {
                        val intent = Intent(Settings.ACTION_IGNORE_BATTERY_OPTIMIZATION_SETTINGS)
                        intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK
                        reactApplicationContext.startActivity(intent)
                    } catch (ex: Exception) {
                        android.util.Log.e("PermissionsModule", "Error opening battery settings", ex)
                    }
                }
            } else {
                android.util.Log.d("PermissionsModule", "Battery optimization not available on this Android version")
            }
        } catch (e: Exception) {
            android.util.Log.e("PermissionsModule", "Error in openBatterySettings", e)
        }
    }

    @ReactMethod
    fun openNotificationSettings() {
        try {
            val intent = Intent()

            when {
                // Android 8.0 (API 26) and above - has dedicated notification settings screen
                Build.VERSION.SDK_INT >= Build.VERSION_CODES.O -> {
                    intent.action = Settings.ACTION_APP_NOTIFICATION_SETTINGS
                    intent.putExtra(Settings.EXTRA_APP_PACKAGE, reactApplicationContext.packageName)
                }
                // Android 5.0 to 7.1 (API 21-25) - use app details settings
                Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP -> {
                    intent.action = Settings.ACTION_APPLICATION_DETAILS_SETTINGS
                    intent.data = Uri.parse("package:${reactApplicationContext.packageName}")
                }
                // Android 4.4 and below (API 19-20) - fallback to app details
                else -> {
                    intent.action = Settings.ACTION_APPLICATION_DETAILS_SETTINGS
                    intent.data = Uri.parse("package:${reactApplicationContext.packageName}")
                }
            }

            intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK
            reactApplicationContext.startActivity(intent)

            android.util.Log.d("PermissionsModule", "Opened notification settings for API ${Build.VERSION.SDK_INT}")
        } catch (e: Exception) {
            android.util.Log.e("PermissionsModule", "Error opening notification settings", e)
        }
    }
}
