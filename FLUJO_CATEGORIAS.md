# 🔄 Flujo de Categorías - Diagrama Completo

## 📊 Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────────┐
│                    SISTEMA CENTRALIZADO                          │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────┐
│  DEFAULT_CATEGORIES  │  ← Definición única de todas las categorías
│  (wizard.ts)         │    disponibles en la app
└──────────┬───────────┘
           │
           ↓
┌──────────────────────┐
│   WIZARD SCREEN      │  ← Usuario nuevo selecciona categorías
│  (StepCategories)    │
└──────────┬───────────┘
           │
           ↓
    [Usuario selecciona: technology, business, music]
           │
           ↓
┌──────────────────────┐
│    REDUX STORE       │  ← Se guardan las categorías seleccionadas
│ settings.data        │    state.settings.data.categories
│   .categories        │    = ['technology', 'business', 'music']
└──────────┬───────────┘
           │
           ├─────────────┬─────────────┬─────────────┬─────────────┐
           ↓             ↓             ↓             ↓             ↓
     ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐
     │  HOME   │   │  QUIZ   │   │  MEMO   │   │  FOCUS  │   │ NOTIF   │
     └────┬────┘   └────┬────┘   └────┬────┘   └────┬────┘   └────┬────┘
          │             │             │             │             │
          └─────────────┴─────────────┴─────────────┴─────────────┘
                                  │
                                  ↓
                    ┌──────────────────────────┐
                    │   categoryService.ts     │  ← Servicio centralizado
                    │  getWordsForCategory()   │
                    └─────────────┬────────────┘
                                  │
                    ┌─────────────┼─────────────┐
                    ↓             ↓             ↓
            technology.json  business.json  music.json
                    │             │             │
                    └─────────────┴─────────────┘
                                  │
                                  ↓
                        [Palabras cargadas en la app]
```

## 🎯 Flujo para Nuevos Usuarios

```
1. Usuario abre la app (primera vez)
   ↓
2. Ve el WIZARD
   ↓
3. En StepCategories ve TODAS las categorías de DEFAULT_CATEGORIES
   │  [technology, business, science, arts, sports, travel, food,
   │   medicine, law, engineering, music ← NUEVA CATEGORÍA]
   ↓
4. Usuario selecciona: [technology, music]
   ↓
5. Se guarda en Redux:
   state.settings.data.categories = ['technology', 'music']
   ↓
6. Usuario ve en Home/Quiz/Focus SOLO palabras de:
   - technology.json
   - music.json
```

## 👤 Flujo para Usuarios Existentes

```
Usuario ya tiene configurado: ['technology', 'business']
                                     ↓
                    [Redux ya tiene categorías guardadas]
                                     ↓
            ┌────────────────────────┴────────────────────────┐
            ↓                                                  ↓
   Agregas nueva categoría "music"              Usuario usa la app normalmente
   en DEFAULT_CATEGORIES                                      ↓
            ↓                                    Home/Quiz/Focus cargan de Redux:
   Usuario NO la ve automáticamente             ['technology', 'business']
            ↓                                                  ↓
   Para que la vea:                              Solo ve palabras de:
   1. Ir a Configuración                         - technology.json
   2. Editar categorías                          - business.json
   3. Seleccionar "music"
            ↓                                    ❌ NO ve music.json
   Redux actualizado:
   ['technology', 'business', 'music']
            ↓
   Ahora SÍ ve palabras de:
   - technology.json
   - business.json
   - music.json ✅
```

## 🔧 Sistema de Archivos

```
src/
├── types/
│   └── wizard.ts
│       └── DEFAULT_CATEGORIES ← 📝 PASO 1: Agregar aquí
│
├── services/
│   └── categoryService.ts
│       ├── CATEGORY_JSON_MAP  ← 📝 PASO 2: Mapear aquí
│       └── getWordsForCategory()
│
├── assets/
│   └── jsons/
│       ├── technology.json
│       ├── business.json
│       └── music.json       ← 📝 PASO 0: Crear archivo
│
├── views/
│   └── home/
│       └── index.tsx ✅ Lee de Redux → categoryService
│
└── features/
    ├── games/
    │   ├── flashQuiz/
    │   │   └── adapters.ts ✅ Lee de Redux → categoryService
    │   └── memorandum/
    │       └── buildPairs.ts ✅ Usa flashQuiz/adapters
    │
    └── focus/
        └── services/
            └── wordDataService.ts ✅ Lee de Redux → categoryService
```

## ✨ Ventajas del Sistema Centralizado

### ✅ Para Desarrolladores:
- **Un solo lugar** para agregar categorías
- **No duplicar código** de carga de JSONs
- **Mantenimiento fácil** - cambios en un solo archivo
- **Consistencia** - todos los módulos usan el mismo servicio

### ✅ Para Usuarios:
- **Control total** - solo ven las categorías que eligieron
- **Rendimiento** - solo se cargan los JSONs necesarios
- **Privacidad** - las categorías se guardan localmente en Redux
- **Flexibilidad** - pueden cambiar categorías cuando quieran

## 🚨 Puntos Importantes

### 1. Redux es la fuente de verdad
```typescript
// ❌ NUNCA hacer esto:
const allCategories = DEFAULT_CATEGORIES

// ✅ SIEMPRE hacer esto:
const userCategories = useAppSelector(state => state.settings.data.categories)
```

### 2. categoryService carga dinámicamente
```typescript
// ✅ El servicio solo carga lo que el usuario seleccionó
userCategories.forEach(categoryId => {
  const words = getWordsForCategory(categoryId) // Solo carga este JSON
})
```

### 3. Nuevas categorías no afectan usuarios existentes
```typescript
// Antes: ['technology', 'business'] en Redux
// Agregas 'music' a DEFAULT_CATEGORIES
// Después: Sigue siendo ['technology', 'business'] en Redux
//          hasta que el usuario lo cambie manualmente
```

## 📋 Checklist para Agregar Categoría

- [ ] Crear `src/assets/jsons/nueva_categoria.json`
- [ ] Agregar a `DEFAULT_CATEGORIES` en `src/types/wizard.ts`
- [ ] Importar en `src/services/categoryService.ts`
- [ ] Mapear en `CATEGORY_JSON_MAP`
- [ ] Verificar que compile sin errores
- [ ] ✅ Listo - funciona en toda la app automáticamente

## 🎓 Ejemplo Real

```typescript
// 1. Agregar categoría "Música" en wizard.ts
{ id: 'music', name: 'Música', icon: '🎵', description: 'Términos musicales', enabled: false }

// 2. Importar en categoryService.ts
import musicWords from '../assets/jsons/music.json';

// 3. Mapear en categoryService.ts
const CATEGORY_JSON_MAP = {
  'technology': tecnologiaWords,
  'music': musicWords, // ← Nuevo
};

// 4. Usuario nuevo en wizard
<StepCategories>
  {DEFAULT_CATEGORIES.map(cat => (
    <CategoryCard>Música 🎵</CategoryCard> // ← Aparece automáticamente
  ))}
</StepCategories>

// 5. Usuario selecciona y se guarda en Redux
dispatch(updateCategories(['technology', 'music']))

// 6. En Home/Quiz/Focus/etc
const categories = useAppSelector(state => state.settings.data.categories)
// ['technology', 'music']

const words = getWordsForCategories(categories)
// Carga: technology.json + music.json
```

---

**Sistema:** Centralizado, escalable y eficiente
**Mantenimiento:** Mínimo - solo 3 pasos para agregar categorías
**Performance:** Óptimo - solo carga lo necesario
