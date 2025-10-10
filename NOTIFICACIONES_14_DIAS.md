# SISTEMA DE NOTIFICACIONES - 14 DÍAS ADELANTADOS

## Resumen del cambio

**ANTES**: Las notificaciones se agendaban solo para 1 día y se reprogramaban automáticamente cada día.

**AHORA**: Las notificaciones se agendan para **14 días completos** y solo se reprograman cuando el usuario abre la app después de que hayan vencido.

---

## ¿Cómo funciona?

### 1. Al completar el wizard

Cuando el usuario completa el wizard (`useWizardViewModel.ts:126-237`):

1. **Se guardan las palabras** en almacenamiento nativo (SharedPreferences)
2. **Se programan 14 días de notificaciones** de una sola vez
3. **Se guarda el timestamp** de cuándo se programaron

**Ejemplo**: Si completas el wizard el 5 de octubre a las 3:00 PM:
- Se agendan notificaciones hasta el **19 de octubre**
- Cada día con las ventanas configuradas (morning, afternoon, evening)

### 2. Al abrir la app después

Cada vez que el usuario abre el Home (`useNotifications.ts:19-32`):

1. **Se verifica** si ya pasaron 14 días desde la última programación
2. **Si NO han pasado 14 días**: No hace nada, las notificaciones siguen vigentes
3. **Si SÍ pasaron 14 días**: Reprograma automáticamente otros 14 días

**Ejemplo**:
- Programaste el 5 de octubre
- Abres la app el 10 de octubre → **No reprograma** (solo pasaron 5 días)
- Abres la app el 20 de octubre → **SÍ reprograma** (ya pasaron 15 días)

### 3. Al reiniciar el teléfono

El `BootReceiver.kt` detecta cuando el dispositivo se reinicia y:

1. Lee la configuración guardada (categorías, horarios, nickname)
2. **Reprograma 14 días completos** automáticamente
3. El usuario NO pierde sus notificaciones

---

## Ventajas del nuevo sistema

✅ **El usuario no necesita abrir la app diariamente**
   - Las notificaciones ya están programadas para 2 semanas

✅ **Resistente a apagados del teléfono**
   - El BootReceiver reprograma automáticamente al reiniciar

✅ **Menos consumo de batería**
   - No hay reprogramaciones diarias automáticas

✅ **Funciona offline**
   - Una vez programadas, no requiere internet ni que la app esté abierta

✅ **Sobrevive a Doze Mode**
   - Usa `setExactAndAllowWhileIdle()` para ignorar optimización de batería

---

## Ejemplo de flujo completo

### Escenario: Usuario configura 2 sesiones diarias

**Configuración del wizard**:
```javascript
{
  bursts_per_day: 2,
  active_windows: ["morning", "evening"],
  window_times: {
    morning: "08:00",
    evening: "20:00"
  },
  categories: ["technology", "business"],
  words_per_burst: 3,
  nickname: "María"
}
```

**Resultado al terminar el wizard (5 oct)**:

Se programan **28 notificaciones** (2 por día × 14 días):

```
Día 0 (5 oct):  08:00 AM, 20:00 PM
Día 1 (6 oct):  08:00 AM, 20:00 PM
Día 2 (7 oct):  08:00 AM, 20:00 PM
...
Día 13 (18 oct): 08:00 AM, 20:00 PM
```

**Timeline**:
- **5 oct**: Completa wizard → Se agendan 14 días
- **6 oct**: Recibe notificación a las 8:00 AM ✅
- **7 oct**: Recibe notificación a las 8:00 AM ✅
- **8 oct**: Usuario apaga el teléfono 🔴
- **9 oct**: Usuario enciende el teléfono → BootReceiver reprograma 14 días ✅
- **9 oct**: Recibe notificación a las 8:00 AM ✅
- **10-18 oct**: Siguen llegando notificaciones (usuario NO abre la app) ✅
- **19 oct**: Última notificación programada ⚠️
- **20 oct**: Usuario abre la app → **Detecta vencimiento** → Reprograma 14 días más ✅
- **20 oct**: Recibe notificación a las 8:00 AM ✅

---

## Archivos modificados

### Android (Kotlin)

1. **WordsDataStore.kt** (líneas 91-99)
   - Agregado: `saveLastScheduledDate()` y `getLastScheduledDate()`

2. **NotificationScheduler.kt** (completo reescrito)
   - Nueva función: `scheduleTwoWeeksNotifications()`
   - Nueva función: `needsRescheduling()`
   - IDs únicos por día: `"${window}_day${dayOffset}".hashCode()`

3. **NotificationReceiver.kt** (líneas 26-73)
   - Eliminado: `reprogramAlarmForTomorrow()`
   - Ahora solo muestra la notificación, NO reprograma

4. **NotificationModule.kt** (líneas 17-85)
   - Modificado: `scheduleNotifications()` ahora usa `scheduleTwoWeeksNotifications()`
   - Agregado: `checkAndRescheduleIfNeeded()` (nuevo método expuesto a React Native)

5. **BootReceiver.kt** (líneas 12-43)
   - Ahora usa `scheduleTwoWeeksNotifications()` en lugar de agendar 1 día

### React Native (TypeScript)

6. **notificationService.ts** (líneas 27-28)
   - Agregado: Interfaz para `checkAndRescheduleIfNeeded()`

7. **useNotifications.ts** (líneas 11-50)
   - Eliminado: `setupNotifications()` automático
   - Agregado: `checkAndReschedule()` que solo verifica si necesita reprogramar
   - Agregado: `updateWordsIfNeeded()` para actualizar palabras cuando se reprograma

---

## Logs para debugging

### Al completar wizard

