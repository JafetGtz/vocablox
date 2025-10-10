# Sistema de Notificaciones - Análisis Técnico Completo

## 📋 Índice

1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Lógica de Agendado (14 días)](#lógica-de-agendado-14-días)
4. [Lógica de Reagendado](#lógica-de-reagendado)
5. [Flujo Completo con Ejemplos](#flujo-completo-con-ejemplos)
6. [Componentes Clave](#componentes-clave)
7. [Casos de Uso y Escenarios](#casos-de-uso-y-escenarios)
8. [Verificación y Debugging](#verificación-y-debugging)
9. [FAQ Técnico](#faq-técnico)

---

## Resumen Ejecutivo

### ¿Qué hace este sistema?

El sistema de notificaciones agenda **14 días completos de notificaciones** cuando el usuario completa el wizard. El usuario **NO necesita abrir la app** para recibir notificaciones durante esas 2 semanas.

### Características principales

✅ **Agendado masivo**: 14 días × ventanas activas (hasta 42 notificaciones)
✅ **Offline-first**: Una vez agendadas, funcionan sin internet
✅ **Resistente a reinicios**: BootReceiver reprograma al reiniciar el teléfono
✅ **Reagendado inteligente**: Solo reprograma cuando el usuario abre la app después del día 14
✅ **Sin Supabase**: Las palabras vienen de archivos JSON locales
✅ **Ignora Doze Mode**: Usa `setExactAndAllowWhileIdle()`

---

## Arquitectura del Sistema

### Diagrama de componentes

```
┌─────────────────────────────────────────────────────────────────┐
│                         React Native                             │
├─────────────────────────────────────────────────────────────────┤
│  useWizardViewModel.ts                                           │
│  └─> Completa wizard → Agenda 14 días INICIAL                   │
│                                                                   │
│  useNotifications.ts (ejecuta en Home)                           │
│  └─> checkAndRescheduleIfNeeded() → Verifica si pasaron 14 días │
├─────────────────────────────────────────────────────────────────┤
│                    Bridge (NativeModules)                        │
├─────────────────────────────────────────────────────────────────┤
│                         Kotlin/Android                           │
├─────────────────────────────────────────────────────────────────┤
│  NotificationModule.kt                                           │
│  ├─> scheduleNotifications()          (primera vez)              │
│  └─> checkAndRescheduleIfNeeded()     (cada vez que abre app)   │
│                                                                   │
│  NotificationScheduler.kt                                        │
│  ├─> scheduleTwoWeeksNotifications()  (agenda 14 días)          │
│  ├─> needsRescheduling()              (verifica si pasaron 14)  │
│  └─> cancelAllNotifications()         (cancela antes de agendar)│
│                                                                   │
│  NotificationReceiver.kt                                         │
│  └─> onReceive() → Muestra notificación (NO reprograma)         │
│                                                                   │
│  BootReceiver.kt                                                 │
│  └─> onReceive() → Reprograma 14 días al reiniciar teléfono     │
│                                                                   │
│  WordsDataStore.kt                                               │
│  └─> SharedPreferences (guarda config + timestamp + palabras)   │
└─────────────────────────────────────────────────────────────────┘
```

### Flujo de datos

```
Wizard → NotificationModule → NotificationScheduler → AlarmManager (Android)
                                      ↓
                               WordsDataStore (guarda timestamp)
                                      ↓
                        Sistema operativo Android ejecuta alarmas
                                      ↓
                               NotificationReceiver → Muestra notificación
```

---

## Lógica de Agendado (14 días)

### 📍 Archivo: `NotificationScheduler.kt`

### Función principal: `scheduleTwoWeeksNotifications()`

```kotlin
fun scheduleTwoWeeksNotifications(
    activeWindows: List<String>,        // ["morning", "evening"]
    windowTimes: Map<String, String>,   // {morning: "08:00", evening: "20:00"}
    categories: List<String>,            // ["Tecnología", "Negocios"]
    wordsPerBurst: Int,                  // 3
    nickname: String                     // "María"
)
```

### Algoritmo paso a paso

#### 1️⃣ Cancelar notificaciones anteriores

```kotlin
cancelAllNotifications()  // Limpia las 42 alarmas posibles (14 días × 3 ventanas)
```

**Por qué**: Evita duplicados y asegura estado limpio.

#### 2️⃣ Iterar sobre 14 días

```kotlin
for (dayOffset in 0 until DAYS_TO_SCHEDULE) {  // 0 a 13
    // dayOffset = 0 → hoy
    // dayOffset = 1 → mañana
    // dayOffset = 13 → dentro de 13 días
}
```

#### 3️⃣ Para cada día, iterar sobre ventanas activas

```kotlin
activeWindows.forEach { window ->  // "morning", "evening"
    val timeStr = windowTimes[window]  // "08:00"
    val (hour, minute) = timeStr.split(":").map { it.toInt() }
}
```

#### 4️⃣ Calcular timestamp exacto

```kotlin
val calendar = Calendar.getInstance().apply {
    set(Calendar.HOUR_OF_DAY, hour)        // 8
    set(Calendar.MINUTE, minute)            // 0
    set(Calendar.SECOND, 0)
    set(Calendar.MILLISECOND, 0)
    add(Calendar.DAY_OF_YEAR, dayOffset)    // +0, +1, +2, ..., +13
}
```

**Ejemplo**:
- Hoy: 5 oct 2025, 15:00
- dayOffset = 0, window = "morning", time = "08:00"
- ❌ calendar = 5 oct 2025, 08:00 → **YA PASÓ**
- ✅ Se omite (línea 57: `if (calendar.timeInMillis > now.timeInMillis)`)

- dayOffset = 1, window = "morning", time = "08:00"
- ✅ calendar = 6 oct 2025, 08:00 → **FUTURO**
- ✅ Se agenda

#### 5️⃣ Generar ID único

```kotlin
val uniqueId = "${window}_day${dayOffset}".hashCode()
// Ejemplos:
// "morning_day0".hashCode()  → 123456789
// "morning_day1".hashCode()  → 987654321
// "evening_day0".hashCode()  → 456789123
```

**Por qué usar hashCode**:
- AlarmManager requiere IDs únicos por alarma
- Mismo ID permite cancelar/actualizar alarmas específicas

#### 6️⃣ Agendar alarma exacta

```kotlin
alarmManager.setExactAndAllowWhileIdle(
    AlarmManager.RTC_WAKEUP,
    calendar.timeInMillis,
    pendingIntent
)
```

**Tipos de alarmas**:
- `RTC_WAKEUP`: Despierta el dispositivo si está dormido
- `setExactAndAllowWhileIdle()`: Ignora Doze Mode (Android 6+)

#### 7️⃣ Guardar timestamp

```kotlin
wordsStore.saveLastScheduledDate(System.currentTimeMillis())
```

**Para qué**: Permite calcular cuándo reagendar.

### Ejemplo completo de agendado

**Configuración del usuario**:
```javascript
{
  active_windows: ["morning", "evening"],
  window_times: { morning: "08:00", evening: "20:00" },
  categories: ["Tecnología", "Negocios"],
  words_per_burst: 3,
  nickname: "María"
}
```

**Fecha actual**: 5 oct 2025, 15:00

**Notificaciones agendadas** (28 total):

| Day | Fecha | Morning (08:00) | Evening (20:00) |
|-----|-------|-----------------|-----------------|
| 0 | 5 oct | ❌ (ya pasó) | ✅ 5 oct 20:00 |
| 1 | 6 oct | ✅ 6 oct 08:00 | ✅ 6 oct 20:00 |
| 2 | 7 oct | ✅ 7 oct 08:00 | ✅ 7 oct 20:00 |
| ... | ... | ... | ... |
| 13 | 18 oct | ✅ 18 oct 08:00 | ✅ 18 oct 20:00 |

**Total**: 1 + 26 = **27 notificaciones agendadas**

---

## Lógica de Reagendado

### 📍 Archivo: `NotificationModule.kt`

### Función: `checkAndRescheduleIfNeeded()`

```kotlin
@ReactMethod
fun checkAndRescheduleIfNeeded(promise: Promise) {
    try {
        if (scheduler.needsRescheduling()) {
            // Obtener configuración guardada
            val categories = wordsStore.getCategories()
            val activeWindows = wordsStore.getActiveWindows()
            val windowTimes = wordsStore.getWindowTimes()
            val wordsPerBurst = wordsStore.getWordsPerBurst()
            val nickname = wordsStore.getNickname()

            // Reprogramar 14 días
            scheduler.scheduleTwoWeeksNotifications(...)

            promise.resolve("Rescheduled notifications for 14 more days")
        } else {
            promise.resolve("Notifications still valid, no rescheduling needed")
        }
    } catch (e: Exception) {
        promise.reject("RESCHEDULE_ERROR", e.message, e)
    }
}
```

### Función auxiliar: `needsRescheduling()`

📍 **Archivo**: `NotificationScheduler.kt`

```kotlin
fun needsRescheduling(): Boolean {
    val lastScheduled = wordsStore.getLastScheduledDate()

    // Primera vez (nunca se agendó)
    if (lastScheduled == 0L) {
        return true
    }

    // Calcular días transcurridos
    val daysSinceLastSchedule =
        (System.currentTimeMillis() - lastScheduled) / (1000 * 60 * 60 * 24)

    // Necesita reagendar si pasaron 14+ días
    val needsReschedule = daysSinceLastSchedule >= DAYS_TO_SCHEDULE  // 14

    return needsReschedule
}
```

### Matemática del reagendado

**Ejemplo 1: No necesita reagendar**

```
Última programación: 5 oct 2025, 15:00 → timestamp: 1728156000000
Ahora: 10 oct 2025, 10:00            → timestamp: 1728561600000

Diferencia: 1728561600000 - 1728156000000 = 405600000 ms
Días:       405600000 / (1000 * 60 * 60 * 24) = 4.69 días

4.69 < 14 → ❌ NO reagendar
```

**Ejemplo 2: SÍ necesita reagendar**

```
Última programación: 5 oct 2025, 15:00 → timestamp: 1728156000000
Ahora: 20 oct 2025, 10:00            → timestamp: 1729425600000

Diferencia: 1729425600000 - 1728156000000 = 1269600000 ms
Días:       1269600000 / (1000 * 60 * 60 * 24) = 14.69 días

14.69 >= 14 → ✅ SÍ reagendar
```

### ¿Cuándo se ejecuta esta verificación?

📍 **Archivo**: `useNotifications.ts`

```typescript
useEffect(() => {
  if (wizardCompleted) {
    checkAndReschedule()
  }
}, [wizardCompleted])
```

**Trigger**: Cada vez que el usuario abre el Home screen.

---

## Flujo Completo con Ejemplos

### Escenario 1: Usuario completa wizard por primera vez

**Fecha**: 5 oct 2025, 15:00

#### 1. Usuario completa último paso del wizard

📍 `useWizardViewModel.ts:152-210`

```typescript
// Se ejecuta saveAndComplete()
const result = await upsertSettings(settingsToSave)

// Obtener palabras de archivos JSON locales
const focusWords = wordDataService.getMultipleCategoryWords(focusCategories)

// Guardar en SharedPreferences nativo
await NotificationModule.saveWords(wordsForNotifications)

// AGENDAR 14 DÍAS
await NotificationModule.scheduleNotifications({
  categories: categoryNames,
  active_windows: ["morning", "evening"],
  window_times: { morning: "08:00", evening: "20:00" },
  words_per_burst: 3,
  nickname: "María"
})
```

#### 2. Kotlin agenda 14 días

📍 `NotificationScheduler.kt:22-83`

```
Log: "Scheduling notifications for 14 days"
Log: "Active windows: [morning, evening]"
Log: "Window times: {morning=08:00, evening=20:00}"

Programando...
Log: "Scheduled: evening Day+0 at 20:0 -> Sat Oct 05 20:00:00 GMT-06:00 2025"
Log: "Scheduled: morning Day+1 at 8:0 -> Sun Oct 06 08:00:00 GMT-06:00 2025"
Log: "Scheduled: evening Day+1 at 20:0 -> Sun Oct 06 20:00:00 GMT-06:00 2025"
...
Log: "Scheduled: morning Day+13 at 8:0 -> Sat Oct 18 08:00:00 GMT-06:00 2025"
Log: "Scheduled: evening Day+13 at 20:0 -> Sat Oct 18 20:00:00 GMT-06:00 2025"

Log: "✅ Successfully scheduled 27 notifications for 14 days"
```

#### 3. Se guarda timestamp

📍 `WordsDataStore.kt:92-94`

```kotlin
wordsStore.saveLastScheduledDate(System.currentTimeMillis())
// Guardado: 1728156000000 (5 oct 2025, 15:00)
```

---

### Escenario 2: Usuario abre la app el día 10

**Fecha**: 10 oct 2025, 10:00
**Días transcurridos**: 4.69 días

#### 1. Home screen se monta

📍 `useNotifications.ts:12-16`

```typescript
useEffect(() => {
  if (wizardCompleted) {
    checkAndReschedule()  // Se ejecuta
  }
}, [wizardCompleted])
```

#### 2. Verifica si necesita reagendar

📍 `NotificationModule.kt:59-85`

```kotlin
scheduler.needsRescheduling()
// lastScheduled = 1728156000000
// now = 1728561600000
// días = 4.69
// 4.69 >= 14? → FALSE
```

#### 3. Resultado

```
Log: "Days since last schedule: 4, needs reschedule: false"
Promise resuelve: "Notifications still valid, no rescheduling needed"
```

**React Native log**:
```
Checking if notifications need rescheduling...
Reschedule check result: Notifications still valid, no rescheduling needed
```

✅ **No hace nada**, las notificaciones siguen agendadas.

---

### Escenario 3: Usuario abre la app el día 20

**Fecha**: 20 oct 2025, 10:00
**Días transcurridos**: 14.69 días

#### 1. Home screen se monta

```typescript
checkAndReschedule()  // Se ejecuta
```

#### 2. Verifica si necesita reagendar

```kotlin
scheduler.needsRescheduling()
// días = 14.69
// 14.69 >= 14? → TRUE ✅
```

#### 3. Obtiene configuración guardada

```kotlin
val categories = wordsStore.getCategories()        // ["Tecnología", "Negocios"]
val activeWindows = wordsStore.getActiveWindows()  // ["morning", "evening"]
val windowTimes = wordsStore.getWindowTimes()      // {morning: "08:00", ...}
val wordsPerBurst = wordsStore.getWordsPerBurst()  // 3
val nickname = wordsStore.getNickname()            // "María"
```

#### 4. Reagenda 14 días MÁS

```kotlin
scheduler.scheduleTwoWeeksNotifications(...)
```

```
Log: "Scheduling notifications for 14 days"
Log: "Cancelled 42 alarms"
Log: "Scheduled: morning Day+0 at 8:0 -> Mon Oct 20 08:00:00 GMT-06:00 2025"
...
Log: "Scheduled: evening Day+13 at 20:0 -> Sun Nov 02 20:00:00 GMT-06:00 2025"
Log: "✅ Successfully scheduled 28 notifications for 14 days"
```

#### 5. Actualiza palabras

📍 `useNotifications.ts:34-66`

```typescript
// Detecta que se reagendó
if (result.includes('Rescheduled')) {
  await updateWordsIfNeeded()
  // Obtiene palabras actualizadas de JSON locales
  // Las guarda en SharedPreferences
}
```

#### 6. Nuevo timestamp

```kotlin
wordsStore.saveLastScheduledDate(System.currentTimeMillis())
// Nuevo timestamp: 1729425600000 (20 oct 2025, 10:00)
```

✅ **Ahora tiene notificaciones hasta el 2 nov 2025**

---

### Escenario 4: Teléfono se reinicia

**Fecha**: 12 oct 2025, 08:30
**Situación**: El teléfono se apagó y reinició

#### 1. Sistema operativo dispara BootReceiver

📍 `BootReceiver.kt:12-44`

```kotlin
override fun onReceive(context: Context, intent: Intent) {
    if (intent.action == Intent.ACTION_BOOT_COMPLETED) {
        Log.d(TAG, "Device booted, rescheduling notifications for 14 days")

        // Leer configuración guardada
        val activeWindows = wordsStore.getActiveWindows()
        val windowTimes = wordsStore.getWindowTimes()
        // ...

        // Reprogramar 14 días completos
        scheduler.scheduleTwoWeeksNotifications(...)
    }
}
```

#### 2. Resultado

```
Log: "Device booted, rescheduling notifications for 14 days"
Log: "Scheduling notifications for 14 days"
Log: "✅ Successfully scheduled 28 notifications for 14 days"
Log: "Successfully rescheduled 14 days of notifications after boot"
```

✅ **El usuario NO pierde notificaciones** después de reiniciar.

---

## Componentes Clave

### 1. NotificationScheduler.kt

**Responsabilidades**:
- Agendar 14 días de notificaciones
- Calcular si necesita reagendar
- Cancelar notificaciones anteriores
- Generar IDs únicos

**Métodos públicos**:
```kotlin
fun scheduleTwoWeeksNotifications()  // Agenda 14 días
fun needsRescheduling(): Boolean     // Verifica si pasaron 14 días
fun cancelAllNotifications()         // Cancela todas las alarmas
```

---

### 2. NotificationModule.kt

**Responsabilidades**:
- Bridge entre React Native y Kotlin
- Exponer métodos a JavaScript
- Guardar configuración en SharedPreferences

**Métodos expuestos a React Native**:
```kotlin
@ReactMethod
fun scheduleNotifications()          // Primera vez (wizard)

@ReactMethod
fun checkAndRescheduleIfNeeded()     // Cada vez que abre app

@ReactMethod
fun saveWords()                       // Guardar palabras en SharedPreferences

@ReactMethod
fun checkExactAlarmPermission()      // Verificar permisos

@ReactMethod
fun requestExactAlarmPermission()    // Solicitar permisos

@ReactMethod
fun cancelAllNotifications()         // Cancelar todo
```

---

### 3. NotificationReceiver.kt

**Responsabilidades**:
- Recibir alarmas de AlarmManager
- Seleccionar palabras aleatorias
- Mostrar notificación
- **NO reprogramar** (ya están agendadas 14 días)

**Flujo**:
```kotlin
onReceive() {
  1. Leer categorías, wordsPerBurst, nickname de Intent extras
  2. Obtener palabras de WordsDataStore (SharedPreferences)
  3. Filtrar por categorías
  4. Seleccionar N palabras aleatorias (.shuffled().take(wordsPerBurst))
  5. Mostrar NotificationHelper.showNotification()
  6. NO reprogramar (eliminado el código de reprogramación)
}
```

---

### 4. WordsDataStore.kt

**Responsabilidades**:
- Almacenar datos en SharedPreferences
- Persistir configuración entre reinicios

**Datos guardados**:
```kotlin
- all_words: List<WordData>           // Palabras en formato JSON
- categories: List<String>             // ["Tecnología", "Negocios"]
- words_per_burst: Int                 // 3
- nickname: String                     // "María"
- active_windows: List<String>         // ["morning", "evening"]
- window_times: Map<String, String>    // {morning: "08:00", ...}
- last_scheduled_date: Long            // Timestamp en millis
```

---

### 5. BootReceiver.kt

**Responsabilidades**:
- Detectar reinicio del dispositivo
- Reprogramar 14 días automáticamente

**Eventos que escucha**:
```xml
<receiver android:name=".notifications.BootReceiver">
    <intent-filter>
        <action android:name="android.intent.action.BOOT_COMPLETED" />
        <action android:name="android.intent.action.QUICKBOOT_POWERON" />
    </intent-filter>
</receiver>
```

---

### 6. useNotifications.ts

**Responsabilidades**:
- Verificar si necesita reagendar (cada vez que abre app)
- Actualizar palabras cuando se reagenda

**Hooks usados**:
```typescript
useEffect(() => {
  if (wizardCompleted) {
    checkAndReschedule()
  }
}, [wizardCompleted])
```

---

## Casos de Uso y Escenarios

### ✅ Caso 1: Usuario normal (abre app cada 3 días)

| Día | Acción | Resultado |
|-----|--------|-----------|
| 0 | Completa wizard | Agenda 14 días (0-13) |
| 3 | Abre app | Verifica: 3 < 14 → No reagenda |
| 7 | Abre app | Verifica: 7 < 14 → No reagenda |
| 10 | Abre app | Verifica: 10 < 14 → No reagenda |
| 15 | Abre app | Verifica: 15 >= 14 → **Reagenda 14 días más (15-28)** |

---

### ✅ Caso 2: Usuario inactivo (no abre app en 20 días)

| Día | Acción | Resultado |
|-----|--------|-----------|
| 0 | Completa wizard | Agenda 14 días (0-13) |
| 1-13 | No abre app | ✅ Recibe notificaciones normalmente |
| 14-20 | No abre app | ❌ No recibe notificaciones (vencieron) |
| 21 | Abre app | Verifica: 21 >= 14 → **Reagenda 14 días (21-34)** |

**Consecuencia**: Perdió notificaciones del día 14-20, pero se reprograman al abrir.

---

### ✅ Caso 3: Usuario cambia configuración

| Día | Acción | Resultado |
|-----|--------|-----------|
| 0 | Completa wizard (2 sesiones/día) | Agenda 14 días × 2 = 28 notif |
| 5 | Cambia a 3 sesiones/día en Settings | ❓ ¿Qué pasa? |

**Respuesta**: Depende de tu implementación en Settings.

**Recomendación**: Cuando el usuario cambie configuración, ejecutar:
```typescript
await NotificationModule.scheduleNotifications(newSettings)
// Esto cancela las anteriores y agenda 14 días con nueva config
```

---

### ✅ Caso 4: Teléfono se apaga durante 5 días

| Día | Acción | Resultado |
|-----|--------|-----------|
| 0 | Completa wizard | Agenda 14 días (0-13) |
| 3 | Teléfono se apaga | ❌ No recibe notif día 3-7 |
| 8 | Teléfono enciende | BootReceiver reagenda 14 días (8-21) |
| 8-21 | Funcionamiento normal | ✅ Recibe notificaciones |

**Consecuencia**: Perdió notificaciones mientras estuvo apagado, pero se reprograman al encender.

---

## Verificación y Debugging

### 1. Verificar que se agendaron 14 días

```bash
adb shell dumpsys alarm | grep vocabox
```

**Salida esperada**:
```
RTC_WAKEUP #123: Alarm{abc123 type 0 when 1728156000000 com.vocabox.hermes}
RTC_WAKEUP #124: Alarm{def456 type 0 when 1728242400000 com.vocabox.hermes}
...
(27-28 líneas, dependiendo de ventanas activas)
```

---

### 2. Verificar SharedPreferences

```bash
adb shell run-as com.vocabox.hermes cat /data/data/com.vocabox.hermes/shared_prefs/words_storage.xml
```

**Salida esperada**:
```xml
<map>
    <long name="last_scheduled_date" value="1728156000000" />
    <string name="active_windows">["morning","evening"]</string>
    <string name="window_times">{"morning":"08:00","evening":"20:00"}</string>
    <string name="categories">["Tecnología","Negocios"]</string>
    <int name="words_per_burst" value="3" />
    <string name="nickname">María</string>
    <string name="all_words">[{"id":"technology_0","word":"achievement"...}]</string>
</map>
```

---

### 3. Logs clave en Logcat

**Al agendar**:
```
NotificationScheduler: Scheduling notifications for 14 days
NotificationScheduler: Active windows: [morning, evening]
NotificationScheduler: ✅ Successfully scheduled 27 notifications for 14 days
```

**Al verificar (NO necesita reagendar)**:
```
NotificationScheduler: Days since last schedule: 5, needs reschedule: false
```

**Al verificar (SÍ necesita reagendar)**:
```
NotificationScheduler: Days since last schedule: 15, needs reschedule: true
NotificationScheduler: Scheduling notifications for 14 days
NotificationScheduler: ✅ Successfully scheduled 28 notifications for 14 days
```

**Al mostrar notificación**:
```
NotificationReceiver: onReceive triggered: com.vocabox.hermes.SHOW_NOTIFICATION
NotificationReceiver: Showing notification for window: morning at 8:0 (Day: 5)
NotificationReceiver: Notification shown. No rescheduling needed (already scheduled for 14 days)
```

**Al reiniciar teléfono**:
```
BootReceiver: Device booted, rescheduling notifications for 14 days
BootReceiver: Successfully rescheduled 14 days of notifications after boot
```

---

### 4. Simular diferentes escenarios

#### Simular que pasaron 15 días

```bash
# Obtener timestamp actual
adb shell date +%s000  # Ejemplo: 1728156000000

# Calcular 15 días atrás (en millis)
# 15 días = 15 * 24 * 60 * 60 * 1000 = 1296000000 ms
# timestamp - 1296000000

# Editar SharedPreferences manualmente (requiere root)
# O usar código de prueba:
```

```kotlin
// En NotificationModule.kt (solo para testing)
@ReactMethod
fun setLastScheduledDateForTesting(daysAgo: Int, promise: Promise) {
    val timestamp = System.currentTimeMillis() - (daysAgo * 24 * 60 * 60 * 1000L)
    wordsStore.saveLastScheduledDate(timestamp)
    promise.resolve("Set to $daysAgo days ago")
}
```

---

## FAQ Técnico

### ¿Por qué 14 días y no más?

**Respuesta**: Limitaciones de Android:
- `setExactAndAllowWhileIdle()` tiene restricciones en frecuencia
- Demasiadas alarmas consumen recursos
- 14 días es balance entre comodidad y eficiencia

---

### ¿Qué pasa si el usuario desinstala y reinstala la app?

**Respuesta**:
- Se pierden todas las alarmas agendadas
- Se pierde SharedPreferences
- Al completar wizard nuevamente, se agenda todo desde cero

---

### ¿Funciona en modo avión?

**Respuesta**: ✅ **SÍ**
- Las alarmas están en el sistema operativo local
- No requieren internet para ejecutarse
- Solo requieren que el teléfono esté encendido

---

### ¿Funciona con batería baja?

**Respuesta**: ⚠️ **Depende**
- Con optimización de batería desactivada: ✅ SÍ
- Con optimización activada: ❌ Android puede omitir alarmas
- Por eso solicitamos `REQUEST_IGNORE_BATTERY_OPTIMIZATIONS`

---

### ¿Qué pasa si cambio la hora del teléfono?

**Respuesta**:
- Las alarmas usan `RTC_WAKEUP` (tiempo real del dispositivo)
- Si adelantas el reloj, las alarmas se disparan antes
- Si atrasas el reloj, las alarmas se retrasan

---

### ¿Cuántas notificaciones se programan realmente?

**Respuesta**: Depende de ventanas activas:

| Ventanas | Notificaciones por día | Total 14 días |
|----------|------------------------|---------------|
| 1 (morning) | 1 | 14 |
| 2 (morning + evening) | 2 | 28 |
| 3 (morning + afternoon + evening) | 3 | 42 |

**Nota**: El día actual puede tener menos si algunas horas ya pasaron.

---

### ¿Cómo cancelo todas las notificaciones?

**Desde React Native**:
```typescript
await NotificationModule.cancelAllNotifications()
```

**Desde Kotlin**:
```kotlin
scheduler.cancelAllNotifications()
```

---

## Conclusión

Este sistema de notificaciones está diseñado para ser:

✅ **Robusto**: Sobrevive a reinicios y modos de ahorro
✅ **Eficiente**: Solo reagenda cuando es necesario
✅ **Offline-first**: No depende de internet
✅ **Transparente**: Logs claros para debugging
✅ **Escalable**: Fácil agregar más ventanas o días

**Última actualización**: 5 de octubre de 2025
