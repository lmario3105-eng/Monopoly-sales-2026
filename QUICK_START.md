# Inicio Rápido - Monopolio de Ventas

## 🎮 Acceso a la Plataforma

```
URL: https://monopolio-ventas.vercel.app
```

## 👤 Tipos de Usuario

### Jugador
- Registra ventas desde WhatsApp
- Ve su estado y puntos
- Compite en ranking

### Administrador
- Accede a panel de admin
- Ve estadísticas globales
- Envía mensajes a todos
- Gestiona el programa

---

## 📱 Usar el Bot de WhatsApp

### Opción 1: Números de Demostración

**Admin (Ya registrado):**
```
Teléfono: +573001234567
```

**Jugador (Ya registrado):**
```
Teléfono: +573007654321
```

### Opción 2: Nuevos Usuarios

Simplemente envía tu primer mensaje al bot y se registra automáticamente.

---

## 🎯 Comandos Básicos

### Registrar una Venta

```
registrar venta vape 150
```

**Respuesta:**
```
✅ Venta sincronizada: 150 pts en vape
📊 Total: 1,650 puntos
```

### Ver tu Estado

```
mi estado
```

**Respuesta:**
```
📊 TU ESTADO - Monopolio de Ventas

👤 Nombre: Juan Vendedor
🗺️ Zona: A
⭐ Tus Puntos: 1,650
📈 Posición en Zona: #1 de 3
👥 Reclutas: 2
⏰ Último acceso: 20/04/2026
```

### Ver Ranking

```
tabla de posiciones
```

**Respuesta:**
```
🏆 TABLA DE POSICIONES

🗺️ ZONA A: 5,000 pts
  🥇 Juan: 1,650 pts
  🥈 María: 1,200 pts

[Similar para Zonas B, C, D]

👑 TOP GLOBAL:
🥇 Juan - Zona A: 1,650 pts
🥈 María - Zona B: 1,200 pts
...
```

### Obtener Enlace de Invitación

```
invitar miembros
```

### Ver Ayuda

```
ayuda
```

---

## 👨‍💼 Panel de Administrador

### Ubicación
En la página web, debajo del **Header**, existe una sección **"Panel de Administración"** (solo visible si eres admin).

### Función 1: Ver Estadísticas
- **Usuarios Totales:** Cuántas personas están registradas
- **Conectados a WhatsApp:** Cuántos tienen activo el bot
- **Puntos por Zona:** Ranking de zonas (A, B, C, D)
- **Notificaciones Pendientes:** Cuántas están por enviar

### Función 2: Enviar Mensaje a Todos

1. Click en **"Enviar Mensaje a Todos"**
2. Escribe tu mensaje
3. Click en **"Enviar"**
4. Todos los usuarios reciben notificación en WhatsApp

---

## 🔄 Cómo Funciona la Sincronización

### Flujo 1: Venta desde WhatsApp → Web

```
Usuario (WhatsApp)
  ↓
"registrar venta vape 100"
  ↓
Bot procesa
  ↓
Base de datos actualiza
  ↓
Web se actualiza automáticamente
  ↓
Usuario recibe confirmación
```

**Tiempo:** ~1-2 segundos

### Flujo 2: Mensaje Admin Web → WhatsApp

```
Admin (Página Web)
  ↓
Click "Enviar Mensaje a Todos"
  ↓
Escribe mensaje
  ↓
Click "Enviar"
  ↓
Notificaciones creadas en BD
  ↓
Usuarios reciben en WhatsApp
```

**Tiempo:** ~2-3 segundos

---

## 🎲 Cómo Jugar

### 1. Accede a la Página
- URL: https://monopolio-ventas.vercel.app
- Lee las instrucciones del modal
- Click "ENTENDIDO Y ACEPTO"

### 2. Ve el Tablero
- **Tablero:** Mapa de Montería con 4 zonas (A, B, C, D)
- **Fichas:** Representan a cada grupo zonal
- **Casillas:** Oportunidades de venta por categoría

### 3. Realiza Movimientos
- **Web:** Click "¡LANZAR!" para mover tu ficha
- **WhatsApp:** Comando `registrar venta` suma puntos
- Ambos están sincronizados

