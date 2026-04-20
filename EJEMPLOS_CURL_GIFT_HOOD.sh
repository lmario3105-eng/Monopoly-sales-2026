#!/bin/bash

# Ejemplos de cURL para probar Gift Hood APIs
# Reemplaza https://tu-app.vercel.app con tu dominio real

APP_URL="https://tu-app.vercel.app"

echo "════════════════════════════════════════════════════════════"
echo "     EJEMPLOS DE CURL PARA PROBAR GIFT HOOD APIS"
echo "════════════════════════════════════════════════════════════"
echo ""

# ============================================================
# 1. VERIFICAR ESTADO DE GEMINI
# ============================================================
echo "1️⃣  VERIFICAR ESTADO DE GEMINI"
echo "───────────────────────────────"
echo "Comando:"
echo "curl -X GET \"$APP_URL/api/keys?service=gemini\""
echo ""
echo "Respuesta esperada:"
echo '{
  "service": "gemini",
  "isConfigured": true,
  "status": "active",
  "lastChecked": "2026-04-20T..."
}'
echo ""
echo ""

# ============================================================
# 2. VERIFICAR ESTADO DE JIMMY NIGHT
# ============================================================
echo "2️⃣  VERIFICAR ESTADO DE JIMMY NIGHT"
echo "────────────────────────────────────"
echo "Comando:"
echo "curl -X GET \"$APP_URL/api/keys?service=jimmy-night\""
echo ""
echo "Respuesta esperada:"
echo '{
  "service": "jimmy-night",
  "isConfigured": true,
  "status": "active",
  "lastChecked": "2026-04-20T..."
}'
echo ""
echo ""

# ============================================================
# 3. OBTENER INSTRUCCIONES DE CONFIGURACIÓN
# ============================================================
echo "3️⃣  OBTENER INSTRUCCIONES DE SETUP"
echo "──────────────────────────────────"
echo "Comando:"
echo 'curl -X POST "$APP_URL/api/keys" \\'
echo '  -H "Content-Type: application/json" \\'
echo '  -d "{\"action\": \"get-instructions\"}"'
echo ""
echo "Respuesta: Incluye pasos para configurar ambas claves"
echo ""
echo ""

# ============================================================
# 4. VERIFICAR ESTADO DE JIMMY NIGHT
# ============================================================
echo "4️⃣  VERIFICAR CONEXIÓN CON JIMMY NIGHT"
echo "──────────────────────────────────────"
echo "Comando:"
echo "curl -X GET \"$APP_URL/api/jimmy-night\""
echo ""
echo "Respuesta esperada:"
echo '{
  "success": true,
  "message": "Jimmy Night está configurado",
  "service": "jimmy-night",
  "timestamp": "2026-04-20T...",
  "data": {
    "isConfigured": true,
    "status": "ready",
    "apiKeyExists": true
  }
}'
echo ""
echo ""

# ============================================================
# 5. TEST DE CONEXIÓN CON JIMMY NIGHT
# ============================================================
echo "5️⃣  TEST DE CONEXIÓN CON JIMMY NIGHT"
echo "────────────────────────────────────"
echo "Comando:"
echo 'curl -X POST "$APP_URL/api/jimmy-night" \\'
echo '  -H "Content-Type: application/json" \\'
echo '  -d "{\"action\": \"test\"}"'
echo ""
echo "Respuesta esperada:"
echo '{
  "success": true,
  "message": "Jimmy Night API conectado exitosamente",
  "service": "jimmy-night",
  "timestamp": "2026-04-20T...",
  "data": {
    "connectionStatus": "active",
    "apiKeyLength": 32,
    "endpoint": "https://api.jimmynight.dev/v1"
  }
}'
echo ""
echo ""

# ============================================================
# 6. OBTENER BALANCE DE USUARIO
# ============================================================
echo "6️⃣  OBTENER BALANCE DE USUARIO"
echo "─────────────────────────────"
echo "Comando:"
echo 'curl -X POST "$APP_URL/api/jimmy-night" \\'
echo '  -H "Content-Type: application/json" \\'
echo '  -d "{
    \"action\": \"get-balance\",
    \"userId\": \"user123\"
  }"'
echo ""
echo "Respuesta esperada:"
echo '{
  "success": true,
  "message": "Balance obtenido para usuario user123",
  "service": "jimmy-night",
  "timestamp": "2026-04-20T...",
  "data": {
    "userId": "user123",
    "balance": 5234,
    "currency": "JN-Points",
    "lastUpdated": "2026-04-20T..."
  }
}'
echo ""
echo ""

# ============================================================
# 7. PROCESAR RECOMPENSA
# ============================================================
echo "7️⃣  PROCESAR RECOMPENSA (REGALO)"
echo "───────────────────────────────"
echo "Comando:"
echo 'curl -X POST "$APP_URL/api/jimmy-night" \\'
echo '  -H "Content-Type: application/json" \\'
echo '  -d "{
    \"action\": \"process-reward\",
    \"userId\": \"user123\",
    \"amount\": 500,
    \"reason\": \"Regalo de amigo\"
  }"'
echo ""
echo "Respuesta esperada:"
echo '{
  "success": true,
  "message": "Recompensa de 500 puntos otorgada a usuario user123",
  "service": "jimmy-night",
  "timestamp": "2026-04-20T...",
  "data": {
    "transactionId": "JN-1713607234567",
    "userId": "user123",
    "amount": 500,
    "reason": "Regalo de amigo",
    "status": "completed",
    "timestamp": "2026-04-20T..."
  }
}'
echo ""
echo ""

# ============================================================
# 8. ENVIAR REGALO (GIFT HOOD)
# ============================================================
echo "8️⃣  ENVIAR REGALO (GIFT HOOD)"
echo "──────────────────────────────"
echo "Comando:"
echo 'curl -X POST "$APP_URL/api/gift-hood/send" \\'
echo '  -H "Content-Type: application/json" \\'
echo '  -d "{
    \"fromUserId\": \"user1\",
    \"toUserId\": \"user2\",
    \"amount\": 250,
    \"message\": \"¡Buen trabajo en ventas!\"
  }"'
echo ""
echo "Respuesta esperada:"
echo '{
  "success": true,
  "message": "Regalo enviado exitosamente",
  "data": {
    "giftId": "gift-123456",
    "from": "user1",
    "to": "user2",
    "amount": 250,
    "customMessage": "¡Buen trabajo en ventas!",
    "aiMessage": "[Mensaje personalizado por Gemini AI]",
    "timestamp": "2026-04-20T..."
  }
}'
echo ""
echo ""

# ============================================================
# RESUMEN
# ============================================================
echo "════════════════════════════════════════════════════════════"
echo "                    RESUMEN DE PRUEBAS"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "✓ Todos los endpoints están documentados arriba"
echo "✓ Reemplaza https://tu-app.vercel.app con tu dominio"
echo "✓ Todos usan Content-Type: application/json"
echo ""
echo "Para probar rápidamente:"
echo "  1. Copia un comando"
echo "  2. Pégalo en tu terminal"
echo "  3. Presiona Enter"
echo "  4. Verifica la respuesta"
echo ""
echo "════════════════════════════════════════════════════════════"
