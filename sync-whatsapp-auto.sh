#!/bin/bash

# ============================================================
# SCRIPT DE SINCRONIZACIÓN AUTOMÁTICA - BOT WHATSAPP
# Este script valida y sincroniza automáticamente todas las
# variables de entorno necesarias para tu bot de WhatsApp
# ============================================================

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir con color
print_header() {
    echo -e "${BLUE}▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓${NC}"
}

print_step() {
    echo -e "${YELLOW}[PASO] $1${NC}"
}

print_success() {
    echo -e "${GREEN}[✓] $1${NC}"
}

print_error() {
    echo -e "${RED}[✗] $1${NC}"
}

print_info() {
    echo -e "${BLUE}[i] $1${NC}"
}

# Inicio
print_header "SINCRONIZACIÓN DEL BOT DE WHATSAPP"
echo ""

# Paso 1: Verificar que estamos en el directorio correcto
print_step "Verificando directorio del proyecto..."
if [ ! -f "package.json" ]; then
    print_error "package.json no encontrado. Ejecuta este script desde la raíz del proyecto"
    exit 1
fi
print_success "Proyecto detectado"
echo ""

# Paso 2: Verificar variables de entorno existentes
print_step "Verificando variables de entorno..."
echo ""

WEBHOOK_URL_PREVIEW="https://vm-6pygkfjraxktw7mx1t.vercel.app/api/whatsapp"
VERIFY_TOKEN="monopolio_sales_2025"

if [ -f ".env.local" ]; then
    print_success "Archivo .env.local encontrado"
    source .env.local
else
    print_info "Archivo .env.local no encontrado. Será creado."
fi

echo ""
print_step "Estado de las variables de entorno:"
echo ""

# Verificar cada variable
MISSING_VARS=0

if [ -z "$WHATSAPP_VERIFY_TOKEN" ]; then
    print_error "WHATSAPP_VERIFY_TOKEN no configurada"
    MISSING_VARS=$((MISSING_VARS + 1))
else
    print_success "WHATSAPP_VERIFY_TOKEN: configurada ($(echo $WHATSAPP_VERIFY_TOKEN | cut -c1-10)...)"
fi

if [ -z "$WHATSAPP_ACCESS_TOKEN" ]; then
    print_error "WHATSAPP_ACCESS_TOKEN no configurada"
    MISSING_VARS=$((MISSING_VARS + 1))
else
    print_success "WHATSAPP_ACCESS_TOKEN: configurada ($(echo $WHATSAPP_ACCESS_TOKEN | cut -c1-10)...)"
fi

if [ -z "$WHATSAPP_PHONE_NUMBER_ID" ]; then
    print_error "WHATSAPP_PHONE_NUMBER_ID no configurada"
    MISSING_VARS=$((MISSING_VARS + 1))
else
    print_success "WHATSAPP_PHONE_NUMBER_ID: $WHATSAPP_PHONE_NUMBER_ID"
fi

if [ -z "$GEMINI_API_KEY" ]; then
    print_error "GEMINI_API_KEY no configurada"
    MISSING_VARS=$((MISSING_VARS + 1))
else
    print_success "GEMINI_API_KEY: configurada ($(echo $GEMINI_API_KEY | cut -c1-10)...)"
fi

echo ""

# Paso 3: Mostrar URLs de referencia
print_step "URLs importantes para configuración:"
echo ""
echo "  1. URL del Webhook (pega en Meta Developers):"
echo "     $WEBHOOK_URL_PREVIEW"
echo ""
echo "  2. Verify Token:"
echo "     $VERIFY_TOKEN"
echo ""
echo "  3. Meta Developers Console:"
echo "     https://developers.facebook.com/apps"
echo ""

# Paso 4: Crear archivo de configuración para Vercel
print_step "Preparando configuración para Vercel..."
echo ""

# Crear archivo de instrucciones para variables de entorno
cat > VERCEL_ENV_SETUP.md << 'EOF'
# Configuración de Variables de Entorno en Vercel

## Pasos para agregar variables en Vercel:

1. Ve a: https://vercel.com/dashboard
2. Selecciona tu proyecto
3. Ve a Settings > Environment Variables
4. Agrega las siguientes variables:

### Variables Requeridas:

**WHATSAPP_VERIFY_TOKEN**
- Valor: `monopolio_sales_2025`
- Disponible en: Production, Preview, Development

