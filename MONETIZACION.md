# 💰 Sistema de Monetización - VocabloxApp

## 📋 Modelo de Negocio: Freemium con Suscripción

### Objetivo
Implementar un modelo freemium donde usuarios pueden usar la app gratuitamente con anuncios, o suscribirse para eliminar los anuncios y obtener experiencia premium.

### Estrategia Dual
1. **Usuarios Gratis**: Monetización vía anuncios (AdMob)
2. **Usuarios Premium**: Monetización vía suscripción (RevenueCat)

---

## 💎 Sistema de Suscripciones (RevenueCat)

### Planes de Suscripción

#### Plan Mensual
- **Precio sugerido**: $2.99 USD/mes
- **Beneficios**:
  - ❌ Sin anuncios
  - ⚡ Experiencia fluida sin interrupciones
  - 📊 Estadísticas avanzadas (futura)
  - 🎨 Fondos premium exclusivos (futura)

#### Plan Trimestral (Ahorro 15%)
- **Precio sugerido**: $6.99 USD/3 meses (~$2.33/mes)
- **Beneficios**: Mismo que mensual + ahorro
- **Badge**: "Más Popular"

#### Plan Anual (Ahorro 30%)
- **Precio sugerido**: $24.99 USD/año (~$2.08/mes)
- **Beneficios**: Mismo que mensual + máximo ahorro
- **Badge**: "Mejor Valor"

### Implementación con RevenueCat

#### ¿Por qué RevenueCat?
- ✅ Gestiona suscripciones iOS y Android desde un solo lugar
- ✅ Maneja renovaciones, cancelaciones y reembolsos automáticamente
- ✅ Validación de recibos en servidor (anti-piratería)
- ✅ Analytics de revenue en tiempo real
- ✅ A/B testing de precios
- ✅ Webhooks para sincronizar con tu backend
- ✅ Gratis hasta $10k MRR (Monthly Recurring Revenue)

#### Stack Técnico
- **Librería**: `react-native-purchases` (SDK oficial de RevenueCat)
- **Plataformas**: Google Play Store + Apple App Store
- **Dashboard**: app.revenuecat.com

---

## 🎯 Flujo de Usuario Premium

### 1. Primera Apertura de App
- Mostrar **Paywall Modal** después del wizard inicial
- Título: "¡Aprende sin interrupciones!"
- Subtítulo: "Elimina los anuncios y disfruta de VocaBlox Premium"
- Botones:
  - "Probar Gratis 7 días" (con suscripción mensual)
  - "Continuar con anuncios" (versión gratis)

### 2. Durante Uso de App Gratis
- Mostrar **banner sutil** en Settings: "🌟 Hazte Premium - Sin anuncios"
- Después de ver 5 anuncios en una sesión: mostrar **upgrade prompt**
- Mensajes contextuales:
  - "¿Cansado de anuncios? Prueba Premium gratis 7 días"

### 3. Pantalla de Suscripción
- Localización: `src/views/subscription/SubscriptionScreen.tsx`
- Diseño:
  - Header con beneficios premium
  - Comparación Free vs Premium
  - 3 opciones de planes (mensual, trimestral, anual)
  - Destacar plan trimestral como "Más Popular"
  - Footer con "Restaurar compras" y términos

### 4. Verificación de Suscripción
- Servicio: `src/services/subscriptionService.ts`
- Redux: `src/store/slices/subscriptionSlice.ts`
- Estado global: `isPremium: boolean`
- Al abrir app: verificar suscripción con RevenueCat
- Si `isPremium === true`: NO mostrar anuncios

---

## 📋 Estrategia de Anuncios (Usuarios Gratis)

### Regla Global
**❌ NO mostrar anuncios si `isPremium === true`**

## 🎯 Reglas de Monetización

### 1. **Entrada a la Aplicación**
- **Cuándo**: Al abrir la app (después del splash screen)
- **Tipo de anuncio**: Interstitial
- **Frecuencia**: Una vez por sesión (primera vez que se abre la app)
- **Excepción**: No mostrar si la app estuvo en background menos de 5 minutos

