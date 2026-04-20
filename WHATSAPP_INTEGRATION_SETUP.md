# Integración WhatsApp - Monopolio de Ventas

## Descripción General

El bot de WhatsApp permite que **administradores y jugadores** gestionen todo el juego directamente desde WhatsApp, con sincronización bidireccional automática a la plataforma web.

## Arquitectura

```
WhatsApp Message
    ↓
Twilio/Meta Cloud API
    ↓
/api/whatsapp (Webhook)
    ↓
parseWhatsAppMessage()
    ↓
Database (Sincronización)
    ↓
Respuesta automática + Notificación
    ↓
WhatsApp al Usuario
```

## Configuración

### 1. Opción A: Twilio (Recomendado para comenzar)

```bash
npm install twilio
```

**.env.local:**
```env
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+1234567890
WHATSAPP_VERIFY_TOKEN=monopolio_sales_2025
```

### 2. Opción B: Meta WhatsApp Business API

```bash
npm install axios
```

**.env.local:**
```env
META_PHONE_NUMBER_ID=your_phone_number_id
META_BUSINESS_ACCOUNT_ID=your_business_account_id
META_ACCESS_TOKEN=your_access_token
META_VERIFY_TOKEN=monopolio_sales_2025
```

## Webhook Setup

### URL del Webhook
```
https://your-domain.com/api/whatsapp
```

**Pasos en Twilio:**
1. Ir a Twilio Console
2. Messaging → Whatsapp Senders
3. Configurar Webhook URL: `https://your-domain.com/api/whatsapp`
4. Verb: POST

**Pasos en Meta:**
1. Facebook App Dashboard
2. WhatsApp → Configuration
3. Webhook URL: `https://your-domain.com/api/whatsapp`
4. Verify Token: `monopolio_sales_2025`

## Comandos Disponibles

### Para Jugadores

```
registrar venta <categoría> <puntos>
  Ejemplo: registrar venta vape 150
  Registra venta y suma puntos a la cuenta

mi estado
  Muestra puntos, zona, posición en ranking

tabla de posiciones
  Ranking actual de todas las zonas

invitar miembros
  Obtiene enlace para invitar compañeros

ayuda
  Lista todos los comandos
```

### Para Administradores

```
admin stats
  Estadísticas globales del sistema

admin broadcast <mensaje>
  Envía mensaje a todos los usuarios
  Ejemplo: "admin broadcast ¡Hoy es el último día!"

admin set-role <teléfono> <admin|player>
  Cambiar rol del usuario
```

## Sincronización Automática

### Flujo de Datos

**De WhatsApp a Web:**
```
1. Usuario envía: "registrar venta vape 150"
2. Bot procesa el comando
3. Base de datos se actualiza
4. Puntos aparecen en la página web automáticamente
5. Respuesta enviada al usuario por WhatsApp
```

**De Web a WhatsApp:**
```
1. Admin entra a Admin Panel en web
2. Click en "Enviar Mensaje a Todos"
3. Escribe el mensaje
4. Click "Enviar"
5. Notificaciones creadas en base de datos
6. Bot envía a WhatsApp (si está integrado con Twilio/Meta)
```

## Base de Datos (En Memoria - Demo)

Para producción, reemplazar con Supabase:

```typescript
// En producción:
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);
```

## Notificaciones

Las notificaciones se crean automáticamente cuando:
- ✅ Se registra una venta
- ✅ Se alcanza un hito (5 reclutas, 10 reclutas)
- ✅ Admin envía un mensaje broadcast
- ✅ Se produce un evento en el juego

## Testing

### 1. Verificar Webhook (SIN Twilio/Meta)

```bash
curl -X GET "http://localhost:3000/api/whatsapp?hub.verify_token=monopolio_sales_2025&hub.challenge=test123"
```

**Esperado:** Respuesta: `test123`

### 2. Simular Mensaje