```
NotificationScheduler: Scheduling notifications for 14 days
NotificationScheduler: Active windows: [morning, evening]
NotificationScheduler: Window times: {morning=08:00, evening=20:00}
NotificationScheduler: Scheduled: morning Day+0 at 8:0 -> Sat Oct 05 08:00:00 GMT-06:00 2025 (ID: 123456)
NotificationScheduler: Scheduled: evening Day+0 at 20:0 -> Sat Oct 05 20:00:00 GMT-06:00 2025 (ID: 789012)
NotificationScheduler: Scheduled: morning Day+1 at 8:0 -> Sun Oct 06 08:00:00 GMT-06:00 2025 (ID: 123457)
...
NotificationScheduler: ✅ Successfully scheduled 28 notifications for 14 days
```

### Al abrir la app (NO necesita reprogramar)

```
Checking if notifications need rescheduling...
NotificationScheduler: Days since last schedule: 5, needs reschedule: false
Reschedule check result: Notifications still valid, no rescheduling needed
```

### Al abrir la app (SÍ necesita reprogramar)

```
Checking if notifications need rescheduling...
NotificationScheduler: Days since last schedule: 15, needs reschedule: true
NotificationScheduler: Scheduling notifications for 14 days
NotificationScheduler: ✅ Successfully scheduled 28 notifications for 14 days
Reschedule check result: Rescheduled notifications for 14 more days
Updated 100 words in native storage
```

### Al reiniciar el teléfono

```
BootReceiver: Device booted, rescheduling notifications for 14 days
NotificationScheduler: Scheduling notifications for 14 days
NotificationScheduler: ✅ Successfully scheduled 28 notifications for 14 days
BootReceiver: Successfully rescheduled 14 days of notifications after boot
```

### Al mostrar una notificación

```
NotificationReceiver: onReceive triggered: com.vocabox.hermes.SHOW_NOTIFICATION
NotificationReceiver: Showing notification for window: morning at 8:0 (Day: 5)
NotificationReceiver: Notification shown. No rescheduling needed (already scheduled for 14 days)
```

---

## Verificar que todo funciona

### 1. Verificar que se programaron 14 días

Ejecuta en terminal después de completar el wizard:

```bash
adb shell dumpsys alarm | grep vocabox
```

Deberías ver múltiples alarmas programadas para los próximos 14 días.

### 2. Verificar fecha de última programación

```bash
adb shell run-as com.vocabox.hermes cat /data/data/com.vocabox.hermes/shared_prefs/words_storage.xml
```

Busca la línea:
```xml
<long name="last_scheduled_date" value="1728156000000" />
```

### 3. Forzar verificación de reprogramación

Abre la app y busca en Logcat:
```
Days since last schedule: X, needs reschedule: false
```

### 4. Simular reinicio del teléfono

```bash
adb reboot
```

Después del reinicio, verifica en Logcat:
```
BootReceiver: Successfully rescheduled 14 days of notifications after boot
```

---

## Preguntas frecuentes

### ¿Qué pasa si el usuario no abre la app en 14 días?

**Respuesta**: Las notificaciones dejan de llegar después del día 14. Cuando el usuario abra la app por primera vez, se detectará que pasaron 14+ días y se reprogramarán automáticamente otros 14 días.

### ¿Qué pasa si el teléfono se apaga durante 3 días?

**Respuesta**: Cuando el teléfono se encienda, el `BootReceiver` reprogramará automáticamente 14 días completos. El usuario NO pierde ninguna configuración.

### ¿Cuántas notificaciones se programan en total?

**Respuesta**: Depende de las ventanas activas:
- **1 sesión/día** (morning): 14 notificaciones (1 × 14 días)
- **2 sesiones/día** (morning + evening): 28 notificaciones (2 × 14 días)
- **3 sesiones/día** (morning + afternoon + evening): 42 notificaciones (3 × 14 días)

### ¿Puede el usuario cambiar la configuración después?

**Respuesta**: Sí, cuando cambie la configuración (categorías, horarios, etc.), el sistema cancelará todas las notificaciones anteriores y programará nuevas 14 días con la nueva configuración.

### ¿Afecta la batería del teléfono?

**Respuesta**: No. Android gestiona eficientemente las alarmas programadas. Usar `setExactAndAllowWhileIdle()` solo consume batería en el momento exacto de mostrar la notificación, no mientras están programadas.

---

## Resumen técnico

| Aspecto | Implementación |
|---------|----------------|
| **Días programados** | 14 días completos |
| **IDs únicos** | `"${window}_day${dayOffset}".hashCode()` |
| **Almacenamiento** | SharedPreferences (words_storage.xml) |
| **Persistencia** | Timestamp de última programación guardado |
| **Verificación** | Cada vez que se abre el Home |
| **Condición de reprogramación** | `daysSinceLastSchedule >= 14` |
| **Al reiniciar** | BootReceiver reprograma 14 días |
| **Cancelación** | 42 alarmas (14 días × 3 ventanas máximo) |
| **Tipo de alarma** | `setExactAndAllowWhileIdle()` (Android 6+) |
| **Resistente a Doze** | ✅ Sí |

---

## Testing recomendado

1. ✅ Completar wizard y verificar que se programaron 14 días
2. ✅ Esperar a recibir una notificación
3. ✅ Abrir la app antes de 14 días → No debe reprogramar
4. ✅ Simular reinicio del teléfono → Debe reprogramar
5. ✅ Cambiar timestamp manualmente a 15 días atrás → Debe reprogramar al abrir app
6. ✅ Verificar que las palabras se actualizan cuando se reprograma

---

**Última actualización**: 5 de octubre de 2025
