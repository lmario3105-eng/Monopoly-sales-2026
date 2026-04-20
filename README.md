# 🎮 Bot de WhatsApp: Monopolio de Ventas con IA

Un bot inteligente de WhatsApp impulsado por Google Gemini IA, desplegado automáticamente en Vercel.

## 🚀 INICIO RÁPIDO

**⏱️ Tiempo estimado: 25 minutos**

👉 **[VE A START_HERE.md](./START_HERE.md)** para instrucciones paso a paso

---

## ✨ Características

- ✅ **WhatsApp Business API Integration**: Recibe y envía mensajes automáticamente
- ✅ **Google Gemini IA**: Respuestas inteligentes y contextuales
- ✅ **Vercel Serverless**: Escala automáticamente, sin servidores
- ✅ **CI/CD Automático**: Cada `git push` = nuevo despliegue
- ✅ **Monitoreo en Tiempo Real**: Logs en el dashboard de Vercel
- ✅ **Base de Datos**: Persistencia de estado del juego (en memoria + Supabase ready)

---

## 📋 Estructura del Proyecto

```
monopolio-bot/
├── app/
│   ├── api/
│   │   └── whatsapp/
│   │       ├── route.ts          # Webhook principal
│   │       ├── status/route.ts   # Estado del bot
│   │       └── test/route.ts     # Endpoint de prueba
│   ├── admin/
│   │   └── whatsapp-bot/         # Dashboard de administración
│   ├── page.tsx                  # Página principal
│   └── layout.tsx                # Layout raíz
├── components/
│   ├── game/                     # Componentes del juego
│   ├── ui/                       # Componentes shadcn/ui
│   └── theme-provider.tsx        # Gestor de temas
├── lib/
│   ├── whatsapp-bot.ts          # Lógica del bot de WhatsApp
│   ├── database.ts              # Gestión de datos
│   └── game-types.ts            # Tipos TypeScript
├── hooks/
│   └── use-game.ts              # Hook para estado del juego
├── vercel.json                  # Configuración de Vercel
├── .env.example                 # Variables de entorno (ejemplo)
├── START_HERE.md               # ← LEE ESTO PRIMERO
├── DEPLOYMENT_CHECKLIST.md     # Checklist de despliegue
└── DEPLOYMENT_GUIDE_SPANISH.md # Guía completa en español
```

---

## 📖 Documentación Disponible

| Archivo | Descripción |
|---------|-------------|
| **START_HERE.md** | ⭐ **COMIENZA AQUÍ**: 5 pasos para tener tu bot en vivo |
| **DEPLOYMENT_CHECKLIST.md** | Checklist paso a paso con verificaciones |
| **DEPLOYMENT_GUIDE_SPANISH.md** | Guía completa y detallada en español |
| **.env.example** | Variables de entorno necesarias |

---

## 🔧 Tecnologías Usadas

### Frontend
- **Next.js 16**: Framework React con App Router
- **React 19**: Librería UI
- **Tailwind CSS**: Estilos
- **shadcn/ui**: Componentes accesibles

### Backend
- **Next.js API Routes**: Endpoints serverless
- **TypeScript**: Tipado seguro
- **Vercel Functions**: Ejecución serverless

### IA & APIs
- **Google Gemini API**: Procesamiento de lenguaje natural
- **WhatsApp Business API**: Envío/recepción de mensajes
- **Meta Graph API**: Webhook de WhatsApp

### Hosting & DevOps
- **Vercel**: Hosting, CI/CD automático
- **Git**: Control de versiones
- **GitHub/GitLab/Bitbucket**: Repositorio

---

## 🎯 Flujo del Bot

```
Usuario WhatsApp
       ↓
   Mensaje
       ↓
Webhook de Vercel (/api/whatsapp)
       ↓
   Procesar en Bot
       ↓
  Llamar Gemini IA
       ↓
  Generar Respuesta
       ↓
   Guardar en BD
       ↓
Enviar a WhatsApp
       ↓
Usuario recibe respuesta
```

---

## 🔐 Seguridad

- Variables de entorno encriptadas en Vercel
- Tokens de verificación de webhook
- HTTPS obligatorio
- Logs auditables en Vercel

---

## 📊 Monitoreo

Una vez desplegado, monitorea tu bot en:

1. **Vercel Dashboard**: https://vercel.com/dashboard
   - Logs de funciones
   - Uso de recursos
   - Despliegues

2. **Google Cloud Console**:
   - Uso de Gemini API
   - Alertas de cuota

3. **Meta Developers**:
   - Estadísticas de webhook
   - Errores de webhook

---

## 🚀 Próximos Pasos

### Inmediatamente
1. Lee **START_HERE.md**
2. Obtén credenciales de Google y Meta
3. Despliega en Vercel
4. Configura el webhook

### Después (Optimización)
1. Mejora las prompts de Gemini
2. Añade persistencia con Supabase
3. Implementa flujos de juego automáticos
4. Configura alertas y monitoreo
5. Escala a producción

---

## 🐛 Troubleshooting

### "El webhook no se verifica"
→ Verifica que `WHATSAPP_VERIFY_TOKEN` sea idéntico en Meta y Vercel

### "El bot no responde"
→ Revisa los logs en Vercel dashboard

### "Error de Gemini API"
→ Verifica que tu `GEMINI_API_KEY` sea válida

---

## 📞 Soporte

- **Documentación Oficial**: 
  - WhatsApp: https://developers.facebook.com/docs/whatsapp
  - Vercel: https://vercel.com/docs
  - Gemini: https://ai.google.dev

- **Archivos de Ayuda**:
  - START_HERE.md (guía rápida)
  - DEPLOYMENT_GUIDE_SPANISH.md (guía completa)
  - DEPLOYMENT_CHECKLIST.md (verificaciones)

---

## 📄 Licencia

Este proyecto está disponible bajo licencia MIT.

---

## 🎉 ¡Listo!

Tu bot de "Monopolio de Ventas" está casi listo para conquistar WhatsApp.

**Siguiente paso: [Abre START_HERE.md →](./START_HERE.md)**