### 2. **Navegación a Juegos**
- **Cuándo**: Al entrar a cada sección de juegos
  - Quiz (FlashQuiz)
  - Ahorcado (Hangman)
  - Memorándum (Memory Game)
- **Tipo de anuncio**: Interstitial
- **Frecuencia**: Una vez por entrada a cada juego
- **Cooldown**: Mínimo 30 segundos entre anuncios

### 3. **Cambio de Fondo**
- **Cuándo**: Al abrir el modal de selección de fondos
- **Tipo de anuncio**: Interstitial
- **Frecuencia**: Cada vez que se abre el modal
- **Excepción**: No mostrar si ya se mostró un anuncio en los últimos 60 segundos

### 4. **Reinicio de Juegos**
- **Cuándo**: Al presionar el botón "Reiniciar" en:
  - Quiz: Botón de reiniciar quiz
  - Ahorcado: Botón de nuevo juego
  - Memorándum: Botón de reiniciar
- **Tipo de anuncio**: Interstitial
- **Frecuencia**: Cada reinicio
- **Cooldown**: Mínimo 20 segundos entre anuncios

---

## 🛠️ Implementación Técnica

### Stack Tecnológico Recomendado

#### Opción 1: **Google AdMob** (Recomendado)
- **Librería**: `react-native-google-mobile-ads`
- **Ventajas**:
  - Mayor eCPM (revenue por mil impresiones)
  - Mejor fill rate
  - Integración nativa con Google
  - Soporte para múltiples formatos
- **Tipos de anuncios a usar**:
  - Interstitial Ads (pantalla completa)
  - Rewarded Ads (opcional para features premium)

#### Opción 2: **Facebook Audience Network**
- **Librería**: `react-native-fbads`
- **Ventajas**:
  - Buen revenue
  - Alternativa a AdMob
- **Desventajas**:
  - Requiere Facebook App ID

#### Opción 3: **AdMob + Mediation** (Máximo Revenue)
- Usar AdMob como plataforma principal
- Agregar mediación con:
  - Facebook Audience Network
  - Unity Ads
  - AppLovin
- **Ventaja**: Competencia entre redes = mayor CPM

---

## 📊 Arquitectura del Sistema

### Servicio Central de Anuncios
```typescript
// src/services/adsService.ts
- AdManager
  - loadInterstitialAd()
  - showInterstitialAd()
  - canShowAd() // Verifica cooldown y reglas
  - trackAdImpression()
```

### Control de Frecuencia
```typescript
// src/store/slices/adsSlice.ts
- Estado Redux para tracking:
  - lastAdShown: timestamp
  - adsShownToday: number
  - cooldownActive: boolean
  - adLocations: { [key: string]: timestamp }
```

### Puntos de Integración

1. **App Entry Point**
   - `App.tsx` o `index.js`
   - Después de cargar datos iniciales

2. **Navegación a Juegos**
   - `src/navigation/AppStackNavigator.tsx`
   - useEffect en cada screen de juego

3. **Modal de Fondos**
   - `src/components/BackgroundChangeModal.tsx`
   - onOpen event

4. **Botones de Reinicio**
   - `src/features/games/flashQuiz/QuizScreen.tsx`
   - `src/features/games/hangman/HangmanScreen.tsx`
   - `src/features/games/memorandum/MemoScreen.tsx`

---

## 🚀 Plan de Implementación

### Fase 1: Setup Inicial
1. ✅ Crear cuenta de AdMob
2. ✅ Obtener App ID y Ad Unit IDs
3. ✅ Instalar librería: `npm install react-native-google-mobile-ads`
4. ✅ Configurar `app.json` con App ID
5. ✅ Configurar permisos nativos (iOS/Android)

### Fase 2: Servicio de Anuncios
1. ✅ Crear `src/services/adsService.ts`
2. ✅ Implementar lógica de cooldown
3. ✅ Crear Redux slice para tracking
4. ✅ Implementar logging de impresiones

