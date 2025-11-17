# 🌍 Estado de Localización - AI Guau

## Resumen

El proyecto tiene **soporte parcial de localización**. Actualmente está configurado principalmente en **Español (es-ES)**, pero tiene la infraestructura para soportar **Inglés (en-US)**.

## Idiomas Soportados

### ✅ Español (es-ES) - **Activo por defecto**
- Idioma principal de la aplicación
- UI completamente en español
- Respuestas del AI Assistant en español

### ⚠️ Inglés (en-US) - **Soportado pero no activado**
- El sistema puede generar respuestas en inglés
- La UI no está traducida al inglés (textos hardcodeados en español)

## Estado Actual

### ✅ Lo que SÍ está localizado:

1. **Respuestas del AI Assistant (OpenAI)**
   - El Assistant puede generar análisis en español o inglés según el `locale`
   - Configurado en: `services/openai.ts` (SYSTEM_PROMPT)
   - Soporta: `es-ES` y `en-US`

2. **Mapeo de datos del análisis**
   - `services/petAnalysisMapper.ts` tiene lógica condicional:
     - Traduce "dog" → "Perro" / "Dog" según locale
     - Traduce "cat" → "Gato" / "Cat" según locale
     - Traduce "Raza Mixta" → "Mixed Breed" según locale
     - Formatea niveles de energía según locale

3. **Mensajes de WhatsApp/Compartir**
   - `getWhatsAppMessage()` tiene fallback en español e inglés

### ❌ Lo que NO está localizado:

1. **Interfaz de Usuario (UI)**
   - Todos los textos de la UI están hardcodeados en español
   - Componentes como `HeroScreen`, `AnalysisScreen`, `ResultsScreen`, etc.
   - Mensajes de error, botones, títulos, etc.

2. **Configuración actual**
   - El locale está hardcodeado a `'es-ES'` en `App.tsx` línea 144:
     ```typescript
     const response = await analyzePetImage(file, 'es-ES', ...)
     ```

3. **HTML/Meta tags**
   - `index.html` tiene `lang="es"` hardcodeado
   - Título y descripción en español

## Ubicaciones Clave

### Archivos con lógica de localización:

1. **`services/openai.ts`**
   - Línea 162-165: Reglas de idioma en SYSTEM_PROMPT
   - Soporta: `es-ES` (default), `en-US`

2. **`services/petAnalysisMapper.ts`**
   - Línea 89: `const locale = response.locale || 'es-ES'`
   - Líneas 100-102: Traducción de especies
   - Línea 117: Traducción de "Raza Mixta"
   - Líneas 184-189: Mensajes de WhatsApp

3. **`App.tsx`**
   - Línea 144: **Locale hardcodeado a 'es-ES'**

## Para Activar Inglés

Para cambiar a inglés, necesitarías:

1. **Cambiar el locale en App.tsx:**
   ```typescript
   // Línea 144 - Cambiar de:
   const response = await analyzePetImage(file, 'es-ES', ...)
   // A:
   const response = await analyzePetImage(file, 'en-US', ...)
   ```

2. **Traducir la UI:**
   - Implementar un sistema de i18n (react-i18next, i18next, etc.)
   - O traducir manualmente todos los textos en los componentes

3. **Actualizar HTML:**
   ```html
   <html lang="en">
   ```

## Recomendaciones

### Opción 1: Sistema de i18n completo (Recomendado)
- Instalar `react-i18next` o similar
- Crear archivos de traducción (`es.json`, `en.json`)
- Implementar selector de idioma en la UI

### Opción 2: Localización básica
- Crear un hook `useLocale()` que detecte el idioma del navegador
- Mantener traducciones condicionales simples
- Cambiar el locale hardcodeado por uno dinámico

### Opción 3: Mantener solo español
- Si solo necesitas español, el estado actual es suficiente
- El código ya está optimizado para español

## Conclusión

**Estado:** Soporte parcial - Español activo, Inglés soportado en backend pero no en UI

**Idiomas:** 
- ✅ Español (es-ES) - Activo
- ⚠️ Inglés (en-US) - Backend soportado, UI no traducida

**Próximos pasos:** Decidir si necesitas multi-idioma completo o mantener solo español.

