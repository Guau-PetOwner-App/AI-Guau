#!/bin/bash

# 🎯 Script para crear archivo .env con la configuración completa de Guau App

echo "🐾 Creando archivo .env para Guau App..."
echo ""

# Crear archivo .env
cat > .env << 'EOF'
VITE_OPENAI_API_KEY=YOUR_OPENAI_API_KEY_HERE
VITE_OPENAI_ASSISTANT_ID=asst_7bJDB6UcFWaQkvWSjPixb7NB
VITE_SUPABASE_URL=https://oqoaxusesfcrmejftwmt.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY_HERE
VITE_GUAU_APP_URL=https://get.guau.app
EOF

if [ -f .env ]; then
    echo "✅ Archivo .env creado exitosamente"
    echo ""
    echo "📋 Contenido:"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    cat .env
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "🎯 SIGUIENTE PASO:"
    echo "   Reinicia el servidor con: npm run dev"
    echo ""
else
    echo "❌ Error: No se pudo crear el archivo .env"
    echo "   Por favor, crea el archivo manualmente"
fi