### Fase 3: Integración
1. ✅ App Entry Point
2. ✅ Navegación a juegos
3. ✅ Modal de fondos
4. ✅ Botones de reinicio

### Fase 4: Testing & Optimización
1. ✅ Test con IDs de prueba
2. ✅ Verificar user experience
3. ✅ Ajustar frecuencias
4. ✅ Monitorear revenue

---

## 💡 Mejores Prácticas

### UX Considerations
- ⏱️ **Cooldown mínimo**: Nunca menos de 20 segundos
- 📊 **Daily cap**: Máximo 20 anuncios por día por usuario
- 🎯 **Contextual**: Anuncios en momentos naturales de pausa
- ⚡ **Performance**: Precargar anuncios para evitar delay

### Revenue Optimization
- 📈 **A/B Testing**: Probar diferentes frecuencias
- 🎯 **Segmentación**: Usuarios nuevos vs recurrentes
- 💰 **Waterfall**: Implementar mediation para maximizar fill rate
- 📊 **Analytics**: Monitorear eCPM, impresiones, revenue

### Compliance
- 🔒 **GDPR/CCPA**: Implementar consent forms
- 👶 **COPPA**: Si hay usuarios menores de 13 años
- 📱 **App Store**: Seguir guidelines de Apple/Google

---

## 📈 KPIs a Monitorear

- **Impresiones diarias**: Total de anuncios mostrados
- **eCPM**: Revenue efectivo por mil impresiones
- **Fill Rate**: % de requests con anuncio servido
- **CTR**: Click-through rate
- **Retention**: Impacto en retención de usuarios
- **Session Length**: Impacto en duración de sesión

---

---

## 🚀 Plan de Implementación Completo

### Fase 1: RevenueCat Setup
1. ⬜ Crear cuenta en RevenueCat (app.revenuecat.com)
2. ⬜ Crear proyecto y obtener API Keys (iOS + Android)
3. ⬜ Configurar productos en Google Play Console:
   - `vocablox_monthly` ($2.99/mes)
   - `vocablox_quarterly` ($6.99/3 meses)
   - `vocablox_yearly` ($24.99/año)
4. ⬜ Configurar productos en App Store Connect (mismos IDs)
5. ⬜ Vincular productos en RevenueCat Dashboard
6. ⬜ Configurar "Entitlements": `premium` (activo si tiene cualquier suscripción)
7. ⬜ Instalar: `npm install react-native-purchases`

### Fase 2: Suscripciones
1. ⬜ Crear `src/services/subscriptionService.ts`
2. ⬜ Crear `src/store/slices/subscriptionSlice.ts`
3. ⬜ Crear `src/views/subscription/SubscriptionScreen.tsx`
4. ⬜ Crear `src/components/PaywallModal.tsx`
5. ⬜ Crear `src/components/PremiumBanner.tsx`
6. ⬜ Implementar lógica de verificación al inicio
7. ⬜ Agregar "Restaurar compras" en Settings

### Fase 3: AdMob Setup
1. ⬜ Crear cuenta de AdMob
2. ⬜ Obtener App ID y Ad Unit IDs
3. ⬜ Instalar: `npm install react-native-google-mobile-ads`
4. ⬜ Configurar `app.json` con App ID
5. ⬜ Configurar permisos nativos (iOS/Android)

### Fase 4: Servicio de Anuncios
1. ⬜ Crear `src/services/adsService.ts`
2. ⬜ Implementar lógica de cooldown
3. ⬜ Crear Redux slice para tracking
4. ⬜ **IMPORTANTE**: Verificar `isPremium` antes de mostrar ads
5. ⬜ Implementar logging de impresiones

### Fase 5: Integración de Anuncios
1. ⬜ App Entry Point (solo si NO premium)
2. ⬜ Navegación a juegos (solo si NO premium)
3. ⬜ Modal de fondos (solo si NO premium)
4. ⬜ Botones de reinicio (solo si NO premium)
5. ⬜ Agregar banner premium en Settings

