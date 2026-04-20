#!/bin/bash

# Script de Verificación Pre-Despliegue para Bot de WhatsApp
# Verifica que todas las variables de entorno necesarias están configuradas

echo "=================================="
echo "VERIFICACIÓN PRE-DESPLIEGUE"
echo "Bot de WhatsApp con IA (Gemini)"
echo "=================================="
echo ""

# Variables requeridas
REQUIRED_VARS=(
  "WHATSAPP_VERIFY_TOKEN"
  "WHATSAPP_ACCESS_TOKEN"
  "WHATSAPP_PHONE_NUMBER_ID"
  "GEMINI_API_KEY"
)

# Contar variables faltantes
MISSING=0

echo "Verificando variables de entorno..."
echo ""

for var in "${REQUIRED_VARS[@]}"; do
  if [ -z "${!var}" ]; then
    echo "❌ FALTANTE: $var"
    MISSING=$((MISSING + 1))
  else
    # Mostrar primeros y últimos 4 caracteres para seguridad
    VALUE="${!var}"
    LENGTH=${#VALUE}
    if [ $LENGTH -gt 8 ]; then
      HIDDEN="${VALUE:0:4}...${VALUE: -4}"
    else
      HIDDEN="***"
    fi
    echo "✅ PRESENTE: $var (valor: $HIDDEN)"
  fi
done

echo ""
echo "=================================="

if [ $MISSING -eq 0 ]; then
  echo "✅ TODAS LAS VARIABLES ESTÁN CONFIGURADAS"
  echo "Tu bot está listo para desplegar en Vercel"
  echo ""
  echo "Próximos pasos:"
  echo "1. Conecta tu repositorio a Vercel"
  echo "2. Configura las variables en el dashboard de Vercel"
  echo "3. Despliega el proyecto"
  echo "4. Configura el webhook en Meta Developers"
  exit 0
else
  echo "❌ FALTAN $MISSING VARIABLE(S)"
  echo ""
  echo "Por favor, configura las siguientes variables:"
  for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var}" ]; then
      echo "  - $var"
    fi
  done
  echo ""
  echo "Guía: Ver DEPLOYMENT_GUIDE_SPANISH.md"
  exit 1
fi
