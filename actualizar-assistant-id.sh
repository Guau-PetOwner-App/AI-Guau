#!/bin/bash

echo "🤖 Actualizar Assistant ID de OpenAI"
echo "====================================="
echo ""
read -p "Ingresa tu nuevo Assistant ID (o presiona Enter para crear uno nuevo): " NEW_ASSISTANT_ID

if [ -z "$NEW_ASSISTANT_ID" ]; then
    echo ""
    echo "📝 Para crear un nuevo Assistant:"
    echo "1. Ve a https://platform.openai.com/assistants"
    echo "2. Haz clic en 'Create' o 'Crear'"
    echo "3. Configura el Assistant con:"
    echo "   - Name: Guau Vision Assistant"
    echo "   - Model: gpt-4o o gpt-4-turbo"
    echo "   - Instructions: (copia las instrucciones del sistema del código)"
    echo "4. Copia el Assistant ID (empieza con 'asst_')"
    echo ""
    read -p "Ingresa el nuevo Assistant ID ahora: " NEW_ASSISTANT_ID
fi

if [ -z "$NEW_ASSISTANT_ID" ]; then
    echo "❌ Error: El Assistant ID no puede estar vacío"
    exit 1
fi

# Actualizar el archivo .env
if [ -f .env ]; then
    # Usar sed para reemplazar la línea de VITE_OPENAI_ASSISTANT_ID
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s|^VITE_OPENAI_ASSISTANT_ID=.*|VITE_OPENAI_ASSISTANT_ID=$NEW_ASSISTANT_ID|" .env
    else
        # Linux
        sed -i "s|^VITE_OPENAI_ASSISTANT_ID=.*|VITE_OPENAI_ASSISTANT_ID=$NEW_ASSISTANT_ID|" .env
    fi
    
    echo "✅ Assistant ID actualizado exitosamente"
    echo ""
    echo "📋 Nueva configuración:"
    grep "VITE_OPENAI_ASSISTANT_ID" .env
    echo ""
    echo "🔄 IMPORTANTE: Reinicia el servidor de desarrollo para aplicar los cambios:"
    echo "   1. Presiona Ctrl+C para detener el servidor"
    echo "   2. Ejecuta: npm run dev"
else
    echo "❌ Error: El archivo .env no existe"
    exit 1
fi

