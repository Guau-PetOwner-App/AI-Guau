#!/bin/bash

# ============================================
# SCRIPT DE DIAGNÓSTICO COMPLETO
# ============================================

clear

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║  DIAGNÓSTICO DE CONFIGURACIÓN - GUAU APP                 ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# 1. Ubicación
echo "1️⃣  UBICACIÓN ACTUAL:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
pwd
echo ""

# 2. Verificar que estamos en la raíz
echo "2️⃣  VERIFICACIÓN DE RAÍZ DEL PROYECTO:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ -f "package.json" ]; then
    echo "✅ package.json encontrado"
else
    echo "❌ package.json NO encontrado"
    echo "   Debes estar en la raíz del proyecto"
fi

if [ -f "App.tsx" ]; then
    echo "✅ App.tsx encontrado"
else
    echo "❌ App.tsx NO encontrado"
fi
echo ""

# 3. Verificar si .env existe
echo "3️⃣  ARCHIVO .env:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ -f ".env" ]; then
    echo "✅ .env existe"
    echo ""
    ls -lah .env
    echo ""
else
    echo "❌ .env NO EXISTE"
    echo ""
    echo "🔧 SOLUCIÓN: Ejecuta uno de estos comandos:"
    echo ""
    echo "   Opción 1 (Script):"
    echo "   chmod +x editar-env.sh && ./editar-env.sh"
    echo ""
    echo "   Opción 2 (Manual):"
    echo "   nano .env"
    echo ""
    exit 1
fi

# 4. Contenido de .env
echo "4️⃣  CONTENIDO DE .env:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
cat .env
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 5. Análisis de variables
echo "5️⃣  ANÁLISIS DE VARIABLES:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# VITE_OPENAI_API_KEY
if grep -q "VITE_OPENAI_API_KEY=" .env; then
    API_KEY=$(grep "VITE_OPENAI_API_KEY=" .env | cut -d'=' -f2)
    
    if [ -z "$API_KEY" ]; then
        echo "❌ VITE_OPENAI_API_KEY: VACÍA"
        echo "   Problema: No hay valor después del ="
        PROBLEMA=true
    elif [[ "$API_KEY" == *"PEGA_TU"* ]] || [[ "$API_KEY" == *"AQUI"* ]] || [[ "$API_KEY" == *"YOUR"* ]]; then
        echo "❌ VITE_OPENAI_API_KEY: VALOR DE EJEMPLO"
        echo "   Valor actual: $API_KEY"
        echo "   Problema: Aún tiene el texto de placeholder"
        PROBLEMA=true
    elif [[ ! "$API_KEY" =~ ^sk- ]]; then
        echo "⚠️  VITE_OPENAI_API_KEY: FORMATO SOSPECHOSO"
        echo "   Valor: $API_KEY"
        echo "   Problema: No empieza con 'sk-' o 'sk-proj-'"
        PROBLEMA=true
    else
        echo "✅ VITE_OPENAI_API_KEY: CONFIGURADA"
        echo "   Formato: ${API_KEY:0:20}..."
        echo "   Longitud: ${#API_KEY} caracteres"
    fi
else
    echo "❌ VITE_OPENAI_API_KEY: NO ENCONTRADA"
    echo "   Problema: La línea no existe en .env"
    PROBLEMA=true
fi

# VITE_OPENAI_ASSISTANT_ID
if grep -q "VITE_OPENAI_ASSISTANT_ID=" .env; then
    ASSISTANT_ID=$(grep "VITE_OPENAI_ASSISTANT_ID=" .env | cut -d'=' -f2)
    if [ "$ASSISTANT_ID" = "asst_7bJDB6UcFWaQkvWSjPixb7NB" ]; then
        echo "✅ VITE_OPENAI_ASSISTANT_ID: Correcta"
    else
        echo "⚠️  VITE_OPENAI_ASSISTANT_ID: Valor diferente"
        echo "   Esperado: asst_7bJDB6UcFWaQkvWSjPixb7NB"
        echo "   Actual: $ASSISTANT_ID"
    fi
else
    echo "❌ VITE_OPENAI_ASSISTANT_ID: NO ENCONTRADA"
fi

# VITE_SUPABASE_URL
if grep -q "VITE_SUPABASE_URL=" .env; then
    echo "✅ VITE_SUPABASE_URL: Presente"
else
    echo "❌ VITE_SUPABASE_URL: NO ENCONTRADA"
fi

# VITE_SUPABASE_ANON_KEY
if grep -q "VITE_SUPABASE_ANON_KEY=" .env; then
    echo "✅ VITE_SUPABASE_ANON_KEY: Presente"
else
    echo "❌ VITE_SUPABASE_ANON_KEY: NO ENCONTRADA"
fi

echo ""

# 6. Permisos
echo "6️⃣  PERMISOS DEL ARCHIVO:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
ls -l .env | awk '{print "   Permisos: " $1, "\n   Propietario: " $3}'
echo ""

# 7. Otros archivos .env
echo "7️⃣  OTROS ARCHIVOS .env*:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
ls -la .env* 2>/dev/null || echo "   Solo .env existe"
echo ""

# RESUMEN
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║  RESUMEN                                                  ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

if [ "$PROBLEMA" = true ]; then
    echo "❌ SE ENCONTRARON PROBLEMAS"
    echo ""
    echo "🔧 SOLUCIONES:"
    echo ""
    echo "   OPCIÓN 1 - Script automático (RECOMENDADO):"
    echo "   ─────────────────────────────────────────"
    echo "   chmod +x editar-env.sh && ./editar-env.sh"
    echo ""
    echo "   OPCIÓN 2 - Editar manualmente:"
    echo "   ─────────────────────────────"
    echo "   nano .env"
    echo "   # Edita línea 1, pega tu API key"
    echo "   # Ctrl+O, Enter, Ctrl+X"
    echo ""
    echo "   OPCIÓN 3 - Comando directo:"
    echo "   ──────────────────────────"
    echo "   # Reemplaza YOUR_API_KEY con tu key real:"
    echo "   cat > .env << 'EOF'"
    echo "   VITE_OPENAI_API_KEY=YOUR_API_KEY"
    echo "   VITE_OPENAI_ASSISTANT_ID=asst_7bJDB6UcFWaQkvWSjPixb7NB"
    echo "   VITE_SUPABASE_URL=https://oqoaxusesfcrmejftwmt.supabase.co"
    echo "   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xb2F4dXNlc2Zjcm1lamZ0d210Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU2MDI2NjcsImV4cCI6MjA1MTE3ODY2N30.rABbqPrvusFPJCDHPdIjMmYZSXlxp8V6pLz0wQYVzCY"
    echo "   VITE_GUAU_APP_URL=https://get.guau.app"
    echo "   EOF"
    echo ""
    echo "   Luego SIEMPRE reinicia el servidor:"
    echo "   Ctrl+C"
    echo "   npm run dev"
    echo ""
else
    echo "✅ TODO CONFIGURADO CORRECTAMENTE"
    echo ""
    echo "🎯 SIGUIENTE PASO:"
    echo ""
    echo "   Si el servidor está corriendo, reinícialo:"
    echo "   Ctrl+C"
    echo "   npm run dev"
    echo ""
    echo "   Luego abre tu app y verifica en Console (F12):"
    echo "   ✅ OpenAI API key configurada correctamente desde .env"
    echo ""
fi

echo "════════════════════════════════════════════════════════════"
echo ""
