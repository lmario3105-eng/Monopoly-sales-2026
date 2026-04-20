# 📝 EJEMPLOS DE INTERACCIÓN CON EL BOT

## Flujo de Ejemplo: Primer Mensaje

### Usuario envía en WhatsApp:
```
Usuario: Hola bot, ¿cómo juego?
```

### El bot procesa:
1. Recibe mensaje en webhook (`/api/whatsapp`)
2. Extrae: teléfono, nombre, texto
3. Llama a Gemini IA con contexto del juego
4. Genera respuesta personalizada
5. Guarda en base de datos
6. Envía respuesta a WhatsApp

### Bot responde:
```
Bot: ¡Hola Usuario! 👋

Bienvenido a Monopolio de Ventas. El juego es una 
simulación de actividades comerciales donde:

🎯 Objetivo: Ser el vendedor con más puntos
💰 Acciones: Vender, Reclutar, Negociar
📊 Puntos: Por cada venta exitosa

¿Deseas empezar tu turno? Escribe: "Iniciar turno"
```

---

## Interacciones Típicas

### 1. Solicitar Ayuda
```
Usuario: ¿Cuáles son las reglas?

Bot: 📋 REGLAS DEL JUEGO
• 2-4 equipos de vendedores
• Turnos rotativos cada 30 segundos
• Gana puntos por:
  - Venta: +10 puntos
  - Reclutamiento: +5 puntos
  - Negociación exitosa: +8 puntos
• Pierde puntos por:
  - Rechazo: -2 puntos
  - Falta de turno: -1 punto

¿Necesitas más información? Escribe:
- "reglas" - Ver todas las reglas
- "puntuación" - Ver tu puntuación actual
- "ayuda" - Ver comandos disponibles
```

### 2. Ver Estado del Juego
```
Usuario: ¿Cuál es mi puntuación?

Bot: 📊 TU ESTADO ACTUAL

Nombre: Usuario
Equipo: León (Rojo)
Puntos: 45
Reclutas: 3
Rango: 🥈 Segundo lugar

🏆 Clasificación:
1. Otro Jugador - 68 pts
2. Tú - 45 pts
3. Otro Jugador - 32 pts

Siguiente turno en: 15 segundos
```

### 3. Realizar una Acción
```
Usuario: Vender producto

Bot: 💼 VENTA EN PROGRESO

Producto: Servicio Premium
Valor: $500
Cliente Potencial: Empresa XYZ

¿Qué estrategia usas?
A) Presentación Ejecutiva (+10 pts)
B) Demostración de Producto (+8 pts)
C) Descuento Especial (+6 pts)

Responde con: A, B o C
```

### 4. Comandos de Ayuda
```
Usuario: ayuda

Bot: 🤖 COMANDOS DISPONIBLES

📖 INFORMACIÓN:
• reglas - Ver reglas del juego
• ayuda - Este mensaje
• puntuación - Tu puntuación actual
• ranking - Ranking de todos los equipos

🎮 JUEGO:
• iniciar turno - Comienza tu turno
• vender - Realizar una venta
• reclutar - Reclutar nuevo vendedor
• negociar - Iniciar negociación

⚙️ CONFIGURACIÓN:
• equipo - Ver tu equipo actual
• perfil - Ver tu perfil
• historial - Ver historial de acciones

Escribe cualquier comando para continuar.
```

---

## Ejemplo Completo de Sesión

### Minuto 1:
```
Usuario: Hola
Bot: ¡Bienvenido a Monopolio de Ventas! 🎮
¿Es tu primera vez? Escribe "reglas" o "iniciar turno"
```

### Minuto 2:
```
Usuario: iniciar turno
Bot: ⏱️ TU TURNO HA COMENZADO (30 segundos)

Acciones disponibles:
1. Vender (escribe "vender")
2. Reclutar (escribe "reclutar")
3. Negociar (escribe "negociar")

¿Qué deseas hacer?
```

### Minuto 3:
```
Usuario: vender
Bot: 💼 VENTA INICIADA

Cliente: MercadoLibre
Producto: Suite de Marketing
Valor: $1,200

¿Cómo enfocas la venta?
A) Por ROI (Retorno de Inversión)
B) Por Escalabilidad
C) Por Costo-Beneficio

Responde: A, B o C
```

