#!/bin/bash

# ============================================
# SCRIPT PARA EDITAR .env CON TU API KEY
# ============================================

clear
echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║  CONFIGURAR API KEY DE OPENAI - GUAU APP                 ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# Verificar que .env existe
if [ ! -f ".env" ]; then
    echo "❌ ERROR: .env no existe"
    echo ""
    echo "Creando .env ahora..."
    cat > .env << 'EOF'
VITE_OPENAI_API_KEY=YOUR_OPENAI_API_KEY_HERE
VITE_OPENAI_ASSISTANT_ID=asst_7bJDB6UcFWaQkvWSjPixb7NB
VITE_SUPABASE_URL=https://oqoaxusesfcrmejftwmt.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY_HERE
VITE_GUAU_APP_URL=https://get.guau.app
EOF
    echo "✅ .env creado"
    echo ""
fi

# Mostrar contenido actual
echo "📄 CONTENIDO ACTUAL DE .env:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
cat .env
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Verificar si la API key ya está configurada
CURRENT_KEY=$(grep "VITE_OPENAI_API_KEY=" .env | cut -d'=' -f2)

if [[ "$CURRENT_KEY" =~ ^sk-proj- ]] && [[ "$CURRENT_KEY" != *"PEGA_TU"* ]] && [[ "$CURRENT_KEY" != *"AQUI"* ]]; then
    echo "✅ API KEY YA ESTÁ CONFIGURADA"
    echo ""
    echo "Key actual: ${CURRENT_KEY:0:20}..."
    echo ""
    read -p "¿Quieres cambiarla? (s/N): " CAMBIAR
    if [[ ! "$CAMBIAR" =~ ^[Ss]$ ]]; then
        echo ""
        echo "Manteniéndola igual. ¡Listo!"
        exit 0
    fi
fi

# Pedir la API key
echo "🔑 INGRESA TU API KEY DE OPENAI:"
echo ""
echo "   1. Abre: https://platform.openai.com/api-keys"
echo "   2. Crea una nueva key (o usa una existente)"
echo "   3. Cópiala (empieza con sk-proj-...)"
echo "   4. Pégala aquí abajo"
echo ""
read -p "API Key: " API_KEY

# Validar formato
if [ -z "$API_KEY" ]; then
    echo ""
    echo "❌ ERROR: No ingresaste ninguna key"
    exit 1
fi

if [[ ! "$API_KEY" =~ ^sk- ]]; then
    echo ""
    echo "⚠️  ADVERTENCIA: La key no empieza con 'sk-'"
    echo "   Las keys de OpenAI deben empezar con 'sk-' o 'sk-proj-'"
    echo ""
    read -p "¿Estás seguro que es correcta? (s/N): " CONFIRMAR
    if [[ ! "$CONFIRMAR" =~ ^[Ss]$ ]]; then
        echo "Cancelado."
        exit 1
    fi
fi

# Actualizar .env
echo ""
echo "💾 Guardando en .env..."

cat > .env << EOF
VITE_OPENAI_API_KEY=$API_KEY
VITE_OPENAI_ASSISTANT_ID=asst_7bJDB6UcFWaQkvWSjPixb7NB
VITE_SUPABASE_URL=https://oqoaxusesfcrmejftwmt.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xb2F4dXNlc2Zjcm1lamZ0d210Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU2MDI2NjcsImV4cCI6MjA1MTE3ODY2N30.rABbqPrvusFPJCDHPdIjMmYZSXlxp8V6pLz0wQYVzCY
VITE_GUAU_APP_URL=https://get.guau.app
EOF

echo "✅ Guardado exitosamente"
echo ""

# Verificar que se guardó
echo "🔍 VERIFICANDO..."
SAVED_KEY=$(grep "VITE_OPENAI_API_KEY=" .env | cut -d'=' -f2)

if [ "$SAVED_KEY" = "$API_KEY" ]; then
    echo "✅ Verificado: La key se guardó correctamente"
    echo ""
    echo "📄 Nuevo contenido de .env:"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    cat .env
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "╔═══════════════════════════════════════════════════════════╗"
    echo "║  ✅ ¡CONFIGURACIÓN COMPLETA!                              ║"
    echo "╚═══════════════════════════════════════════════════════════╝"
    echo ""
    echo "🎯 SIGUIENTE PASO:"
    echo ""
    echo "   Reinicia el servidor de desarrollo:"
    echo ""
    echo "   1. Ve a la terminal donde corre 'npm run dev'"
    echo "   2. Presiona: Ctrl+C"
    echo "   3. Ejecuta: npm run dev"
    echo ""
    echo "   Luego abre tu app y verifica en la consola (F12) que veas:"
    echo "   ✅ OpenAI API key configurada correctamente desde .env"
    echo ""
else
    echo "❌ ERROR: La key no se guardó correctamente"
    echo "   Esperado: $API_KEY"
    echo "   Guardado: $SAVED_KEY"
    exit 1
fi
