#!/bin/bash

# Script para configurar la rama 'gift-hood' en GitHub
# Esto crea una rama separada para la feature de Gift Hood con todas las APIs

set -e

echo "=========================================="
echo "Configurando rama 'gift-hood' para Gift Hood"
echo "=========================================="

# 1. Verificar que estamos en un repositorio Git
if [ ! -d .git ]; then
  echo "Error: No se encontró repositorio Git"
  exit 1
fi

# 2. Obtener rama actual
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "Rama actual: $CURRENT_BRANCH"

# 3. Crear rama 'gift-hood' desde 'main'
echo "Creando rama 'gift-hood'..."
git checkout main 2>/dev/null || git checkout master 2>/dev/null || true
git pull origin main 2>/dev/null || git pull origin master 2>/dev/null || true
git checkout -b gift-hood 2>/dev/null || git checkout gift-hood

echo "Rama 'gift-hood' creada/seleccionada exitosamente"

# 4. Agregar archivos de Gift Hood y APIs
echo "Agregando archivos de Gift Hood y APIs..."

# APIs
git add -A app/api/keys/ 2>/dev/null || true
git add -A app/api/jimmy-night/ 2>/dev/null || true
git add -A app/api/gift-hood/ 2>/dev/null || true
git add -A app/api/services/ 2>/dev/null || true
git add -A app/api/chat/ 2>/dev/null || true

# Componentes
git add -A components/gift-hood/ 2>/dev/null || true
git add -A components/chat/ 2>/dev/null || true
git add -A components/dashboard/ 2>/dev/null || true

# Archivos de configuración
git add -A app/page.tsx 2>/dev/null || true
git add -A app/globals.css 2>/dev/null || true
git add -A package.json 2>/dev/null || true

echo "Archivos agregados al stage"

# 5. Hacer commit
COMMIT_MESSAGE="feat: Add Gift Hood feature with Jimmy Night and Gemini APIs

- Add Gift Hood panel component
- Implement Gift Hood API endpoint
- Add API keys management endpoint
- Integrate Jimmy Night API support
- Add improved chat components
- Enhance dashboard with stats modal
- Add WhatsApp status indicator
- Improve responsive layout and UX"

git commit -m "$COMMIT_MESSAGE" 2>/dev/null || echo "Nada que commitear o ya está actualizado"

# 6. Configurar rama para tracking
echo "Configurando rama para GitHub..."
git branch --set-upstream-to=origin/gift-hood gift-hood 2>/dev/null || true

# 7. Mostrar resumen
echo ""
echo "=========================================="
echo "Rama 'gift-hood' configurada exitosamente"
echo "=========================================="
echo "Estado actual:"
git status
echo ""
echo "Para hacer push a GitHub:"
echo "  git push origin gift-hood"
echo ""
echo "Para cambiar entre ramas:"
echo "  git checkout main          # Volver a main"
echo "  git checkout gift-hood     # Ir a gift-hood"
echo ""