### Fase 6: Testing
1. ⬜ Test suscripciones con sandbox (iOS + Android)
2. ⬜ Test anuncios con IDs de prueba
3. ⬜ Verificar que premium elimina anuncios
4. ⬜ Test "Restaurar compras"
5. ⬜ Test flujo completo: gratis → premium → renovación

### Fase 7: Producción
1. ⬜ Cambiar a IDs de producción (AdMob + RevenueCat)
2. ⬜ Configurar webhooks de RevenueCat (opcional)
3. ⬜ Deploy a TestFlight / Google Play Beta
4. ⬜ Monitorear primeros usuarios
5. ⬜ Ajustar precios según conversión

---

## 🔄 Funcionalidades Premium Futuras

### Features Exclusivas para Suscriptores
- 📊 **Estadísticas Avanzadas**: Gráficas de progreso, palabras dominadas, streaks
- 🎨 **Fondos Premium**: Colección exclusiva de wallpapers
- 🏆 **Logros y Badges**: Sistema de gamificación completo
- 📚 **Categorías Premium**: Vocabulario especializado (negocios, medicina, etc.)
- ☁️ **Backup en la nube**: Sincronización entre dispositivos
- 👥 **Modo multijugador**: Competir con amigos
- 🎯 **Objetivos personalizados**: Planes de estudio customizados

### Rewarded Ads (Usuarios Gratis)
- Ver un anuncio voluntario para:
  - Desbloquear 1 fondo premium por 24 horas
  - Obtener 2x palabras en una sesión
  - Desbloquear estadísticas del día

---

## 📝 Notas de Implementación

### RevenueCat IDs Necesarios
```
Public API Key (iOS): rcb_XXXXXXXXXXXXXXXXXXXXXXXX
Public API Key (Android): rcb_YYYYYYYYYYYYYYYYYYYYYYYY

Entitlement ID: premium
Product IDs:
  - vocablox_monthly
  - vocablox_quarterly
  - vocablox_yearly
```

### AdMob IDs Necesarios
```
App ID: ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY
Interstitial Ad Unit ID: ca-app-pub-XXXXXXXXXXXXXXXX/ZZZZZZZZZZ
```

### Test IDs (Para desarrollo)
```
RevenueCat: Usa sandbox de Google/Apple automáticamente
Android Interstitial: ca-app-pub-3940256099942544/1033173712
iOS Interstitial: ca-app-pub-3940256099942544/4411468910
```

---

## 💰 Proyección de Revenue

### Escenario Conservador
Suponiendo 1,000 usuarios activos mensuales:
- **Usuarios Premium (5%)**: 50 usuarios × $2.99 = **$149.50/mes**
- **Usuarios Gratis (95%)**: 950 usuarios × $0.50 eCPM × 100 impresiones = **$47.50/mes**
- **Total**: ~**$197/mes** o **$2,364/año**

### Escenario Optimista
Suponiendo 10,000 usuarios activos mensuales:
- **Usuarios Premium (10%)**: 1,000 usuarios × $2.99 = **$2,990/mes**
- **Usuarios Gratis (90%)**: 9,000 usuarios × $0.50 eCPM × 100 impresiones = **$450/mes**
- **Total**: ~**$3,440/mes** o **$41,280/año**

### Factores Clave para Conversión
- 📊 **Trial de 7 días**: Aumenta conversión 3-5x
- 🎯 **Paywall timing**: Mostrar después de 3-5 sesiones aumenta conversión
- 💬 **Social proof**: "Únete a 1,000+ usuarios premium"
- ⚡ **Urgencia**: "Oferta especial: 30% off primer mes"

---

## ⚠️ Consideraciones Importantes

### Legal y Compliance
1. **Términos de Servicio**: Crear términos específicos para suscripciones
2. **Política de Privacidad**: Actualizar con info de RevenueCat y AdMob
3. **Cancelación**: Debe ser fácil cancelar desde Settings
4. **Reembolsos**: Política clara (manejado por Apple/Google)
5. **GDPR**: Consent para anuncios personalizados en EU

