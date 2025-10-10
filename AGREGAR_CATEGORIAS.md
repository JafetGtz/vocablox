# 📚 Guía: Cómo Agregar Nuevas Categorías

Esta aplicación utiliza un **sistema centralizado** para manejar categorías de vocabulario. Solo necesitas hacer **2 cambios** para agregar una nueva categoría.

## 🎯 Pasos para agregar una nueva categoría

### 1️⃣ Crear el archivo JSON con las palabras

Crea un nuevo archivo en: `src/assets/jsons/nombre_categoria.json`

**Estructura del archivo:**
```json
[
  {
    "palabra": "Ejemplo",
    "significado": "Definición de la palabra en español",
    "ejemplo": "Oración de ejemplo usando la palabra (opcional)"
  },
  {
    "palabra": "Otra palabra",
    "significado": "Su significado",
    "ejemplo": "Ejemplo de uso"
  }
]
```

**Recomendaciones:**
- Usa nombres descriptivos en español
- Incluye al menos 20-50 palabras por categoría
- El campo `ejemplo` es opcional pero recomendado
- Mantén consistencia en el formato

### 2️⃣ Agregar la categoría al archivo de tipos

Abre: `src/types/wizard.ts`

Agrega tu categoría al array `DEFAULT_CATEGORIES` (línea 52):

```typescript
export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'technology', name: 'Tecnología', icon: '💻', description: 'Términos de programación, hardware, software', enabled: false },
  { id: 'business', name: 'Negocios', icon: '💼', description: 'Vocabulario empresarial y financiero', enabled: false },
  // ... otras categorías

  // 👇 AGREGAR AQUÍ TU NUEVA CATEGORÍA
  {
    id: 'musica',                              // ID único (debe coincidir con el nombre del archivo JSON)
    name: 'Música',                            // Nombre en español que verá el usuario
    icon: '🎵',                                // Emoji representativo
    description: 'Términos musicales y de instrumentos',  // Descripción breve
    enabled: false
  },
]
```

### 3️⃣ Registrar en el servicio centralizado

Abre: `src/services/categoryService.ts`

**a) Importa el JSON** (línea 8-17):
```typescript
import musicaWords from '../assets/jsons/musica.json';
```

**b) Agrégalo al mapeo** (línea 32-42):
```typescript
const CATEGORY_JSON_MAP: Record<string, Word[]> = {
  'technology': tecnologiaWords,
  'business': negociosWords,
  // ... otras categorías
  'musica': musicaWords,  // 👈 Agregar aquí
};
```

## ✅ ¡Listo!

Tu nueva categoría estará **disponible automáticamente** en:

### 📋 Para nuevos usuarios:
- ✨ **Wizard** - Aparecerá en la lista de categorías para seleccionar

### 👤 Para usuarios existentes:
La nueva categoría **NO aparecerá automáticamente** porque los usuarios solo ven las categorías que seleccionaron en el wizard.

**Para que un usuario existente vea la nueva categoría:**
1. El usuario debe ir a Configuración/Preferencias
2. Editar sus categorías seleccionadas
3. Agregar la nueva categoría manualmente

### 🎯 Dónde se usa:
Una vez que el usuario la seleccione, la categoría funciona en:
- 🏠 **Home** - Pantalla principal de vocabulario
- 🎮 **Quiz** - FlashQuiz con preguntas
- 🎯 **Memorándum** - Juego de memoria
- 🧘 **Focus** - Modo de enfoque y concentración
- 🔔 **Notificaciones** - Notificaciones programadas

**¡Todo el sistema es centralizado!** No necesitas modificar código en ningún módulo.

## 🔍 Ejemplo completo

Para agregar la categoría "Música":

1. **Crear:** `src/assets/jsons/musica.json`
```json
[
  {
    "palabra": "Armonía",
    "significado": "Combinación agradable de sonidos simultáneos",
    "ejemplo": "La armonía de la orquesta era perfecta"
  },
  {
    "palabra": "Melodía",
    "significado": "Sucesión organizada de sonidos",
    "ejemplo": "La melodía de esa canción es pegajosa"
  }
]
```

2. **Editar:** `src/types/wizard.ts` (línea 62, después de 'engineering'):
```typescript
{ id: 'musica', name: 'Música', icon: '🎵', description: 'Términos musicales y de instrumentos', enabled: false },
```

3. **Editar:** `src/services/categoryService.ts`
   - Import: `import musicaWords from '../assets/jsons/musica.json';`
   - Mapeo: `'musica': musicaWords,`

## 📋 Nombres de archivos vs IDs

**IMPORTANTE:** El `id` en `DEFAULT_CATEGORIES` debe coincidir exactamente con:
- El nombre del archivo JSON (sin la extensión .json)
- La clave en `CATEGORY_JSON_MAP`

Ejemplo:
- Archivo: `musica.json`
- ID: `'musica'`
- Mapeo: `'musica': musicaWords`

## 🚀 Después de agregar la categoría

No necesitas:
- ❌ Modificar el código de Home
- ❌ Modificar el código de Quiz
- ❌ Modificar el código de Memorandum
- ❌ Modificar el código de notificaciones
- ❌ Reiniciar la app (solo si usas hot reload)

Solo necesitas:
- ✅ Recargar la app si los cambios no aparecen automáticamente

## 🎨 Emojis recomendados para categorías

- 💻 Tecnología
- 💼 Negocios
- 🔬 Ciencia
- 🎨 Arte
- ⚽ Deportes
- ✈️ Viajes
- 🍽️ Comida
- ⚕️ Medicina
- ⚖️ Derecho
- 🔧 Ingeniería
- 🎵 Música
- 📚 Literatura
- 🎬 Cine
- 🌍 Geografía
- 🏛️ Historia
- 💰 Finanzas
- 🏗️ Arquitectura
- 🧪 Química
- 🌱 Ecología
- 🎓 Educación

## 🔄 Flujo del sistema

### Cómo funciona:

1. **Wizard (nuevos usuarios):**
   ```
   DEFAULT_CATEGORIES → Usuario selecciona → Redux (settings.data.categories)
   ```

2. **Módulos de la app (todos los usuarios):**
   ```
   Redux (settings.data.categories) → categoryService → Palabras del JSON
   ```

### Ejemplo práctico:

```typescript
// Usuario en wizard selecciona: ['technology', 'music']
// Se guarda en Redux: state.settings.data.categories = ['technology', 'music']

// En Home/Quiz/Focus/etc:
const categories = useAppSelector(state => state.settings.data.categories)
// categories = ['technology', 'music']

// Se cargan solo las palabras de esas categorías:
categories.forEach(cat => {
  const words = getWordsForCategory(cat) // categoryService
  // Solo carga technology.json y music.json
})
```

**⚠️ Importante:**
- Nuevos usuarios ven todas las categorías de `DEFAULT_CATEGORIES`
- Usuarios existentes solo ven palabras de sus categorías seleccionadas en Redux
- Si agregas una nueva categoría, los usuarios existentes NO la verán hasta que la seleccionen manualmente

## 📞 Soporte

Si tienes problemas al agregar una categoría, verifica:
1. El JSON tiene formato válido (sin comas extras, comillas correctas)
2. El ID es único y coincide con el nombre del archivo
3. Todos los imports están correctos
4. No hay errores de compilación
5. La categoría está en `DEFAULT_CATEGORIES` (para wizard)
6. La categoría está mapeada en `CATEGORY_JSON_MAP` (para servicio)

---

**Fecha de actualización:** 2025
**Sistema:** Centralizado con `categoryService.ts`
**Flujo:** Wizard → Redux → categoryService → Módulos