```bash
curl -X POST "http://localhost:3000/api/whatsapp" \
  -H "Content-Type: application/json" \
  -d '{
    "entry": [{
      "changes": [{
        "value": {
          "messages": [{
            "from": "573001234567",
            "text": { "body": "registrar venta vape 100" }
          }],
          "contacts": [{
            "profile": { "name": "Test User" }
          }]
        }
      }]
    }]
  }'
```

### 3. Ver Estado de Base de Datos

```bash
curl "http://localhost:3000/api/whatsapp"
```

Devuelve JSON con:
- Usuarios registrados
- Notificaciones pendientes
- Acciones de admin

## Migración a Producción

### Paso 1: Setup Twilio/Meta
- Crear cuenta en Twilio.com o Meta for Business
- Obtener credentials
- Configurar variables de entorno en Vercel

### Paso 2: Reemplazar Base de Datos
```typescript
// lib/database.ts
// Cambiar de Map en memoria a Supabase
import * as db from '@supabase/supabase-js';
```

### Paso 3: Activar Envío de Mensajes
```typescript
// lib/whatsapp-service.ts
export async function sendWhatsAppMessage(
  phoneNumber: string,
  message: string
): Promise<boolean> {
  // Descomenta según tu proveedor:
  
  // TWILIO:
  const response = await twilio.messages.create({
    from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
    to: `whatsapp:${phoneNumber}`,
    body: message
  });
  
  // META:
  // await fetch(`https://graph.instagram.com/v18.0/${phoneNumberId}/messages`, {...})
}
```

### Paso 4: Deploy a Vercel

```bash
git add .
git commit -m "Add WhatsApp integration"
git push origin main
```

Vercel detectará cambios y desplegará automáticamente.

## Troubleshooting

### Webhook no recibe mensajes
- ✅ Verificar que URL está correcta en Twilio/Meta
- ✅ Verificar que `WHATSAPP_VERIFY_TOKEN` coincide
- ✅ Revisar logs en Vercel

### Mensajes no se envían desde Admin Panel
- ✅ Comprobar que `sendWhatsAppMessage` está implementado
- ✅ Verificar credenciales de Twilio/Meta
- ✅ Revisar `getPendingNotifications()`

### Usuario no aparece en BD
- ✅ Enviar primer mensaje al bot (crea usuario automáticamente)
- ✅ Verificar número telefónico incluyendo código país (+57 para Colombia)

### Puntos no se sincronizan
- ✅ Comprobar que comando fue procesado (revisar logs)
- ✅ Verificar que usuario existe en BD
- ✅ Recargar página web (o usar polling cada 5 segundos)

## Monitoreo

### Verificar que el sistema está activo

```bash
# En terminal de desarrollo
pnpm logs
```

### Ver usuarios conectados
```typescript
import * as db from '@/lib/database';

const connected = db.getConnectedWhatsAppUsers();
console.log(`Usuarios conectados: ${connected.length}`);
```

### Ver notificaciones pendientes
```typescript
const pending = db.getPendingNotifications();
console.log(`Pendientes: ${pending.length}`);
```

## Limitaciones (Demo)

⚠️ Versión actual es una DEMO. Limitaciones:

- Base de datos en memoria (se borra al reiniciar)
- No envía mensajes reales a WhatsApp (solo registra)
- Un webhook endpoint (no multi-empresa)
- Admin manual (no interfaz de cambio de roles)

Para producción, implementar:
✅ Supabase para persistencia
✅ Twilio/Meta API para mensajes reales
✅ Sistema de roles robusto
✅ Rate limiting y validación avanzada
✅ Logging y monitoreo

## Preguntas Frecuentes

**P: ¿Puedo usar mi número personal?**
R: No. Twilio/Meta requieren número de negocio. Pero durante testing, puedes usar número de prueba.

**P: ¿Qué pasa con los datos en demo?**
R: Se guardan en memoria. Al reiniciar el servidor, se pierden. Usar Supabase para persistencia.

**P: ¿Cuántos usuarios soporta?**
R: Demo: ~100. Producción con Supabase: miles. Con Redis (caché): decenas de miles.

**P: ¿Cómo agrego más comandos?**
R: Editar `lib/whatsapp-service.ts` función `parseWhatsAppMessage`.

