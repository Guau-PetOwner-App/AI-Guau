# 🔑 Cómo Actualizar la API Key de OpenAI

## Opción 1: Usar el Script Automático (Recomendado)

Ejecuta el script que acabamos de crear:

```bash
./actualizar-openai-key.sh
```

El script te pedirá que ingreses tu nueva API key y la actualizará automáticamente.

## Opción 2: Editar Manualmente el Archivo .env

1. Abre el archivo `.env` en tu editor:
   ```bash
   nano .env
   # o
   code .env
   # o
   open -a "TextEdit" .env
   ```

2. Busca la línea que dice:
   ```
   VITE_OPENAI_API_KEY=sk-proj-...
   ```

3. Reemplaza el valor después del `=` con tu nueva API key:
   ```
   VITE_OPENAI_API_KEY=tu_nueva_api_key_aqui
   ```

4. Guarda el archivo (Ctrl+O, Enter, Ctrl+X en nano)

## Opción 3: Usar un Comando Directo

Reemplaza `TU_NUEVA_API_KEY` con tu API key real:

```bash
# macOS
sed -i '' 's|^VITE_OPENAI_API_KEY=.*|VITE_OPENAI_API_KEY=TU_NUEVA_API_KEY|' .env

# Linux
sed -i 's|^VITE_OPENAI_API_KEY=.*|VITE_OPENAI_API_KEY=TU_NUEVA_API_KEY|' .env
```

## ⚠️ IMPORTANTE: Reiniciar el Servidor

Después de actualizar la API key, **SIEMPRE** debes reiniciar el servidor de desarrollo:

1. Detén el servidor actual (Ctrl+C en la terminal donde está corriendo)
2. Inicia el servidor nuevamente:
   ```bash
   npm run dev
   ```

Las variables de entorno solo se cargan cuando se inicia el servidor, por lo que los cambios no se aplicarán hasta que lo reinicies.

## ✅ Verificar que Funcionó

Después de reiniciar, puedes verificar que la nueva API key se cargó correctamente revisando la consola del navegador. Deberías ver mensajes de validación de la API key en la consola.

## 📝 Notas

- La API key debe empezar con `sk-` o `sk-proj-`
- No incluyas comillas alrededor de la API key en el archivo .env
- No dejes espacios antes o después del signo `=`
- El archivo `.env` está en `.gitignore`, así que no se subirá a git

