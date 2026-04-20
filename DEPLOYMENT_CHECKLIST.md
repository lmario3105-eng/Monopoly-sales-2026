# CHECKLIST DE DESPLIEGUE - BOT DE WHATSAPP CON IA

## ✅ CHECKLIST DE CONFIGURACIÓN RÁPIDA

### ANTES DE DESPLEGAR (Obtener Credenciales)

**Google Gemini IA**
- [ ] Ve a: https://aistudio.google.com
- [ ] Haz clic en "Get API key"
- [ ] Copia tu `GEMINI_API_KEY` (guárdala en un lugar seguro)

**Meta Developers (WhatsApp)**
- [ ] Accede a: https://developers.facebook.com
- [ ] Crea una app (tipo: Business) o usa una existente
- [ ] Ve a WhatsApp > Getting Started
- [ ] Copia: `WHATSAPP_PHONE_NUMBER_ID`
- [ ] Copia: `WHATSAPP_ACCESS_TOKEN` (temporal, por ahora)
- [ ] Ve a Settings > Basic
- [ ] Copia: `App ID` y `App Secret`
- [ ] Crea tu propio `WHATSAPP_VERIFY_TOKEN` (ej: `monopolio_sales_2025_test`)

---

### DESPLIEGUE EN VERCEL

- [ ] Accede a: https://vercel.com
- [ ] Haz clic en "Add New..." > "Project"
- [ ] Conecta tu repositorio Git
- [ ] Vercel detectará automáticamente Next.js
- [ ] Haz clic en "Deploy"
- [ ] **Espera el despliegue (2-3 minutos)**

### CONFIGURAR VARIABLES EN VERCEL

En tu proyecto Vercel, ve a **Settings** > **Environment Variables** y añade:

| Variable | Valor |
|----------|-------|
| `WHATSAPP_VERIFY_TOKEN` | Tu token personalizado |
| `WHATSAPP_ACCESS_TOKEN` | Del dashboard de Meta |
| `WHATSAPP_PHONE_NUMBER_ID` | Del dashboard de Meta |
| `GEMINI_API_KEY` | De Google AI Studio |

- [ ] Todas las variables añadidas
- [ ] Haz un nuevo despliegue desde Vercel

### CONFIGURAR WEBHOOK EN META

Una vez que Vercel termine:

- [ ] Tu URL de Vercel es: `https://[nombre-proyecto].vercel.app`
- [ ] Tu URL del webhook es: `https://[nombre-proyecto].vercel.app/api/whatsapp`
- [ ] Ve a Meta Developers > Tu App > WhatsApp > Configuration
- [ ] En **Webhook URL**, pega: `https://[nombre-proyecto].vercel.app/api/whatsapp`
- [ ] En **Verify Token**, pega: Tu `WHATSAPP_VERIFY_TOKEN`
- [ ] Haz clic en **"Verify and Save"**
- [ ] En **Webhook Fields**, marca: `messages`
- [ ] Guarda los cambios

### PRUEBAS INICIALES

- [ ] Abre WhatsApp en tu teléfono
- [ ] Busca el número de WhatsApp Business que configuraste
- [ ] Envía un mensaje de prueba (ej: "Hola")
- [ ] **El bot debería responder con IA**
- [ ] Ve a Vercel > Logs y verifica que se procesó correctamente

---

## 🚀 ESTADO DEL DESPLIEGUE

### Tu Proyecto de Vercel
```
URL: https://[tu-proyecto].vercel.app
Estado: [COMPLETAR DESPUÉS DE DESPLEGAR]
Último despliegue: [COMPLETAR DESPUÉS DE DESPLEGAR]
```

### Tu Configuración Meta
```
App ID: [COMPLETAR]
WhatsApp Phone Number ID: [COMPLETAR]
Webhook URL: https://[tu-proyecto].vercel.app/api/whatsapp
Webhook Verify Token: [COMPLETAR]
```

---

## 📋 ESTADO ACTUAL DE TU BOT

- **Framework**: ✅ Next.js 16
- **API de WhatsApp**: ✅ Webhook configurado
- **IA (Gemini)**: ⏳ Pendiente credenciales
- **Base de Datos**: ⏳ Pendiente (en memoria por ahora)
- **Despliegue Vercel**: ⏳ Pendiente

---

## 🔗 ENLACES ÚTILES

### Documentación Oficial
- Meta WhatsApp API: https://developers.facebook.com/docs/whatsapp/cloud-api
- Google Gemini: https://ai.google.dev
- Vercel: https://vercel.com/docs

### Tus Dashboards
- Meta Developers: https://developers.facebook.com/apps
- Vercel Dashboard: https://vercel.com/dashboard
- Google AI Studio: https://aistudio.google.com

---

## ⚡ PRÓXIMOS PASOS

1. **Completa el checklist anterior**
2. **Verifica tu bot respondiendo en WhatsApp**
3. **Revisa los logs en Vercel**
4. **Itera mejorando las respuestas del bot**
5. **Cuando esté listo: mueve a producción**

---

## 💡 TIPS

- **Desarrollo Local**: Usa `pnpm run dev` para probar cambios antes de desplegar
- **Git Push = Despliegue**: Cada vez que hagas push a tu repo, Vercel desplega automáticamente
- **Ramas de Prueba**: Usa ramas diferentes para probar sin afectar `main`
- **Logs**: Los logs de Vercel son tu mejor amigo para depuración
- **Rate Limits**: Gemini tiene un límite de 60 solicitudes por minuto en la capa gratuita

---

## ❌ TROUBLESHOOTING RÁPIDO

| Problema | Solución |
|----------|----------|
| **"Webhook verification failed"** | Verifica que el `WHATSAPP_VERIFY_TOKEN` sea idéntico |
| **"Bot no responde"** | Revisa los logs en Vercel para ver errores |
| **"Gemini API error"** | Verifica que tu `GEMINI_API_KEY` sea válida |
| **"No puedo acceder a la URL"** | Espera a que Vercel termine el despliegue |

---

**¡Tu bot está casi listo! Continúa con el checklist anterior.** ✨