### UX Considerations
1. **No abusar**: Máximo 20 anuncios/día para usuarios gratis
2. **Balance**: Experiencia gratis debe ser usable
3. **Contexto**: Anuncios en momentos naturales de pausa
4. **Performance**: No afectar velocidad de la app
5. **Transparencia**: Usuarios deben entender qué obtienen con premium

### Technical
1. **Testing**: Siempre probar con IDs de test y sandbox primero
2. **Error handling**: Manejar fallos de red en suscripciones
3. **Restore purchases**: Crucial para usuarios que reinstalan
4. **Receipt validation**: RevenueCat lo hace por ti, no validar localmente
5. **Offline mode**: App debe funcionar sin internet, verificar suscripción en cache

---

## 📊 KPIs a Monitorear

### Suscripciones (RevenueCat Dashboard)
- **Trial Conversion Rate**: % de trials que se convierten a pago
- **Monthly Recurring Revenue (MRR)**: Revenue mensual recurrente
- **Churn Rate**: % de usuarios que cancelan
- **Lifetime Value (LTV)**: Revenue promedio por usuario
- **Trial starts**: Cantidad de usuarios que inician trial

### Anuncios (AdMob)
- **Impresiones diarias**: Total de anuncios mostrados
- **eCPM**: Revenue efectivo por mil impresiones
- **Fill Rate**: % de requests con anuncio servido
- **CTR**: Click-through rate

### General
- **Retention**: Impacto de premium en retención
- **DAU/MAU**: Usuarios activos diarios vs mensuales
- **Conversion funnel**: % usuarios que llegan a paywall y compran

---

## 🎯 Estrategia de Lanzamiento

### Semana 1-2: Soft Launch (Solo Anuncios)
- Lanzar solo con anuncios
- Monitorear UX y quejas de usuarios
- Ajustar frecuencia de anuncios
- No lanzar suscripciones aún

### Semana 3-4: Beta Premium
- Lanzar suscripciones para 20% de usuarios (A/B test)
- Probar diferentes precios: $2.99 vs $3.99 vs $4.99
- Medir conversion rate
- Iterar en diseño de paywall

### Mes 2: Lanzamiento Completo
- Lanzar premium para 100% de usuarios
- Elegir precio basado en datos de beta
- Marketing: "Lanzamiento de VocaBlox Premium"
- Ofrecer 30% descuento primer mes como promoción

### Mes 3+: Optimización
- A/B testing continuo de paywall
- Agregar features premium exclusivas
- Implementar rewarded ads
- Analizar y ajustar pricing

---

## 🚀 Próximos Pasos Inmediatos

### Para Comenzar:

1. **RevenueCat** (Prioridad Alta)
   - Crear cuenta: https://app.revenuecat.com/signup
   - Configurar proyecto
   - Yo te guío en la configuración completa

2. **Google Play Console** (Requerido para suscripciones)
   - Crear productos de suscripción
   - Configurar precios por región
   - Vincular con RevenueCat

3. **Apple App Store Connect** (Si lanzarás en iOS)
   - Crear In-App Purchases (auto-renewable subscriptions)
   - Configurar precios
   - Vincular con RevenueCat

4. **AdMob** (Secundario, después de RevenueCat)
   - Crear cuenta: https://admob.google.com
   - Obtener IDs
   - Configurar unidades de anuncios

### ¿Qué Implementar Primero?

**Opción A: RevenueCat Primero** (Recomendado)
- ✅ Revenue más alto por usuario
- ✅ Mejor UX (sin anuncios para suscriptores)
- ✅ Construcción de base de usuarios premium desde día 1
- ✅ Implementación más simple
- ❌ Requiere configuración en Play Console y App Store

**Opción B: AdMob Primero**
- ✅ Más rápido de implementar
- ✅ Revenue inmediato sin configuración compleja
- ✅ No requiere aprobación de stores
- ❌ Revenue menor por usuario
- ❌ Peor UX inicial

### Mi Recomendación:
Implementa **ambos en paralelo** pero prioriza RevenueCat. Muchas apps cometen el error de depender solo de anuncios y es difícil migrar usuarios después. Lanzar con modelo freemium desde el inicio establece expectativas correctas.
