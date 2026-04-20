# Guía de Configuración: Bot de WhatsApp - Monopolio de Ventas

## 📱 Descripción General

El bot de WhatsApp permite a los usuarios del programa "Monopolio de Ventas: Montería Edition" gestionar todas las tareas directamente desde WhatsApp:
- Registrar ventas
- Ver estado personal y del grupo
- Invitar nuevos miembros
- Verificar tabla de posiciones
- Recibir notificaciones en tiempo real

Los datos se sincronizan automáticamente con la plataforma web.

---

## 🚀 Instalación y Configuración

### Opción 1: Usar Twilio (Recomendado para Producción)

#### Paso 1: Crear Cuenta en Twilio
1. Ve a [twilio.com](https://twilio.com)
2. Crea una cuenta y verifica tu email
3. Ve al dashboard → Messaging → Try it out
4. Selecciona "WhatsApp Sandbox"

#### Paso 2: Configurar el Webhook
1. En el Twilio dashboard, ve a Messaging → WhatsApp Sandbox Settings
2. En "When a message comes in", ingresa:
   ```
   https://tudominio.com/api/whatsapp
   ```
3. Método: POST
4. Guarda los cambios

#### Paso 3: Obtener Credenciales
1. Ve a Account → API Keys & Tokens
2. Copia tu `ACCOUNT SID` y `AUTH TOKEN`
3. Ve a Messaging → Settings → WhatsApp Sandbox
4. Obtén el `TWILIO_WHATSAPP_NUMBER`

#### Paso 4: Configurar Variables de Entorno
En tu proyecto `.env.local`:
```env
TWILIO_ACCOUNT_SID=tu_account_sid
TWILIO_AUTH_TOKEN=tu_auth_token
TWILIO_WHATSAPP_NUMBER=+1234567890
WHATSAPP_VERIFY_TOKEN=monopolio_sales_2025
```

#### Paso 5: Conectar el Bot
1. Ve a `/admin/whatsapp-bot` en tu aplicación
2. Ingresa el `WHATSAPP_VERIFY_TOKEN` (ej: monopolio_sales_2025)
3. Obtén el Access Token de Twilio
4. Ingresa el Phone Number ID
5. Haz clic en "Conectar Bot"

---

### Opción 2: Usar Meta WhatsApp Business API (Para Producción a Escala)

#### Paso 1: Crear App de Meta
1. Ve a [Meta Developers](https://developers.facebook.com/)
2. Crea una nueva aplicación (tipo: Business)
3. Agrega el producto "WhatsApp"

#### Paso 2: Configurar Webhook
1. En settings de tu app, ve a Webhooks
2. Suscríbete al evento `messages`
3. Ingresa la URL del webhook:
   ```
   https://tudominio.com/api/whatsapp
   ```

#### Paso 3: Obtener Tokens
1. Ve a WhatsApp Business Platform
2. Obtén tu `PHONE_NUMBER_ID` y `ACCESS_TOKEN`
3. Configura el `VERIFY_TOKEN` (cualquier string seguro)

#### Paso 4: Variables de Entorno
```env
WHATSAPP_ACCESS_TOKEN=tu_access_token
WHATSAPP_PHONE_NUMBER_ID=tu_phone_id
WHATSAPP_VERIFY_TOKEN=tu_verify_token
```

#### Paso 5: Conectar
1. Ve a `/admin/whatsapp-bot`
2. Ingresa las credenciales
3. Haz clic en "Conectar Bot"

---

## 💬 Comandos Disponibles para Usuarios

Los usuarios en WhatsApp pueden enviar estos comandos:

### 1. Registrar Venta
```
registrar venta <categoría> <puntos>
```
**Ejemplo:**
```
registrar venta vape 150
registrar venta destilado 200
```
**Respuesta:** Confirma los puntos registrados y actualiza automáticamente el juego

---

### 2. Ver Mi Estado
```
mi estado
```
**Respuesta:** Muestra:
- Nombre del usuario
- Zona asignada
- Puntos personales
- Número de reclutas
- Puntos de la zona
- Días restantes

---

### 3. Invitar Miembros
```
invitar miembros
```
**Respuesta:** Envía un enlace de invitación único con bonificación

---

### 4. Ver Tabla de Posiciones
```
tabla de posiciones
```
O simplemente:
```
ranking
```
**Respuesta:** Muestra:
- Ranking de zonas
- Top 3 vendedores individuales

---

### 5. Obtener Ayuda
```
ayuda
```
O:
```
comandos
```
**Respuesta:** Lista todos los comandos disponibles

---

## 🔧 Panel de Administración

### Acceder al Control Panel
Navega a: `/admin/whatsapp-bot`

### Funcionalidades

#### 1. Estado del Bot
- Indicador visual: Verde = Conectado, Rojo = Desconectado
- Última sincronización
- Opción para reconectar

#### 2. Configuración
- Ingresa credenciales de Twilio o Meta
- Verifica token
- Phone Number ID
- Guarda y conecta

#### 3. Enviar Mensaje de Prueba
- Selecciona un número de teléfono
- Escribe el mensaje
- Envía para probar la integración

#### 4. Estadísticas
- Mensajes recibidos hoy
- Usuarios activos
- Ventas registradas
- Invitaciones enviadas

#### 5. Historial de Mensajes
- Log de todos los mensajes recibidos
- Timestamp de cada mensaje
- Datos del remitente

---

## 🔐 Seguridad

### Buenas Prácticas

1. **Tokens Seguros**
   - Guarda los tokens en variables de entorno
   - Nunca los compartas en código
   - Rota los tokens regularmente

2. **Validación**
   - El bot valida que el verify token coincida
   - Los comandos se validan antes de procesarse
   - Las ventas se verifican contra el rango permitido

3. **Logs**
   - Todos los comandos se registran
   - Errores se logean para debugging
   - Actividades sospechosas se marcan

---

## 📊 Sincronización con la Plataforma Web

### Cómo Funciona

1. Usuario envía mensaje en WhatsApp
2. El servidor recibe en `/api/whatsapp`
3. Se procesa el comando
4. Los datos se guardan en la base de datos
5. La web se actualiza automáticamente (en tiempo real)

### Flujo de Registrar Venta

```
Usuario: "registrar venta vape 150"
    ↓
Bot valida categoría y puntos
    ↓
Se guarda en BD
    ↓
Se actualiza puntuación en web
    ↓
Se añade a actividad feed
    ↓
Bot responde: "✅ Venta registrada: 150 puntos en Vape"
```

---

## 🐛 Troubleshooting

### El bot no recibe mensajes

**Problema:** No llegan mensajes
**Soluciones:**
- Verifica que el webhook esté correcto
- Comprueba que el verify token coincida
- Revisa los logs del servidor
- En Twilio, prueba desde el sandbox

### Mensajes no se sincronizan

**Problema:** Los puntos no aparecen en la web
**Soluciones:**
- Verifica la conexión a la BD
- Revisa que el usuario esté registrado
- Comprueba los permisos de escritura en BD

### Error de autenticación

**Problema:** "Token inválido" o "No autorizado"
**Soluciones:**
- Verifica el VERIFY_TOKEN en variables de entorno
- Comprueba que el ACCESS_TOKEN no esté expirado
- En Meta, regenera el token si es necesario

---

## 📝 Ejemplo de Integración Completa

### Caso: Usuario Juan registra venta

1. **Juan en WhatsApp:**
   ```
   registrar venta ropa 175
   ```

2. **Bot procesa:**
   - Valida que "ropa" es categoría válida
   - Verifica que 175 está en rango 0-1000
   - Busca a Juan en BD
   - Suma 175 puntos (si es especialidad, +20%)
   - Registra en tabla de ventas
   - Actualiza puntos del grupo

3. **Bot responde:**
   ```
   ✅ Venta registrada: 175 puntos en Ropa
   Tu total: 2,450 pts
   Grupo C: 14,200 pts
   ```

4. **En la web:**
   - El leaderboard se actualiza en tiempo real
   - El feed de actividad muestra: "Juan registró venta: 175 pts"
   - Los gráficos se actualizan automáticamente

---

## 🎯 Mejores Prácticas

1. **Mantén el Bot Activo**
   - Revisa el panel regularmente
   - Monitorea mensajes y errores

2. **Comunica a los Usuarios**
   - Envía un mensaje inicial con instrucciones
   - Recuerda los comandos disponibles

3. **Valida Regularmente**
   - Prueba comandos periódicamente
   - Verifica que la sincronización funciona

4. **Optimiza las Respuestas**
   - Las respuestas deben ser concisas
   - Usa emojis para claridad
   - Incluye ejemplos cuando sea necesario

---

## 📞 Soporte

Para problemas o preguntas:
1. Revisa los logs en `/admin/whatsapp-bot`
2. Verifica la configuración de credenciales
3. Comprueba la documentación del proveedor (Twilio/Meta)
4. Contacta al equipo de soporte

---

**Última actualización:** 2025-04-20
**Versión:** 1.0
