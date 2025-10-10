# 🎨 Guía de Branding y Assets - Vocablox

## 📱 1. Cambiar Nombre de la App

### Nombre Actual
- **Nombre interno**: `VocabloxApp`
- **Nombre mostrado**: `VocabloxApp`

### Cambiar a "Vocablox"

#### Archivo 1: `app.json`
```json
{
  "name": "VocabloxApp",
  "displayName": "Vocablox"
}
```

#### Archivo 2: `android/app/src/main/res/values/strings.xml`
```xml
<resources>
    <string name="app_name">Vocablox</string>
    <string name="widget_description">Muestra palabra y significado del vocabulario</string>
</resources>
```

**✅ Resultado**: En el home screen de Android se mostrará "Vocablox" en lugar de "VocabloxApp"

---

## 🔔 2. Icono de Notificación

### ¿Dónde está el icono actual?
Actualmente no tienes un icono de notificación configurado. Android usa el icono de la app por defecto, lo cual no es ideal porque:
- Se ve pixelado en la barra de notificaciones
- No sigue las guidelines de Material Design
- Android requiere iconos monocromáticos (blanco sobre transparente) para notificaciones

### Herramientas para Crear Iconos de Notificación

#### Opción 1: Android Asset Studio (Recomendado - Gratis)
🔗 **URL**: https://romannurik.github.io/AndroidAssetStudio/icons-notification.html

**Ventajas**:
- ✅ Gratis
- ✅ Genera automáticamente todos los tamaños
- ✅ Exporta en formato correcto para Android
- ✅ Preview en tiempo real

**Cómo usar**:
1. Ve a la URL
2. Sube tu logo o diseño (formato PNG o SVG)
3. Ajusta el padding (recomendado: 25%)
4. Descarga el ZIP con todos los tamaños
5. Extrae y copia a `android/app/src/main/res/`

#### Opción 2: Figma + Plugin "Icon Resizer"
🔗 **URL**: https://www.figma.com

**Ventajas**:
- ✅ Control total del diseño
- ✅ Plugin para exportar múltiples tamaños
- ✅ Gratis con cuenta básica

#### Opción 3: Canva (Para no diseñadores)
🔗 **URL**: https://www.canva.com

**Ventajas**:
- ✅ Templates prediseñados
- ✅ Muy fácil de usar
- ✅ Exportar como PNG transparente

**Desventajas**:
- ❌ Tendrás que crear manualmente cada tamaño
- ❌ No genera automáticamente Android assets

### Requisitos del Icono de Notificación

#### Diseño
- ✅ **Solo blanco sobre transparente** (silueta)
- ✅ Sin gradientes, sin sombras, sin colores
- ✅ Forma simple y reconocible
- ✅ Padding de 25% alrededor del diseño
- ✅ Formato PNG

#### Tamaños Necesarios (en píxeles)
```
drawable-mdpi/ic_notification.png       → 24x24 px
drawable-hdpi/ic_notification.png       → 36x36 px
drawable-xhdpi/ic_notification.png      → 48x48 px
drawable-xxhdpi/ic_notification.png     → 72x72 px
drawable-xxxhdpi/ic_notification.png    → 96x96 px
```

### Estructura de Carpetas
```
android/app/src/main/res/
├── drawable-mdpi/
│   └── ic_notification.png (24x24)
├── drawable-hdpi/
│   └── ic_notification.png (36x36)
├── drawable-xhdpi/
│   └── ic_notification.png (48x48)
├── drawable-xxhdpi/
│   └── ic_notification.png (72x72)
└── drawable-xxxhdpi/
    └── ic_notification.png (96x96)
```

### Código para Usar el Icono (ya está implementado)

En tu código actual (`NotificationHelper.kt`), debes asegurarte de tener:

```kotlin
.setSmallIcon(R.drawable.ic_notification) // Tu icono de notificación
.setColor(Color.parseColor("#9B59B6"))    // Color de acento (morado de tu app)
```

---

## 🖼️ 3. Icono de la App (Launcher Icon)

### Herramientas Recomendadas

#### Opción 1: Android Asset Studio - Icon Generator (Mejor opción)
🔗 **URL**: https://romannurik.github.io/AndroidAssetStudio/icons-launcher.html

**Características**:
- ✅ Genera todos los tamaños automáticamente
- ✅ Preview de adaptive icon (Android 8+)
- ✅ Genera tanto redondo como cuadrado
- ✅ Exporta estructura completa de carpetas

**Cómo usar**:
1. Ve a la URL
2. Sube tu logo/diseño (1024x1024 recomendado)
3. Elige:
   - **Foreground**: Tu diseño principal
   - **Background**: Color sólido o imagen de fondo
4. Ajusta padding y escala
5. Descarga ZIP
6. Reemplaza carpetas `mipmap-*` en `android/app/src/main/res/`

#### Opción 2: Icon Kitchen
🔗 **URL**: https://icon.kitchen