### Minuto 4:
```
Usuario: A
Bot: ✅ VENTA EXITOSA

Presentaste el ROI esperado (350% en 6 meses).
Cliente convencido.

+10 puntos 🎯
Tu puntuación: 55 pts

Turno finalizado. Siguiente turno en: 25 seg
```

---

## Respuestas del Bot según Contexto

### Contexto de Bienvenida
El bot detecta si es un nuevo usuario:
```
Usuario: Hola
Bot: ¡Bienvenido a Monopolio de Ventas! 👋

Veo que es tu primera vez. Te daré un tour rápido...
```

### Contexto de Urgencia
Si el usuario no actúa en su turno:
```
Bot: ⏰ RECORDATORIO: Tu turno termina en 5 segundos
¡Rápido! Escribe: vender, reclutar o negociar
```

### Contexto de Error
Si el usuario envía un comando inválido:
```
Usuario: xyz123
Bot: No entiendo "xyz123".

Comandos válidos:
• vender
• reclutar
• negociar
• ayuda

¿Qué deseas hacer?
```

---

## Estadísticas del Bot

Después de varias interacciones, el bot puede mostrar:

```
Bot: 📈 TUS ESTADÍSTICAS

Sesiones: 5
Tiempo jugado: 2h 34m
Total de ventas: 12
Tasa de éxito: 85%
Promedio por venta: $650

🏅 Logros:
• Primer vendedor 🥇
• Cerrador de 10 ventas ✅
• Reclutador de 5 personas ✅

¡Excelente desempeño! 🌟
```

---

## Manejo de Errores Amigable

### Error de Conexión
```
Usuario: vender
Bot: ⚠️ Parece que hay un problema momentáneo.
Reintentando...

Si el problema persiste, escribe: soporte
```

### Error de Límite de API
```
Bot: Demasiadas solicitudes. 
Por favor, espera 5 segundos antes de tu siguiente acción.
```

### Sesión Expirada
```
Bot: Tu sesión ha expirado por inactividad.

¿Deseas comenzar una nueva sesión?
Escribe: "continuar" o "salir"
```

---

## Flujo Conversacional Típico

```
1. Usuario envía mensaje inicial
   ↓
2. Bot detecta contexto (nuevo usuario, comando, etc)
   ↓
3. Bot procesa con Gemini IA si es conversación libre
   ↓
4. Bot genera respuesta contextual y amigable
   ↓
5. Bot guarda estado en base de datos
   ↓
6. Usuario recibe respuesta en WhatsApp
   ↓
7. Usuario interactúa nuevamente (ciclo)
```

---

## Personalización de Respuestas

El bot puede ser personalizado para:

### Diferentes Equipos
```
Usuario del Equipo León: (Respuestas en rojo/león)
Usuario del Equipo Águila: (Respuestas en azul/águila)
Usuario del Equipo Serpiente: (Respuestas en verde/serpiente)
Usuario del Equipo Tigre: (Respuestas en naranja/tigre)
```

### Diferentes Momentos
```
Hora Peak (8-10am): Respuestas rápidas y concisas
Hora Normal: Respuestas completas
Noche (9pm+): Recordatorios de cierre
```

### Diferentes Niveles
```
Novato: Mucha ayuda y tutoriales
Intermedio: Menos ayuda, más desafíos
Experto: Solo datos, sin tutoriales
```

---

## Próximas Mejoras

Una vez que el bot esté en producción, puedes:

1. **Historial de Conversaciones**: Guardar todos los chats para análisis
2. **Análisis de Sentimiento**: Detectar frustración y ofrecer ayuda
3. **Gamificación Avanzada**: Badges, leaderboards en tiempo real
4. **Integración de CRM**: Conectar con sistemas de ventas reales
5. **Notificaciones Proactivas**: Recordatorios automáticos de turnos
6. **Análisis Predictivo**: Sugerir próximas acciones

---

**Estos son ejemplos de cómo tu bot interactuará con los usuarios.** ✨

Una vez desplegado, los usuarios verán respuestas similares directamente en WhatsApp.
