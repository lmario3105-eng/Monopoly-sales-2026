# ¿CÓMO VERIFICAR QUE TODO ESTÁ FUNCIONANDO?

## 🎯 EN LA WEB (Preview)

### 1. ¿Carga la página?
✅ Abre el preview
✅ Deberías ver: Header, Board, Equipos, Activity Feed

Si ves blanco → El CSS error ya fue reparado, recarga

### 2. ¿El chat widget aparece?
✅ Mira en la esquina inferior derecha
✅ Deberías ver un icono de chat flotante
✅ Click en él → Se abre conversación

### 3. ¿Funciona el chat?
Prueba escribiendo en el chat:
```
/help
```
Respuesta esperada: Lista de 7 comandos disponibles

### 4. Prueba de comandos
En el chat, escribe uno de estos:
```
/status      → Estado del juego
/stats       → Estadísticas
/top         → Top 10
/teams       → Equipos
/commands    → Listar comandos
```

### 5. Prueba de IA
Sin usar `/` escribe:
```
¿Cuál es mi equipo?
Dame un resumen
¿Quién va ganando?
```
Respuesta esperada: Análisis con Gemini AI

---

## 📊 VERIFICAR APIS

### 1. API de Comandos
```bash
curl -X POST https://[tu-proyecto].vercel.app/api/bot/commands \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-test",
    "userName": "Test User",
    "message": "/help"
  }'
```
Respuesta esperada: Lista de comandos

### 2. API de Gemini
```bash
curl -X GET https://[tu-proyecto].vercel.app/api/keys?service=gemini
```
Respuesta esperada:
```json
{
  "service": "gemini",
  "isConfigured": true,
  "status": "active"
}
```

### 3. API de Jimmy Night
```bash
curl -X GET https://[tu-proyecto].vercel.app/api/jimmy-night
```
Respuesta esperada:
```json
{
  "success": true,
  "service": "jimmy-night",
  "data": {
    "isConfigured": true,
    "status": "ready"
  }
}
```

### 4. Webhook de WhatsApp
```bash
curl -X GET "https://[tu-proyecto].vercel.app/api/bot/webhook?hub.challenge=TEST_CHALLENGE"
```
Respuesta esperada: `TEST_CHALLENGE`

---

## 🔧 VERIFICAR COMPONENTES

### 1. BotControlPanel
Si tienes acceso a admin:
1. Ve a Admin Panel
2. Deberías ver 3 servicios: Gemini AI, WhatsApp, Jimmy Night
3. Click en "Actualizar" → Todos deben estar en verde (active)

### 2. ChatWidget
1. Click en icono de chat
2. Deberías ver mensaje inicial: "Hola! Soy tu asistente..."
3. Prueba escribir algo
4. Deberías recibir respuesta en < 2 segundos

### 3. StatsModal
1. En la página principal, haz click en "Ver Estadísticas"
2. Debería abrirse modal con:
   - Resumen / Equipos / Jugadores (tabs)
   - Datos con scroll ilimitado

---

## ⚠️ SI ALGO NO FUNCIONA

### Página en blanco
✅ Ya reparado
🔄 Si persiste: Recarga (Ctrl+Shift+R)

### Chat no abre
❌ Error: Componentes no importados correctamente
✅ Solución: Verifica que ChatWidget esté en page.tsx

### Chat abre pero no responde
❌ Error: API de comandos fallando
✅ Verificar: POST /api/bot/commands retorna 200

### IA muy lenta
❌ Problema: Rate limit de Gemini
✅ Solución: Espera o usa comandos (más rápidos)

### Comandos no funcionan
❌ Error: Comando no reconocido
✅ Verificar: Usaste `/` al inicio? Ej: `/help` ✅, `help` ❌

---

## 📈 MONITOREO EN TIEMPO REAL

### Ver logs en Vercel
1. Ve a Vercel Dashboard
2. Tu proyecto → Deployments → Functions
3. Haz click en `/api/bot/commands`
4. Deberías ver requests en tiempo real

### Ver errores
1. Vercel Dashboard
2. Deployments → Logs
3. Filtra por "error"

### Verificar variables de entorno
```bash
curl https://[tu-proyecto].vercel.app/api/keys -H "Content-Type: application/json" -d '{"action": "status"}'
```

---

## ✅ CHECKLIST DE VERIFICACIÓN

- [ ] Página carga (no en blanco)
- [ ] Chat widget visible
- [ ] `/help` retorna lista de comandos
- [ ] `/stats` retorna estadísticas
- [ ] Pregunta en IA retorna respuesta
- [ ] POST /api/bot/commands retorna 200
- [ ] GET /api/jimmy-night retorna success: true
- [ ] GET /api/keys?service=gemini retorna isConfigured: true

---

## 🚀 SI TODO FUNCIONA

¡Felicidades! Tu bot está:
✅ Completamente funcional
✅ Integrado con IA
✅ Listo para WhatsApp
✅ Automatizado 100%

Ahora:
1. Lee WHATSAPP_SETUP.md para conectar WhatsApp (opcional)
2. Configura notificaciones en tu número
3. ¡Disfruta!

---

## 🆘 SOPORTE

Si encuentras algún problema:

1. **Revisa los logs**: Vercel → Deployments → Logs
2. **Verifica APIs**: Usa los curl commands arriba
3. **Recarga la página**: Ctrl+Shift+R (no cache)
4. **Revisa variables de entorno**: Vercel Settings → Environment Variables

---

¡TU BOT ESTÁ LISTO! 🎉
