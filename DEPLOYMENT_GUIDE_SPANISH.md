# GUÍA COMPLETA: DESPLIEGUE DE BOT DE WHATSAPP EN VERCEL

## FASE 1: PREPARACIÓN INICIAL (5-10 minutos)

### 1.1 Crear Cuenta de Google Gemini (API de IA)
Si no tienes acceso a Google Gemini:

1. Ve a: https://aistudio.google.com
2. Haz clic en "Get API key"
3. Selecciona "Create API key in new project"
4. Google te generará una clave de API de forma automática
5. **Copia esta clave** - la usaremos luego como `GEMINI_API_KEY`

**Nota**: La capa gratuita de Gemini incluye 60 solicitudes por minuto, suficiente para pruebas.

---

## FASE 2: CONFIGURACIÓN EN META DEVELOPERS (WhatsApp)

### 2.1 Crear una Aplicación en Meta (si no tienes una)
1. Ve a: https://developers.facebook.com
2. Haz clic en "My Apps" > "Create App"
3. Selecciona tipo de aplicación: **Business**
4. Rellena los detalles y crea la aplicación

### 2.2 Configurar WhatsApp Business API
1. En tu app de Meta, ve a: **WhatsApp** > **Getting Started**
2. Recibirás:
   - `WHATSAPP_PHONE_NUMBER_ID`
   - `WHATSAPP_ACCESS_TOKEN` (temporal, necesitarás uno permanente luego)
3. Ve a **Settings** > **Basic** y copia:
   - `App ID`
   - `App Secret` (guárdalo de forma segura)

### 2.3 Crear un Token de Verificación Personalizado
Este token lo generarás tú mismo. Puede ser cualquier cadena alfanumérica:
- Ejemplo: `monopolio_sales_2025_secure_test`
- Usa este valor para `WHATSAPP_VERIFY_TOKEN`

---

## FASE 3: DESPLIEGUE EN VERCEL

### 3.1 Conectar tu Repositorio Git a Vercel
1. Ve a: https://vercel.com
2. Haz clic en **"Add New..."** > **"Project"**
3. Selecciona tu repositorio de Git (GitHub, GitLab, o Bitbucket)
4. Vercel detectará automáticamente que es un proyecto Next.js
5. Haz clic en **"Import"**

### 3.2 Configurar Variables de Entorno en Vercel
En la pantalla de configuración del proyecto:

1. Ve a **Environment Variables**
2. Añade las siguientes variables:

| Variable | Valor | Notas |
|----------|-------|-------|
| `WHATSAPP_VERIFY_TOKEN` | Tu token personalizado | Ej: `monopolio_sales_2025_secure_test` |
| `WHATSAPP_ACCESS_TOKEN` | Token de Meta | De tu app en Meta Developers |
| `WHATSAPP_PHONE_NUMBER_ID` | ID del número | De WhatsApp Business API |
| `GEMINI_API_KEY` | Tu clave de API | De Google AI Studio |
| `WHATSAPP_APP_SECRET` | App Secret de Meta | Opcional, para mayor seguridad |
| `NODE_ENV` | `development` | Para entorno de prueba |

**Importante**: Marca estas variables para los entornos **Preview** y **Development**, no para **Production** (aún).

### 3.3 Completar el Despliegue
1. Haz clic en **"Deploy"**
2. Vercel comenzará el build automáticamente
3. **Espera 2-3 minutos** a que termine el despliegue
4. Una vez completado, verás tu URL de Vercel (ej: `https://monopolio-bot.vercel.app`)

---

## FASE 4: CONECTAR EL WEBHOOK A META

### 4.1 Obtener la URL del Webhook
Tu URL del webhook será:
```
https://[tu-proyecto-vercel].vercel.app/api/whatsapp
```

Reemplaza `[tu-proyecto-vercel]` con el nombre de tu proyecto en Vercel.

### 4.2 Configurar el Webhook en Meta Developers
1. Ve a tu app en Meta: https://developers.facebook.com
2. Selecciona tu aplicación
3. Ve a **WhatsApp** > **Configuration**
4. En **Webhook URL**, pega tu URL de Vercel (ej: `https://monopolio-bot.vercel.app/api/whatsapp`)
5. En **Verify Token**, pega el token que creaste (`WHATSAPP_VERIFY_TOKEN`)
6. Haz clic en **"Verify and Save"**

**Esperado**: Meta enviará una solicitud GET a tu webhook para verificarlo. Si Vercel está desplegado correctamente, Meta confirmará la verificación.

### 4.3 Suscribirse a Eventos de Mensajes
1. En **Webhook Fields**, asegúrate de que está marcado: **`messages`**
2. Guarda los cambios

---

## FASE 5: PRUEBAS INICIALES CON TU BOT

