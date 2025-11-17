#!/bin/bash

# ============================================
# SCRIPT DE VERIFICACIÓN DE .env
# ============================================
# 
# Este script verifica que el archivo .env existe
# y está configurado correctamente.
#
# Uso:
#   chmod +x verificar-env.sh
#   ./verificar-env.sh
#
# ============================================

echo ""
echo "🔍 VERIFICANDO ARCHIVO .env..."
echo "======================================"
echo ""

# Verificar que estamos en la raíz del proyecto
if [ ! -f "package.json" ]; then
    echo "❌ ERROR: No estás en la raíz del proyecto"
    echo "   Ejecuta este script desde la carpeta raíz donde está package.json"
    exit 1
fi

echo "✅ Estás en la raíz del proyecto"
pwd
echo ""

# Verificar que .env existe
if [ ! -f ".env" ]; then
    echo "❌ ERROR: El archivo .env NO existe"
    echo ""
    echo "📝 CREANDO .env AHORA..."
    
    cat > .env << 'EOF'
# ============================================
# GUAU APP - ENVIRONMENT VARIABLES
# ============================================

# OpenAI Configuration
VITE_OPENAI_API_KEY=TU_API_KEY_DE_OPENAI_AQUI
VITE_OPENAI_ASSISTANT_ID=asst_7bJDB6UcFWaQkvWSjPixb7NB

# Supabase Configuration
VITE_SUPABASE_URL=https://oqoaxusesfcrmejftwmt.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xb2F4dXNlc2Zjcm1lamZ0d210Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU2MDI2NjcsImV4cCI6MjA1MTE3ODY2N30.rABbqPrvusFPJCDHPdIjMmYZSXlxp8V6pLz0wQYVzCY

# App Configuration
VITE_GUAU_APP_URL=https://get.guau.app
EOF
    
    echo "✅ Archivo .env CREADO"
    echo ""
else
    echo "✅ Archivo .env existe"
    echo ""
fi

# Mostrar información del archivo
echo "📋 Información del archivo:"
ls -lah .env
echo ""

# Verificar que tiene contenido
if [ ! -s ".env" ]; then
    echo "⚠️  ADVERTENCIA: El archivo .env está vacío"
    echo ""
    exit 1
fi

# Leer variables del archivo
echo "📄 Contenido actual:"
echo "======================================"
cat .env
echo "======================================"
echo ""

# Verificar cada variable
echo "🔍 Verificando variables..."
echo ""

# VITE_OPENAI_API_KEY
if grep -q "VITE_OPENAI_API_KEY=" .env; then
    API_KEY=$(grep "VITE_OPENAI_API_KEY=" .env | cut -d'=' -f2)
    
    if [ -z "$API_KEY" ]; then
        echo "❌ VITE_OPENAI_API_KEY está vacía"
    elif [ "$API_KEY" = "TU_API_KEY_DE_OPENAI_AQUI" ] || [ "$API_KEY" = "YOUR_NEW_OPENAI_API_KEY_HERE" ]; then
        echo "⚠️  VITE_OPENAI_API_KEY tiene valor de ejemplo"
        echo "   Actual: $API_KEY"
        echo "   Debes reemplazarlo con tu API key real de OpenAI"
    elif [[ ! "$API_KEY" =~ ^sk- ]]; then
        echo "⚠️  VITE_OPENAI_API_KEY no empieza con 'sk-'"
        echo "   Actual: $API_KEY"
        echo "   Las keys de OpenAI deben empezar con 'sk-' o 'sk-proj-'"
    else
        echo "✅ VITE_OPENAI_API_KEY configurada"
        echo "   Formato: ${API_KEY:0:15}..."
    fi
else
    echo "❌ VITE_OPENAI_API_KEY no está en el archivo"
fi

# VITE_OPENAI_ASSISTANT_ID
if grep -q "VITE_OPENAI_ASSISTANT_ID=" .env; then
    ASSISTANT_ID=$(grep "VITE_OPENAI_ASSISTANT_ID=" .env | cut -d'=' -f2)
    
    if [ "$ASSISTANT_ID" = "asst_7bJDB6UcFWaQkvWSjPixb7NB" ]; then
        echo "✅ VITE_OPENAI_ASSISTANT_ID configurada correctamente"
    else
        echo "⚠️  VITE_OPENAI_ASSISTANT_ID tiene valor diferente"
        echo "   Esperado: asst_7bJDB6UcFWaQkvWSjPixb7NB"
        echo "   Actual: $ASSISTANT_ID"
    fi
else
    echo "❌ VITE_OPENAI_ASSISTANT_ID no está en el archivo"
fi

# VITE_SUPABASE_URL
if grep -q "VITE_SUPABASE_URL=" .env; then
    echo "✅ VITE_SUPABASE_URL configurada"
else
    echo "❌ VITE_SUPABASE_URL no está en el archivo"
fi

# VITE_SUPABASE_ANON_KEY
if grep -q "VITE_SUPABASE_ANON_KEY=" .env; then
    echo "✅ VITE_SUPABASE_ANON_KEY configurada"
else
    echo "❌ VITE_SUPABASE_ANON_KEY no está en el archivo"
fi

echo ""
echo "======================================"
echo ""

# Resumen final
API_KEY_CHECK=$(grep "VITE_OPENAI_API_KEY=" .env | cut -d'=' -f2)

if [ "$API_KEY_CHECK" = "TU_API_KEY_DE_OPENAI_AQUI" ] || [ "$API_KEY_CHECK" = "YOUR_NEW_OPENAI_API_KEY_HERE" ]; then
    echo "🎯 ACCIÓN REQUERIDA:"
    echo ""
    echo "1. Obtén tu API key en: https://platform.openai.com/api-keys"
    echo "2. Edita el archivo .env:"
    echo "   code .env      (VS Code)"
    echo "   nano .env      (Terminal)"
    echo "3. Reemplaza 'TU_API_KEY_DE_OPENAI_AQUI' con tu key real"
    echo "4. Guarda el archivo"
    echo "5. Reinicia el servidor: Ctrl+C y luego npm run dev"
    echo ""
elif [[ ! "$API_KEY_CHECK" =~ ^sk- ]]; then
    echo "⚠️  ADVERTENCIA:"
    echo ""
    echo "Tu API key no tiene el formato correcto."
    echo "Debe empezar con 'sk-' o 'sk-proj-'"
    echo ""
    echo "Verifica que copiaste la key completa de OpenAI."
    echo ""
else
    echo "🎉 ¡TODO CONFIGURADO CORRECTAMENTE!"
    echo ""
    echo "Tu archivo .env está listo."
    echo "Ahora puedes iniciar el servidor:"
    echo ""
    echo "   npm run dev"
    echo ""
fi

echo "======================================"
echo ""
