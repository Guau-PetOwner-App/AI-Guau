#!/bin/bash

echo "🔑 Actualizar API Key de OpenAI"
echo "================================"
echo ""
read -p "Ingresa tu nueva API Key de OpenAI: " NEW_API_KEY

if [ -z "$NEW_API_KEY" ]; then
    echo "❌ Error: La API key no puede estar vacía"
    exit 1
fi

# Actualizar el archivo .env
if [ -f .env ]; then
    # Usar sed para reemplazar la línea de VITE_OPENAI_API_KEY
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s|^VITE_OPENAI_API_KEY=.*|VITE_OPENAI_API_KEY=$NEW_API_KEY|" .env
    else
        # Linux
        sed -i "s|^VITE_OPENAI_API_KEY=.*|VITE_OPENAI_API_KEY=$NEW_API_KEY|" .env
    fi
    
    echo "✅ API Key actualizada exitosamente"
    echo ""
    echo "📋 Nueva configuración:"
    grep "VITE_OPENAI_API_KEY" .env
    echo ""
    echo "🔄 IMPORTANTE: Reinicia el servidor de desarrollo para aplicar los cambios:"
    echo "   1. Presiona Ctrl+C para detener el servidor"
    echo "   2. Ejecuta: npm run dev"
else
    echo "❌ Error: El archivo .env no existe"
    exit 1
fi