### 4. Acumula Puntos
- Cae en casilla = gana puntos
- Categoría especial = +20% bonus
- 30 días para acumular máx puntos

### 5. Gana Recompensa
- Mayor puntaje en tu zona
- Top 2 vendedores globales
- Bonus por reclutar miembros

---

## 💰 Sistema de Puntos

| Acción | Puntos | Bonus |
|--------|--------|-------|
| Venta normal | +50 a +150 | - |
| Categoría especial | +100 a +200 | +20% |
| Comodín | 0 | Sorpresa |
| Recompensa | 0 | +300 puntos |
| Evento | Variable | Variable |
| Por cada recluta | - | +100 pts |
| 5 reclutas | - | +500 pts |
| 10 reclutas (zona completa) | - | +1000 pts |

---

## 🏆 Gana la Competencia

### Meta 1: Ser el Mejor de tu Zona
```
Acumula máx puntos durante 30 días
Recompensa: Bonificación premium
```

### Meta 2: Top 2 Vendedores Globales
```
Máximos puntos sin importar zona
Recompensa: Reconocimiento + Bonus
```

### Meta 3: Completa tu Zona (10 miembros)
```
Invita 10 compañeros a tu zona
Recompensa: +1000 puntos + Comodín Dorado
```

### Meta 4: Sé el Primer Grupo Completo
```
Tu grupo completa 10 miembros antes que otros
Recompensa: TRIPLE BONUS ACELERADO
```

---

## 🐛 Solución de Problemas

### "No recibo respuesta en WhatsApp"
1. Verifica que el número está registrado (+57...)
2. Envía "ayuda" para confirmar conexión
3. Espera 2-3 segundos

### "Mis puntos no aparecen en la web"
1. Recarga la página (F5)
2. Espera 5 segundos
3. Verifica que el comando fue procesado

### "No aparezco en el ranking"
1. Registra tu primera venta: "registrar venta vape 100"
2. Recarga página: https://monopolio-ventas.vercel.app
3. Busca tu nombre en "tabla de posiciones"

### "¿Cómo cambio de zona?"
1. Contacta al administrador
2. Proporciona tu nombre y teléfono
3. Admin actualiza desde Panel

### "Tengo preguntas sobre las reglas"
1. Envía "ayuda" en WhatsApp
2. Lee el modal de bienvenida (abre en navegador)
3. Contacta al soporte

---

## 📊 Dashboard de Datos

### Abierto a Todos (URL Pública)

```
https://monopolio-ventas.vercel.app/api/whatsapp
```

Muestra:
- Total de usuarios registrados
- Usuarios conectados a WhatsApp
- Notificaciones pendientes
- Últimas acciones

### Uso: Para verificar que el sistema funciona

---

## ⏱️ Duración del Programa

- **Inicio:** [FECHA INICIO]
- **Duración:** 30 días
- **Cierre:** [FECHA FIN]
- **Resultados:** Automático al día 30

Cada 5 segundos reales = 1 minuto de juego
Cada 30 minutos reales = 1 día de juego

---

## 💡 Tips para Ganar

### 1. Registra Ventas Constantemente
- Cada venta suma puntos
- Máximo 1000 puntos por venta
- Bonus +20% en tu especialidad

### 2. Invita Miembros
- Cada recluta = +100 puntos
- 5 reclutas = +500 puntos
- 10 reclutas = +1000 puntos

### 3. Coordina con tu Zona
- Todos venden = zona gana
- Zona gana = tú ganas

### 4. Usa los Comodines
- Obtienes en casillas especiales
- Guardalos para momentos clave
- Pueden cambiar el juego

### 5. Entiende el Ranking
- Solo importan los últimos 30 días
- Se actualiza en tiempo real
- Ve tabla de posiciones frecuentemente

---

## 📞 Contacto y Soporte

### Preguntas Generales
```
Envía "ayuda" en WhatsApp
```

### Problemas Técnicos
```
Contacta al administrador del programa
```

### Reportar Error
```
Envía detalles a: support@monopolio-ventas.com
```

---

**¡Bienvenido a Monopolio de Ventas!**

**Recuerda:** Esto no es un juego, es tu herramienta real de gestión comercial.

*Última actualización: 20 de Abril, 2026*
