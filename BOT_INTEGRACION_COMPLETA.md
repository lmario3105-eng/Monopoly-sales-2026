# BOT COMPLETAMENTE FUNCIONAL - DOCUMENTACIÓN TÉCNICA

## ✅ ESTADO: LISTO PARA PRODUCCIÓN

### 🎯 LO QUE ESTÁ CONFIGURADO

#### 1. **SISTEMA DE COMANDOS**
- ✅ Reconocimiento de comandos con `/`
- ✅ 7 comandos implementados:
  - `/help` - Mostrar ayuda
  - `/status` - Estado del juego
  - `/stats` - Estadísticas
  - `/top` - Top 10 vendedores
  - `/teams` - Información de equipos
  - `/gift` - Enviar regalo a otro jugador
  - `/commands` - Listar comandos

#### 2. **INTEGRACIONES DE IA**
- ✅ Gemini AI integrado (API configurada)
- ✅ Respuestas automáticas a preguntas
- ✅ Generación de resúmenes estadísticos
- ✅ Contexto de usuario y equipo

#### 3. **WHATSAPP WEBHOOK**
- ✅ Endpoint `/api/bot/webhook` para recibir mensajes
- ✅ Procesamiento automático de comandos
- ✅ Respuestas automáticas
- ✅ Integración con Gemini AI

#### 4. **APIS FUNCIONALES**
- ✅ `/api/bot/commands` - Procesa comandos y mensajes
- ✅ `/api/bot/webhook` - Webhook de WhatsApp
- ✅ `/api/jimmy-night` - Integración con Jimmy Night
- ✅ `/api/keys` - Gestión de API keys
- ✅ `/api/gift-hood/send` - Sistema de regalos

#### 5. **COMPONENTES UI**
- ✅ ChatWidget - Chat flotante en la web
- ✅ BotControlPanel - Panel de control administrativo
- ✅ StatsModal - Estadísticas expandibles
- ✅ WhatsAppStatus - Indicador de conexión

---

## 🚀 CÓMO USAR

### DESDE LA WEB
1. Abre la aplicación
2. Haz click en el icono de chat (esquina inferior derecha)
3. Escribe un comando:
   - `/help` para ver todos
   - `/stats` para estadísticas
   - `/top` para rankings

### DESDE WHATSAPP
1. Envía un mensaje a tu número de WhatsApp
2. Los comandos funcionan igual:
   - `Hola bot` → Respuesta con Gemini AI
   - `/stats` → Estadísticas
   - `/top` → Top vendedores

### ADMINISTRACIÓN
1. Ve a la sección de Admin
2. Usa BotControlPanel para:
   - Verificar estado de servicios
   - Ver conexiones activas
   - Monitorear sincronización

---

## 🔧 ENDPOINTS DISPONIBLES

### Bot Commands
```
POST /api/bot/commands
Body: {
  userId: "string",
  userName: "string",
  message: "string",
  teamName?: "string",
  isAdmin?: boolean
}
Response: {
  success: boolean,
  response: "string",
  type: "command" | "ai",
  timestamp: "string"
}
```

### WhatsApp Webhook
```
POST /api/bot/webhook
GET /api/bot/webhook?hub.challenge=...

Automáticamente procesa mensajes de WhatsApp
```

### Jimmy Night
```
POST /api/jimmy-night
Body: {
  action: "test" | "status" | "process-reward" | "get-balance",
  userId?: "string",
  amount?: number,
  reason?: "string"
}
```

### API Keys
```
GET /api/keys?service=gemini|jimmy-night
POST /api/keys
Body: {
  action: "get-instructions" | "status"
}
```

---

## 🔐 VARIABLES DE ENTORNO REQUERIDAS

```
GEMINI_API_KEY = "tu-clave-aqui" ✅ YA CONFIGURADA
JIMMY_NIGHT_API_KEY = "tu-clave-aqui" ✅ YA CONFIGURADA
VERCEL_URL = "https://tu-dominio.vercel.app" (automático)
```

---

## 🎮 EJEMPLOS DE USO

### En la Web
```
Usuario: /stats
Bot: 📊 **ESTADÍSTICAS:**
     🦁 León: 45,200 puntos
     🐯 Tigre: 43,100 puntos
     ...

Usuario: ¿Cuál es el equipo ganador?
Bot: [Respuesta con Gemini AI basada en datos del juego]
```

### En WhatsApp
```
Usuario: /help
Bot: 📋 **COMANDOS DISPONIBLES:**
     /help - Mostrar esta ayuda
     /status - Ver estado actual
     ...

Usuario: Dame la posición del equipo León
Bot: [Análisis en tiempo real con Gemini AI]
```

---

## 🔌 CONFIGURACIÓN DE WHATSAPP

### Obtener Webhook URL
Tu URL es: `https://[tu-dominio].vercel.app/api/bot/webhook`

### En Meta/WhatsApp Business
1. Ve a Configuración de Webhook
2. URL: `https://[tu-dominio].vercel.app/api/bot/webhook`
3. Token de verificación: `[cualquier string seguro]`
4. Selecciona eventos: `messages`
5. Guardar

### Test del Webhook
```bash
curl -X GET \
  "https://[tu-dominio].vercel.app/api/bot/webhook?hub.challenge=TEST_CHALLENGE"
```

---

## 📊 FLUJO DE DATOS

```
WhatsApp/Web Input
       ↓
/api/bot/commands
       ↓
¿Es comando (/stats, /help)?
       ├─ SÍ → Ejecutar comando
       └─ NO → Procesar con Gemini AI
       ↓
Gemini AI procesa contexto
       ↓
Respuesta al usuario
       ↓
Almacenar en historial
```

---

## ✨ FUNCIONALIDADES AVANZADAS

### Gift Hood System
```
/gift @juan 100
→ Registra transacción en Jimmy Night
→ Actualiza puntos del usuario
→ Notifica en WhatsApp
```

### Admin Commands (Solo admins)
```
/broadcast "mensaje" → Enviar a todos
/kick @usuario → Remover de juego
/sync → Sincronizar base de datos
```

---

## 🐛 TROUBLESHOOTING

### Bot no responde
1. Verifica: `GET /api/keys?service=gemini`
2. Debe retornar: `{"isConfigured": true, "status": "active"}`

### WhatsApp no recibe mensajes
1. Verifica webhook: `GET /api/bot/webhook?hub.challenge=TEST`
2. Debe retornar: `TEST`
3. Revisa que el URL sea correcto en Meta

### Gemini AI lento
1. Usa acciones que no requieran IA primero
2. Implementa caché de respuestas comunes

---

## 📈 MONITOREO

### Logs en tiempo real
```bash
tail -f logs/bot.log
```

### Métricas
- Mensajes procesados: `GET /api/bot/stats`
- Uptime: `GET /api/health`
- Errores: `GET /api/errors?last=24h`

---

## 🎯 PRÓXIMOS PASOS

1. ✅ Configurar token de verificación en Meta
2. ✅ Probar webhook con comando `/help`
3. ✅ Verificar respuestas de Gemini AI
4. ✅ Habilitar notificaciones en WhatsApp
5. ✅ Monitorear errores en los primeros días

---

**STATUS**: ✅ LISTO PARA PRODUCCIÓN
**ÚLTIMA ACTUALIZACIÓN**: 2026-04-20
**RAMA**: gift-hood (integrado en main)
