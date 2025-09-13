# Configuración de Base de Datos Supabase

## Instrucciones para actualizar la tabla user_settings

1. **Accede a tu dashboard de Supabase:**
   - Ve a [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Selecciona tu proyecto

2. **Ejecuta el script SQL de migración:**
   - En el panel izquierdo, haz clic en "SQL Editor"
   - Copia y pega el siguiente script SQL
   - Haz clic en "Run" para ejecutar el script

```sql
-- Migration script to update user_settings table for new wizard structure
-- This will drop the old table and create a new one with the updated schema

-- Drop the existing table (this will remove all existing data)
DROP TABLE IF EXISTS user_settings CASCADE;

-- Create the new user_settings table with the updated structure
CREATE TABLE user_settings (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    background TEXT NOT NULL DEFAULT '',
    nickname TEXT NOT NULL DEFAULT '',
    motivational TEXT NOT NULL DEFAULT '',
    categories TEXT[] NOT NULL DEFAULT '{}',
    timezone TEXT NOT NULL DEFAULT 'UTC',
    
    -- New wizard fields
    weekly_words_target INTEGER NOT NULL DEFAULT 10 CHECK (weekly_words_target IN (10, 30, 40, 50)),
    bursts_per_day INTEGER NOT NULL DEFAULT 1 CHECK (bursts_per_day IN (1, 2, 3)),
    active_windows TEXT[] NOT NULL DEFAULT '{"morning"}' CHECK (
        array_length(active_windows, 1) > 0 AND
        active_windows <@ '{"morning", "afternoon", "evening"}'
    ),
    window_times JSONB NOT NULL DEFAULT '{"morning": "08:00"}',
    streak_goal_days INTEGER NOT NULL DEFAULT 7 CHECK (streak_goal_days >= 1 AND streak_goal_days <= 365),
    
    -- Calculated fields
    daily_words INTEGER NOT NULL DEFAULT 2,
    words_per_burst INTEGER NOT NULL DEFAULT 2,
    
    wizard_completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_user_settings_user_id ON user_settings(user_id);
CREATE INDEX idx_user_settings_wizard_completed ON user_settings(wizard_completed);

-- Enable Row Level Security
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own settings" ON user_settings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own settings" ON user_settings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings" ON user_settings
    FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own settings" ON user_settings
    FOR DELETE USING (auth.uid() = user_id);

-- Create function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_user_settings_updated_at 
    BEFORE UPDATE ON user_settings 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create function to validate active_windows length matches bursts_per_day
CREATE OR REPLACE FUNCTION validate_bursts_and_windows()
RETURNS TRIGGER AS $$
BEGIN
    IF array_length(NEW.active_windows, 1) != NEW.bursts_per_day THEN
        RAISE EXCEPTION 'Number of active_windows must match bursts_per_day';
    END IF;
    
    -- Calculate derived values
    NEW.daily_words = CEIL(NEW.weekly_words_target::float / 7);
    NEW.words_per_burst = CEIL(NEW.daily_words::float / NEW.bursts_per_day);
    
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Create trigger to validate and calculate derived values
CREATE TRIGGER validate_user_settings_bursts_and_windows
    BEFORE INSERT OR UPDATE ON user_settings
    FOR EACH ROW
    EXECUTE FUNCTION validate_bursts_and_windows();
```

3. **Verifica que se creó correctamente:**
   - Ve a "Table Editor" en el panel izquierdo
   - Deberías ver la tabla `user_settings` actualizada con las nuevas columnas

## Nueva estructura de la tabla user_settings

La tabla ahora incluye los siguientes campos según el nuevo wizard:

### Campos del perfil:
- `user_id` (UUID) - Referencia al usuario autenticado
- `background` (TEXT) - Tema/fondo seleccionado
- `nickname` (TEXT) - Nombre/pseudónimo del usuario
- `motivational` (TEXT) - Frase motivacional personal
- `categories` (TEXT[]) - Categorías de interés (mínimo 3)
- `timezone` (TEXT) - Zona horaria del usuario

### Campos de configuración del nuevo wizard:
- `weekly_words_target` (INTEGER) - Meta semanal: 10, 30, 40 o 50 palabras
- `bursts_per_day` (INTEGER) - Sesiones por día: 1, 2 o 3
- `active_windows` (TEXT[]) - Ventanas de tiempo activas: 'morning', 'afternoon', 'evening'
- `window_times` (JSONB) - Horarios exactos para cada ventana activa
- `streak_goal_days` (INTEGER) - Objetivo de racha en días (1-365)

### Campos calculados automáticamente:
- `daily_words` (INTEGER) - Palabras por día: ceil(weekly_words_target / 7)
- `words_per_burst` (INTEGER) - Palabras por sesión: ceil(daily_words / bursts_per_day)

### Campos de control:
- `wizard_completed` (BOOLEAN) - Si completó el wizard
- `created_at` (TIMESTAMP) - Fecha de creación
- `updated_at` (TIMESTAMP) - Fecha de última actualización (se actualiza automáticamente)

## Validaciones automáticas

El script incluye validaciones que se ejecutan automáticamente:

1. **Validación de ventanas y sesiones:** El número de `active_windows` debe coincidir con `bursts_per_day`
2. **Cálculo automático:** Los campos `daily_words` y `words_per_burst` se calculan automáticamente
3. **Restricciones de valores:** Solo permite valores específicos para `weekly_words_target` (10, 30, 40, 50) y `bursts_per_day` (1, 2, 3)
4. **Validación de ventanas:** Solo permite ventanas válidas ('morning', 'afternoon', 'evening')

## Políticas de Seguridad (RLS)

Las políticas de Row Level Security permiten a cada usuario:
- Ver solo sus propias configuraciones
- Insertar sus propias configuraciones
- Actualizar sus propias configuraciones
- Eliminar sus propias configuraciones

## ⚠️ Importante

**ESTE SCRIPT ELIMINARÁ TODOS LOS DATOS EXISTENTES** en la tabla `user_settings`. Si tienes datos importantes:

1. Haz backup de los datos existentes antes de ejecutar el script
2. O modifica el script para hacer una migración en lugar de DROP TABLE

## Después de ejecutar el script

Una vez que ejecutes el script SQL, tu aplicación debería funcionar correctamente con el nuevo wizard y poder guardar las configuraciones sin errores.