### 5.1 Enviar tu Primer Mensaje
1. En tu dispositivo móvil, abre WhatsApp
2. Busca el número de WhatsApp Business que configuraste
3. Envía un mensaje de prueba (ej: "Hola bot")
4. **El bot debería responder** con una respuesta generada por Gemini IA

### 5.2 Revisar Logs en Vercel
1. Ve a tu proyecto en Vercel: https://vercel.com/dashboard
2. Selecciona tu proyecto
3. Ve a **Deployments** > **Function Logs**
4. Aquí verás los logs de tu webhook:
   - Mensajes recibidos
   - Respuestas generadas
   - Errores (si los hay)

### 5.3 Depuración
Si no funciona:

1. **Error "Token inválido"**: Verifica que `WHATSAPP_VERIFY_TOKEN` sea idéntico en Meta y Vercel
2. **Error "Webhook no accesible"**: Asegúrate de que la URL de Vercel sea correcta (sin trailing slash)
3. **Sin respuestas del bot**: Revisa los logs de Vercel para ver si hay errores de API de Gemini
4. **Rate limit de Gemini**: Si envías muchos mensajes rápido, puedes alcanzar el límite de 60 req/min

---

## FASE 6: ITERACIÓN Y MEJORA (CICLO CONTINUO)

### 6.1 Hacer Cambios en tu Código
1. Edita tu código localmente (ej: mejorar las respuestas del bot)
2. Sube los cambios a Git: `git push`
3. **Automáticamente**: Vercel generará un nuevo despliegue

### 6.2 Probar en Entorno de Preview
Si trabajas en ramas diferentes:
- Rama `main` = Despliegue de Producción (URL fija)
- Rama `develop` o `feature-X` = Despliegues de Preview (URLs únicas)

Esto te permite probar nuevas funcionalidades sin afectar el bot en producción.

### 6.3 Habilitar Notificaciones de Despliegue
En Vercel, configura notificaciones para:
- Despliegues completados
- Despliegues fallidos
- Cambios en variables de entorno

---

## FASE 7: ESCALADO Y PRODUCCIÓN (DESPUÉS DE PRUEBAS)

### 7.1 Cambiar a Token Permanente de WhatsApp
1. En Meta Developers, genera un **"System User Access Token"**
2. Reemplaza tu `WHATSAPP_ACCESS_TOKEN` con este token permanente
3. Actualiza en Vercel: Environment Variables

### 7.2 Agregar Seguridad Adicional
- Habilita verificación de `WHATSAPP_APP_SECRET`
- Implementa rate limiting para proteger tu API
- Usa variables secretas para datos sensibles

### 7.3 Monitoreo y Alertas
1. En Vercel, activa **Monitoring and Analytics**
2. En Google Cloud, configura alertas para tu API de Gemini
3. Monitorea: latencia, errores, uso de la API

---

## TROUBLESHOOTING RÁPIDO

| Problema | Solución |
|----------|----------|
| "Webhook URL no válida" | Verifica que la URL sea HTTPS y accesible públicamente |
| "Token inválido" | Copia/pega exactamente el token, sin espacios extras |
| "Gemini API Error" | Verifica que tu clave de API sea correcta y no esté expirada |
| "Mensaje no recibido" | En Meta, verifica que `messages` esté en Webhook Fields |
| "Rate limit excedido" | Espera 1 minuto o solicita upgrade de Gemini |

---

## COMANDOS ÚTILES

### Clonar y preparar tu proyecto local:
```bash
git clone [tu-repo-url]
cd [nombre-del-proyecto]
pnpm install
```

### Ejecutar localmente (para desarrollo):
```bash
pnpm run dev
```

### Verificar que el webhook funciona:
```bash
curl -X GET "https://[tu-proyecto].vercel.app/api/whatsapp?hub.verify_token=TU_TOKEN&hub.challenge=test"
```

---

## PRÓXIMOS PASOS (DESPUÉS DE VALIDAR)

1. **Mejorar IA**: Ajusta las prompts de Gemini para mejores respuestas
2. **Persistencia**: Implementa base de datos (Supabase, etc.) para historial
3. **Automatización**: Crea flujos de juego automáticos (turnos, puntuación)
4. **Analytics**: Agrega dashboards para monitorear uso
5. **Producción**: Mueve a rama `main` y desactiva deploys de preview

---

## CONTACTO Y SOPORTE

- **Meta Developers Help**: https://developers.facebook.com/docs/whatsapp
- **Vercel Docs**: https://vercel.com/docs
- **Google Gemini Docs**: https://ai.google.dev
- **Tu Dashboard de Vercel**: https://vercel.com/dashboard

¡Tu bot de "Monopolio de Ventas" en WhatsApp está listo para el mundo! 🚀