**Características**:
- ✅ Muy visual y fácil de usar
- ✅ Genera iconos adaptativos
- ✅ Preview en diferentes launchers
- ✅ Gratis

#### Opción 3: App Icon Generator (Online)
🔗 **URL**: https://www.appicon.co

**Características**:
- ✅ Genera iconos para Android e iOS
- ✅ Un solo upload para todos los tamaños
- ✅ Gratis

#### Opción 4: Figma con Plugin "Figma to Android"
Para diseñadores que quieren control total.

### Tamaños del Icono de App (Launcher)

#### Iconos Tradicionales (mipmap)
```
mipmap-mdpi/ic_launcher.png           → 48x48 px
mipmap-hdpi/ic_launcher.png           → 72x72 px
mipmap-xhdpi/ic_launcher.png          → 96x96 px
mipmap-xxhdpi/ic_launcher.png         → 144x144 px
mipmap-xxxhdpi/ic_launcher.png        → 192x192 px

mipmap-mdpi/ic_launcher_round.png     → 48x48 px
mipmap-hdpi/ic_launcher_round.png     → 72x72 px
mipmap-xhdpi/ic_launcher_round.png    → 96x96 px
mipmap-xxhdpi/ic_launcher_round.png   → 144x144 px
mipmap-xxxhdpi/ic_launcher_round.png  → 192x192 px
```

#### Adaptive Icons (Android 8+)
```xml
mipmap-anydpi-v26/ic_launcher.xml
mipmap-anydpi-v26/ic_launcher_round.xml
```

```
drawable/ic_launcher_background.xml    (o PNG)
drawable/ic_launcher_foreground.xml    (o PNG)
```

### Estructura de Carpetas Completa
```
android/app/src/main/res/
├── mipmap-mdpi/
│   ├── ic_launcher.png
│   └── ic_launcher_round.png
├── mipmap-hdpi/
│   ├── ic_launcher.png
│   └── ic_launcher_round.png
├── mipmap-xhdpi/
│   ├── ic_launcher.png
│   └── ic_launcher_round.png
├── mipmap-xxhdpi/
│   ├── ic_launcher.png
│   └── ic_launcher_round.png
├── mipmap-xxxhdpi/
│   ├── ic_launcher.png
│   └── ic_launcher_round.png
├── mipmap-anydpi-v26/
│   ├── ic_launcher.xml
│   └── ic_launcher_round.xml
└── drawable/
    ├── ic_launcher_background.xml (o .png)
    └── ic_launcher_foreground.xml (o .png)
```

---

## 📐 4. Consideraciones para Android 15 (API 35)

### Nuevo en Android 15

#### 1. **Adaptive Icons Obligatorios**
- ❗ Android 15 **requiere** iconos adaptativos
- No usar solo PNG estático
- Debe tener `foreground` y `background` separados

#### 2. **Formato del Icono Adaptativo**

**ic_launcher.xml** (en `mipmap-anydpi-v26/`):
```xml
<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@drawable/ic_launcher_background"/>
    <foreground android:drawable="@drawable/ic_launcher_foreground"/>
    <monochrome android:drawable="@drawable/ic_launcher_foreground"/> <!-- NUEVO en Android 13+ -->
</adaptive-icon>
```

**NUEVO**: El atributo `<monochrome>` es obligatorio para Android 13+ (API 33) para el tema de iconos monocromáticos.

#### 3. **Imágenes en el APK - Optimización Obligatoria**

##### WebP en lugar de PNG (Recomendado)
- Android 15 optimiza mejor con WebP
- Reduce tamaño del APK hasta 30%
- Soporte nativo desde Android 4.0+

**Herramienta de conversión**:
```bash
# Usar cwebp (de Google)
brew install webp  # macOS
# o descargar de https://developers.google.com/speed/webp/download

# Convertir PNG a WebP
cwebp -q 80 input.png -o output.webp
```

##### Vector Drawables (SVG)
- Para iconos simples, usar SVG en lugar de PNG
- Se escalan perfectamente en cualquier densidad
- Tamaño de archivo mucho menor

**Ejemplo**:
```xml
<!-- drawable/ic_notification.xml -->
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="24dp"
    android:height="24dp"
    android:viewportWidth="24"
    android:viewportHeight="24">
    <path
        android:fillColor="#FFFFFF"
        android:pathData="M12,2C6.48,2 2,6.48 2,12s4.48,10 10,10..."/>
</vector>
```

#### 4. **App Bundle (.aab) en lugar de APK**

Google Play **requiere** Android App Bundle desde 2021:
- ✅ Genera APKs optimizados por dispositivo
- ✅ Descarga más pequeña (solo recursos necesarios)
- ✅ Optimización automática de imágenes

**Generar AAB**:
```bash
cd android
./gradlew bundleRelease
# Output: android/app/build/outputs/bundle/release/app-release.aab
```

