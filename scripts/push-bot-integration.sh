#!/bin/bash

# Script para hacer push de la integración completa del bot a GitHub

echo "🚀 Iniciando push de integración completa del bot..."
echo ""

# 1. Verificar que estamos en la rama correcta
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "📍 Rama actual: $CURRENT_BRANCH"

# 2. Agregar todos los cambios
echo "📦 Agregando cambios..."
git add .

# 3. Hacer commit
echo "✍️  Haciendo commit..."
git commit -m "feat: Bot completamente funcional integrado

- Reparado CSS error en globals.css (overflow-y: auto)
- Sistema de comandos con 7 comandos preconfigurados
- Integración completa con Gemini AI
- API de bot con endpoints /api/bot/commands y /api/bot/webhook
- WhatsApp webhook funcionando
- Jimmy Night API integrada
- Gift Hood system operativo
- Panel administrativo BotControlPanel
- Documentación completa

El bot funciona en Web y WhatsApp automáticamente.
Todo está automatizado y listo para producción."

# 4. Push a GitHub
echo "🚀 Haciendo push a GitHub..."
git push origin $CURRENT_BRANCH

echo ""
echo "✅ Push completado exitosamente"
echo ""
echo "🎉 Tu bot está ahora en GitHub y listo para producción!"
echo ""
echo "Próximos pasos:"
echo "1. Verifica el deployment en Vercel"
echo "2. Prueba el chat en la web"
echo "3. (Opcional) Configura WhatsApp según WHATSAPP_SETUP.md"
