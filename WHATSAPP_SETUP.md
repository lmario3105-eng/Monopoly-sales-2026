# 📱 CONFIGURACIÓN WHATSAPP - GUÍA RÁPIDA

## 🎯 OBJETIVO
Conectar tu número de WhatsApp para recibir comandos del bot en WhatsApp

## ⚙️ PASOS DE CONFIGURACIÓN

### 1. Obtener URL del Webhook
Tu webhook está en:
```
https://[tu-proyecto].vercel.app/api/bot/webhook
```

Reemplaza `[tu-proyecto]` con tu dominio de Vercel

### 2. Ir a Meta Business Platform
1. Abre https://business.facebook.com
2. Login con tu cuenta
3. Selecciona tu app de WhatsApp Business

### 3. Configurar Webhook
1. Ve a **Configuración** → **Webhooks**
2. Click en **Editar suscripción de webhooks**
3. Ingresa:
   - **URL del callback**: `https://[tu-proyecto].vercel.app/api/bot/webhook`
   - **Token de verificación**: `TU_TOKEN_SECRETO` (ej: "monopolio2026")
4. **Campos de webhook**: Selecciona `messages`
5. Click en **Verificar y guardar**

### 4. Probar Webhook
En terminal:
```bash
curl -X GET \
  "https://[tu-proyecto].vercel.app/api/bot/webhook?hub.challenge=TEST_CHALLENGE&hub.verify_token=TU_TOKEN_SECRETO"
```

Debe responder: `TEST_CHALLENGE`

### 5. Habilitar Números de Teléfono
1. Ve a **Configuración** → **Números de teléfono**
2. Agrega tu número: +57 [TU_NÚMERO]
3. Verifica con código

---

## 🤖 COMANDOS DISPONIBLES EN WHATSAPP

Envía estos comandos a tu número:

```
/help               → Ver todos los comandos
/status             → Estado actual del juego
/stats              → Estadísticas del juego
/top                → Top 10 vendedores
/teams              → Información de equipos
/gift @usuario 100  → Enviar 100 puntos a otro
/commands           → Listar todo nuevamente
```

O simplemente escribe cualquier pregunta:
```
¿Cuál es mi posición?
Dame las estadísticas
¿Quién es el mejor equipo?
```

---

## 📞 EJEMPLOS DE CONVERSACIÓN

### Comando
```
Tú:   /stats
Bot:  📊 **ESTADÍSTICAS:**
      🦁 León: 45,200 puntos
      🐯 Tigre: 43,100 puntos
      🦅 Águila: 41,900 puntos
      🐍 Serpiente: 39,800 puntos
```

### Pregunta Natural
```
Tú:   ¿Cuál es el equipo ganador?
Bot:  Basándome en los datos actuales, el equipo 🦁 León
      va en la delantera con 45,200 puntos, seguido
      muy de cerca por 🐯 Tigre...
```

### Comando Gift
```
Tú:   /gift @juan 500
Bot:  🎁 Regalo enviado a @juan por 500 puntos!
      Transacción: JN-1234567890
      Estado: Completada
```

---

## 🔧 TROUBLESHOOTING

### El bot no responde en WhatsApp
**Problema**: Webhook no está configurado correctamente

**Solución**:
1. Verifica que el URL sea correcto
2. Prueba el webhook: `curl -X GET "https://[url]/api/bot/webhook?hub.challenge=TEST&hub.verify_token=TU_TOKEN"`
3. Debe retornar: `TEST`

### Error "Token inválido"
**Problema**: Token de verificación no coincide

**Solución**:
1. Ve a Meta y copia el token configurado
2. Usa el MISMO token en los tests

### Mensajes no llegan al bot
**Problema**: Número no verificado o webhooks no habilitado

**Solución**:
1. Verifica el número en Meta
2. Asegúrate de habilitar eventos de "messages"
3. Redeploy en Vercel

---

## 🔒 SEGURIDAD

- 🔐 El token de verificación es privado (no lo compartas)
- 🔐 Las API keys están en variables de entorno
- 🔐 Todos los mensajes se registran
- 🔐 Solo usuarios verificados pueden usar comandos admin

---

## 📊 MONITOREO

Ver mensajes procesados:
```bash
curl https://[tu-proyecto].vercel.app/api/bot/stats
```

Ver últimos errores:
```bash
curl https://[tu-proyecto].vercel.app/api/errors?last=24h
```

---

## 🚀 TIPS

1. **Respuestas rápidas**: Usa comandos `/stats`, `/top`, etc.
2. **Respuestas personalizadas**: Escribe en lenguaje natural
3. **Automatización**: Configura notificaciones diarias
4. **Admin**: Usa comandos como `/broadcast` para anuncios

---

## ✅ CHECKLIST

- [ ] Webhook URL obtenida
- [ ] Configurado en Meta Business
- [ ] Token de verificación establecido
- [ ] Webhook verificado (curl test pasó)
- [ ] Número de teléfono verificado
- [ ] Primer mensaje enviado
- [ ] Comandos funcionando

---

**ESTADO**: ✅ LISTO PARA USAR

Ahora puedes recibir mensajes y comandos en WhatsApp! 📱