#### 5. **Densidades de Pantalla Soportadas**

Android 15 recomienda incluir estas densidades:
- ✅ **mdpi** (160 dpi) - Phones antiguos
- ✅ **hdpi** (240 dpi) - Phones antiguos
- ✅ **xhdpi** (320 dpi) - Phones estándar
- ✅ **xxhdpi** (480 dpi) - Phones modernos
- ✅ **xxxhdpi** (640 dpi) - Phones premium

**Opcional** (si quieres reducir tamaño de APK):
- ❌ Puedes omitir `mdpi` y `hdpi` si solo apuntas a devices modernos

#### 6. **Compresión de Recursos**

En `android/app/build.gradle`:
```gradle
android {
    buildTypes {
        release {
            // Habilitar shrinking de recursos no usados
            shrinkResources true
            minifyEnabled true

            // Usar R8 para optimizar código
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt')
        }
    }

    // NUEVO en Android 15: Compresión nativa de assets
    androidResources {
        noCompress 'webp', 'json'
    }
}
```

#### 7. **Night Mode Icons (Recomendado)**

Android 15 mejora soporte para tema oscuro:

Crear versión nocturna del icono:
```
drawable-night/ic_notification.xml
```

#### 8. **Preview Icons (Para Play Store)**

Tamaños requeridos para Google Play:
- **High-res icon**: 512x512 PNG (obligatorio)
- **Feature graphic**: 1024x500 PNG (opcional pero recomendado)
- **Screenshots**: Mínimo 2, máximo 8 (1080x1920 o 1920x1080)

---

## 🎨 Paleta de Colores Vocablox (Para diseñadores)

Para mantener consistencia en todos los assets:

```
Primario (Morado):     #9B59B6
Secundario (Beige):    #F5F5DC
Texto Oscuro:          #333333
Texto Claro:           #666666
Texto Muy Claro:       #E0E0E0
Blanco:                #FFFFFF
Fondo Card:            #FFFFFF
```

---

## 📋 Checklist de Assets Completos

### Iconos de App
- [ ] `ic_launcher.png` (todos los tamaños en mipmap-*)
- [ ] `ic_launcher_round.png` (todos los tamaños)
- [ ] `ic_launcher.xml` (adaptive icon)
- [ ] `ic_launcher_background` (PNG o XML)
- [ ] `ic_launcher_foreground` (PNG o XML)
- [ ] High-res icon 512x512 para Play Store

### Iconos de Notificación
- [ ] `ic_notification.png` (todos los tamaños en drawable-*)
- [ ] Versión monocromática (blanco sobre transparente)

### Play Store Assets
- [ ] Feature graphic 1024x500
- [ ] Screenshots (mínimo 2)
- [ ] Promo video (opcional)

### Optimización
- [ ] Convertir PNGs grandes a WebP
- [ ] Usar vector drawables para iconos simples
- [ ] Habilitar shrinkResources en build.gradle
- [ ] Generar App Bundle (.aab) para producción

---

## 🚀 Comandos Útiles

### Limpiar y Reconstruir (Después de cambiar assets)
```bash
cd android
./gradlew clean
cd ..
npx react-native run-android
```

### Generar Release APK
```bash
cd android
./gradlew assembleRelease
# Output: android/app/build/outputs/apk/release/app-release.apk
```

### Generar App Bundle (Para Play Store)
```bash
cd android
./gradlew bundleRelease
# Output: android/app/build/outputs/bundle/release/app-release.aab
```

---

## 📚 Recursos Adicionales

### Documentación Oficial
- **Android Asset Studio**: https://romannurik.github.io/AndroidAssetStudio
- **Material Design Icons**: https://fonts.google.com/icons
- **Android Icon Guidelines**: https://developer.android.com/distribute/google-play/resources/icon-design-specifications

### Herramientas de Diseño
- **Figma** (Gratis): https://figma.com
- **Canva** (Fácil): https://canva.com
- **GIMP** (Gratis, avanzado): https://gimp.org
- **Photopea** (Photoshop online gratis): https://photopea.com

### Conversión de Formatos
- **CloudConvert**: https://cloudconvert.com (PNG → WebP)
- **TinyPNG**: https://tinypng.com (Comprimir PNGs)
- **Squoosh**: https://squoosh.app (Optimizar imágenes)

---

## 💡 Recomendaciones Finales

1. **Icono de App**: Debe ser memorable y reconocible incluso a 48x48px
2. **Icono de Notificación**: Silueta simple, monocromática
3. **Consistencia**: Usar misma paleta de colores en todos los assets
4. **Testing**: Probar iconos en diferentes launchers y temas
5. **Adaptive Icons**: Obligatorio para Android moderno (8+)
6. **Optimización**: Convertir a WebP reduce tamaño de APK significativamente
7. **Play Store**: Crear assets profesionales aumenta descargas 3-5x
