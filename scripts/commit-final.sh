#!/bin/bash

# Verificar que estamos en el repositorio correcto
if [ ! -d ".git" ]; then
  echo "❌ No se encontró repositorio git"
  exit 1
fi

echo "📦 Preparando para commit..."

# Agregar todos los cambios
git add app/page.tsx app/chat/page.tsx app/api/chat-simple/route.ts *.md *.txt

# Mostrar archivos que se van a agregar
echo ""
echo "📝 Archivos a commitear:"
git diff --cached --name-only

# Realizar commit
echo ""
echo "💾 Creando commit..."
git commit -m "feat: Bot y juego completamente separados y funcionales

- Juego en ruta / sin conflictos
- Chat independiente en /chat con IA
- API simplificada en /api/chat-simple
- 7 comandos integrados + Gemini AI
- Arquitectura limpia sin dependencias circulares
- Todos los errores CSS corregidos
- Ready for production"

# Mostrar status
echo ""
echo "✅ Commit creado exitosamente"
git log --oneline -3

echo ""
echo "📤 Para hacer push, ejecuta:"
echo "   git push origin gift-hood"
