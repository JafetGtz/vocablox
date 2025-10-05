package com.vocabox.hermes

import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.facebook.react.defaults.DefaultReactNativeHost
import com.vocabox.hermes.notifications.NotificationModule
import com.vocabox.hermes.notifications.NotificationHelper
import com.vocabox.hermes.permissions.PermissionsModule
import com.facebook.react.bridge.ReactApplicationContext

class MainApplication : Application(), ReactApplication {

  override val reactNativeHost: ReactNativeHost =
      object : DefaultReactNativeHost(this) {
        override fun getPackages(): List<ReactPackage> =
            PackageList(this).packages.apply {
              // Packages that cannot be autolinked yet can be added manually here, for example:
              // add(MyReactNativePackage())

              // Agregar módulos nativos
              add(object : ReactPackage {
                override fun createNativeModules(reactContext: ReactApplicationContext) =
                    listOf(
                        NotificationModule(reactContext),
                        PermissionsModule(reactContext)
                    )

                override fun createViewManagers(reactContext: ReactApplicationContext) =
                    emptyList<com.facebook.react.uimanager.ViewManager<*, *>>()
              })
            }

        override fun getJSMainModuleName(): String = "index"

        override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG

        override val isNewArchEnabled: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
        override val isHermesEnabled: Boolean = BuildConfig.IS_HERMES_ENABLED
      }

  override val reactHost: ReactHost
    get() = getDefaultReactHost(applicationContext, reactNativeHost)

  override fun onCreate() {
    super.onCreate()
    loadReactNative(this)

    // Crear canal de notificaciones
    NotificationHelper.createNotificationChannel(this)
  }
}
