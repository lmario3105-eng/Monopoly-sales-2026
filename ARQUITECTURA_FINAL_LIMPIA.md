# ARQUITECTURA FINAL - BOT + JUEGO SEPARADOS

## Estructura Implementada

### 1. RUTAS PRINCIPALES
- **`/` (page.tsx)** → Juego Monopolio 100% funcional
- **`/chat` (chat/page.tsx)** → Chat independiente con IA
- **`/reglas`** → Documentación (ya existía)
- **`/promo`** → Promociones (ya existía)

### 2. APIs SEPARADAS

#### Chat API (Simplificada)
- **Ruta:** `/api/chat-simple`
- **Método:** POST
- **Función:** Procesa mensajes con 7 comandos + Gemini AI
- **Sin dependencias complejas:** Usa solo GoogleGenerativeAI + Next.js

Comandos:
```
/help     - Ayuda
/stats    - Estadísticas
/top      - Top vendedores
/teams    - Equipos
/status   - Estado del sistema
/commands - Alias de help
```

#### Otros APIs (Existentes)
- `/api/keys` - Gestión de API keys
- `/api/jimmy-night` - Integración Jimmy Night
- `/api/bot/webhook` - Webhook para WhatsApp (opcional)
- `/api/gift-hood/send` - Sistema de regalos

### 3. COMPONENTES DEL JUEGO (Independientes)
- Board.tsx
- TeamPanel.tsx
- Header.tsx
- ActivityFeed.tsx
- GameControls.tsx
- WelcomeModal.tsx
- FinalResults.tsx
- WhatsAppSync.tsx
- AdminPanel.tsx
- StatsModal.tsx
- WhatsAppStatus.tsx

### 4. COMPONENTES DEL CHAT (Independientes)
- chat/ChatMessage.tsx
- chat/ChatWidget.tsx (NO usado en /chat, solo como referencia)

### 5. LIBRERÍAS COMPARTIDAS
- `lib/bot-commands.ts` - Definición de comandos
- `lib/bot-integration.ts` - Integración con IA (cuando sea necesaria)
- `lib/game-types.ts` - Tipos del juego
- `lib/game-utils.ts` - Utilidades del juego

## FLUJO DE OPERACIÓN

### Cuando el usuario va a `/`
1. Carga WelcomeModal
2. Usuario inicia juego
3. Se muestra Board, TeamPanel, GameControls
4. Botón "Abrir Chat" → Redirige a `/chat`
5. No hay ChatWidget flotante (REMOVIDO el conflicto)

### Cuando el usuario va a `/chat`
1. Carga página dedicada al chat
2. Muestra conversación histórica
3. Acepta mensajes del usuario
4. Llama a `/api/chat-simple` para procesar
5. Devuelve respuesta con comandos o IA
6. Usuario puede volver a `/` con el botón de atrás

## VENTAJAS DE ESTA ARQUITECTURA

✅ **Separación de responsabilidades** - Juego y Chat no interfieren
✅ **Sin conflictos de estado** - Cada página gestiona su propio estado
✅ **APIs simplificadas** - Menos dependencias, menos errores
✅ **Escalable** - Fácil agregar más rutas/APIs
✅ **Mantenible** - Cada componente tiene un propósito claro
✅ **Performance** - No hay cargas innecesarias de componentes

## VARIABLES DE ENTORNO REQUERIDAS

```
GEMINI_API_KEY=tu_clave_aqui
JIMMY_NIGHT_API_KEY=tu_clave_aqui (opcional)
```

## TESTING

### Test del Juego
1. Ve a `/`
2. Verifica que carga la bienvenida
3. Inicia juego
4. Prueba tablero, equipo, controles
5. Abre chat desde botón

### Test del Chat
1. Ve a `/chat`
2. Escribe `/help` → debe mostrar comandos
3. Escribe `/stats` → debe mostrar estadísticas
4. Escribe pregunta natural → debe responder con Gemini AI
5. Vuelve a `/` con botón atrás

## PRÓXIMOS PASOS

1. Agregar WhatsApp webhook en `/api/bot/webhook` para recibir mensajes
2. Implementar Gift Hood en endpoint separado
3. Agregar base de datos para persistencia
4. Agregar autenticación si es necesario