**WHATSAPP_ACCESS_TOKEN**
- Valor: Tu token de acceso de Meta (copia de Meta Developers)
- Disponible en: Production, Preview, Development

**WHATSAPP_PHONE_NUMBER_ID**
- Valor: ID de tu número de teléfono (copia de Meta Developers)
- Disponible en: Production, Preview, Development

**GEMINI_API_KEY**
- Valor: Tu clave de API de Google Gemini
- Disponible en: Production, Preview, Development

## Dónde obtener estos valores:

- **Meta Developers**: https://developers.facebook.com
- **Google Gemini API Key**: https://aistudio.google.com/app/apikey

## Después de agregar las variables:

1. El despliegue se actualizará automáticamente
2. Tu webhook estará listo para recibir mensajes
3. Abre https://[tu-app].vercel.app/api/whatsapp/setup-guide para verificar
EOF

print_success "Archivo VERCEL_ENV_SETUP.md creado"

# Paso 5: Crear archivo de verificación local
print_step "Creando herramienta de verificación local..."
echo ""

cat > test-whatsapp-connection.js << 'EOF'
#!/usr/bin/env node

const https = require('https');

// Colores
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function log(color, text) {
  console.log(`${color}${text}${colors.reset}`);
}

async function testWebhook() {
  log(colors.blue, '🧪 Probando configuración del webhook...\n');

  const webhookUrl = 'https://vm-6pygkfjraxktw7mx1t.vercel.app/api/whatsapp';
  const verifyToken = 'monopolio_sales_2025';

  try {
    // Test 1: Verificar que el endpoint responde
    log(colors.yellow, '[Test 1] Verificando endpoint...');
    
    const response = await fetch(webhookUrl);
    const data = await response.json();
    
    if (data.status === 'active') {
      log(colors.green, '✓ Endpoint activo');
    } else {
      log(colors.red, '✗ Endpoint no está activo');
    }

    // Test 2: Verificar verificación del webhook
    log(colors.yellow, '\n[Test 2] Verificando token de verificación...');
    
    const verifyUrl = `${webhookUrl}?hub.verify_token=${verifyToken}&hub.challenge=test_challenge`;
    const verifyResponse = await fetch(verifyUrl);
    
    if (verifyResponse.status === 200) {
      log(colors.green, '✓ Token de verificación correcto');
    } else {
      log(colors.red, '✗ Token de verificación incorrecto');
    }

    // Test 3: Obtener guía de configuración
    log(colors.yellow, '\n[Test 3] Obteniendo guía de configuración...');
    
    const guideUrl = webhookUrl.replace('/api/whatsapp', '/api/whatsapp/setup-guide');
    const guideResponse = await fetch(guideUrl);
    const guide = await guideResponse.json();
    
    log(colors.green, `✓ Estado: ${guide.stage}`);
    log(colors.blue, `  Progreso: ${guide.currentStep}/${guide.totalSteps} pasos`);
    log(colors.blue, `  Próxima acción: ${guide.nextAction}`);

  } catch (error) {
    log(colors.red, `✗ Error en la prueba: ${error.message}`);
  }
}

testWebhook();
EOF

chmod +x test-whatsapp-connection.js
print_success "Script de prueba creado: test-whatsapp-connection.js"

echo ""
print_header "RESUMEN"
echo ""

if [ $MISSING_VARS -eq 0 ]; then
    print_success "Todas las variables de entorno están configuradas"
    echo ""
    print_step "Próximos pasos:"
    echo "  1. Abre: https://developers.facebook.com/apps"
    echo "  2. En tu app, ve a WhatsApp > Configuración"
    echo "  3. En 'Configuración de Webhook', pega:"
    echo "     URL: $WEBHOOK_URL_PREVIEW"
    echo "     Verify Token: $VERIFY_TOKEN"
    echo "  4. Suscríbete al campo: messages"
    echo ""
else
    print_error "$MISSING_VARS variables de entorno faltan"
    echo ""
    print_step "Pasos para completar la configuración:"
    echo "  1. Lee: VERCEL_ENV_SETUP.md"
    echo "  2. Ve a: https://vercel.com/dashboard"
    echo "  3. Agrega las variables faltantes"
    echo "  4. Espera a que se redepliegue automáticamente"
    echo ""
fi

print_info "Para más detalles, abre: https://vm-6pygkfjraxktw7mx1t.vercel.app/api/whatsapp/setup-guide"
echo ""
