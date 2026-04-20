# 🚀 RESUMEN EJECUTIVO: TU BOT EN VERCEL (5 PASOS)

## ¿Qué harás?

Desplegar tu bot de WhatsApp impulsado por IA en Vercel, para que puedas:
- Recibir mensajes en WhatsApp
- Procesar con IA (Google Gemini)
- Responder automáticamente
- Iterar y mejorar rápidamente

---

## 5 PASOS PRINCIPALES

### PASO 1: Obtén tu Clave de IA (5 minutos)
1. Ve a: **https://aistudio.google.com**
2. Haz clic en **"Get API key"**
3. Google te dará una clave automáticamente
4. **Cópiala** → `GEMINI_API_KEY`

### PASO 2: Obtén Credenciales de WhatsApp (10 minutos)
1. Ve a: **https://developers.facebook.com**
2. Crea o selecciona tu app
3. Ve a **WhatsApp > Getting Started**
4. Copia:
   - `WHATSAPP_PHONE_NUMBER_ID`
   - `WHATSAPP_ACCESS_TOKEN`
5. Ve a **Settings > Basic** y copia:
   - `App Secret`

### PASO 3: Conecta a Vercel (3 minutos)
1. Ve a: **https://vercel.com**
2. Haz clic en **"Add New..." → "Project"**
3. Selecciona tu repositorio de Git
4. Haz clic en **"Deploy"**
5. **Espera 2-3 minutos**

### PASO 4: Añade Variables de Entorno (2 minutos)
En tu proyecto Vercel:
1. Ve a **Settings** → **Environment Variables**
2. Añade:
   - `WHATSAPP_VERIFY_TOKEN` = `monopolio_sales_2025_test`
   - `WHATSAPP_ACCESS_TOKEN` = Tu token de Meta
   - `WHATSAPP_PHONE_NUMBER_ID` = Tu ID de número
   - `GEMINI_API_KEY` = Tu clave de Google
3. **Despliega de nuevo**

### PASO 5: Conecta el Webhook (2 minutos)
1. Copia tu URL de Vercel: `https://[proyecto].vercel.app`
2. Ve a **Meta Developers > Tu App > WhatsApp > Configuration**
3. En **Webhook URL**, pega: `https://[proyecto].vercel.app/api/whatsapp`
4. En **Verify Token**, pega: `monopolio_sales_2025_test`
5. Haz clic en **"Verify and Save"**
6. Marca **"messages"** en Webhook Fields

### ¡LISTO! 🎉
Envía un mensaje a tu número de WhatsApp Business y el bot responderá.

---

## TIEMPO TOTAL

- Paso 1: 5 min
- Paso 2: 10 min
- Paso 3: 5 min
- Paso 4: 2 min
- Paso 5: 2 min
- **TOTAL: ~25 MINUTOS**

---

## DESPUÉS: CICLO DE MEJORA

```
Editas código → Git Push → Vercel Redeploy → Pruebas → Repite
    ↓              ↓              ↓             ↓
  Local         Automático    Automático     WhatsApp
```

Cada cambio que hagas y subas a Git será desplegado automáticamente en Vercel en ~2 minutos.

---

## VERIFICAR QUE FUNCIONA

1. Abre WhatsApp en tu teléfono
2. Busca el número de WhatsApp Business
3. Envía: "Hola bot"
4. Si recibiste respuesta → **¡FUNCIONA! ✅**
5. Si no → Revisa los logs en Vercel

---

## ARCHIVOS IMPORTANTES

En tu proyecto hay:
- **DEPLOYMENT_GUIDE_SPANISH.md** = Guía completa (detallada)
- **DEPLOYMENT_CHECKLIST.md** = Checklist paso a paso
- **.env.example** = Variables que necesitas
- **vercel.json** = Configuración de Vercel

---

## DUDAS FRECUENTES

**¿Dónde encuentro mi URL de Vercel?**
→ En tu dashboard de Vercel, debajo del nombre del proyecto

**¿Qué pasa si hago cambios?**
→ Solo haz `git push` y Vercel redeploya automáticamente en 2-3 minutos

**¿Mi bot puede escalar?**
→ Sí, Vercel escala automáticamente. Pagas solo por lo que uses.

**¿Necesito serverless?**
→ Ya lo tienes. Vercel convierte tu código en funciones serverless automáticamente.

---

## DASHBOARDS QUE USARÁS

| Plataforma | URL | Qué hacer |
|-----------|-----|----------|
| **Vercel** | https://vercel.com/dashboard | Ver despliegues, logs, variables |
| **Meta** | https://developers.facebook.com/apps | Configurar webhook |
| **Google AI** | https://aistudio.google.com | Copiar API key |

---

**¡Adelante! Tu bot de "Monopolio de Ventas" estará en WhatsApp en 25 minutos.** 🚀

Después de completar esto, contáctame para:
- Mejorar respuestas del bot
- Añadir persistencia en base de datos
- Crear flujos automáticos
- Escalar a producción
