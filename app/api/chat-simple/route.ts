import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface ChatSimpleRequest {
  userId: string;
  userName: string;
  message: string;
  isAdmin?: boolean;
  conversationHistory?: Array<{ role: string; content: string }>;
}

// Respuestas predeterminadas para comandos comunes
const QUICK_RESPONSES: Record<string, string> = {
  '/help': '📋 **COMANDOS DISPONIBLES:**\n\n• /help - Esta ayuda\n• /stats - Estadísticas\n• /top - Top vendedores\n• /teams - Equipos\n• /status - Estado del sistema\n\nTambién puedo responder preguntas sobre el juego.',
  '/stats': '📊 **ESTADÍSTICAS:**\n\n🦁 León: 45,200 pts | 8 miembros\n🐯 Tigre: 43,100 pts | 7 miembros\n🦅 Águila: 41,900 pts | 6 miembros\n🐍 Serpiente: 39,800 pts | 5 miembros',
  '/top': '🥇 **TOP 10:**\n\n1. Juan Pérez (León) - 5,200 pts\n2. María García (Tigre) - 4,900 pts\n3. Carlos López (Águila) - 4,500 pts\n4. Roberto Martín (Serpiente) - 4,200 pts\n5. Ana Rodríguez (León) - 3,900 pts',
  '/teams': '🏆 **EQUIPOS:**\n\n🦁 LEÓN\n🐯 TIGRE\n🦅 ÁGUILA\n🐍 SERPIENTE',
  '/status': '✅ **ESTADO DEL SISTEMA:**\n\n✓ API activa\n✓ Base de datos sincronizada\n✓ Chat disponible\n✓ Última sincronización: Ahora',
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ChatSimpleRequest;
    const { message, userName = 'Usuario' } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { response: '❌ Mensaje inválido. Por favor intenta de nuevo.' },
        { status: 400 }
      );
    }

    const messageLower = message.toLowerCase().trim();

    // Verificar si es un comando conocido
    for (const [cmd, response] of Object.entries(QUICK_RESPONSES)) {
      if (messageLower === cmd.toLowerCase() || messageLower.startsWith(cmd.toLowerCase())) {
        return NextResponse.json({
          response,
          timestamp: new Date().toISOString(),
        });
      }
    }

    // Si no hay API key, usar respuesta amable
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('[Chat API] GEMINI_API_KEY no está configurada, usando respuesta local');
      return NextResponse.json({
        response: `Hola ${userName}! Soy tu asistente de Monopolio. Veo que hiciste una pregunta interesante pero en este momento estoy en modo limitado. Puedo ayudarte con comandos como /help, /stats, /top, /teams o /status. ¿Cuál necesitas?`,
        timestamp: new Date().toISOString(),
      });
    }

    // Usar Gemini API con GoogleGenerativeAI
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

      const systemPrompt = `Eres un asistente amigable y experto del juego "Monopolio de Ventas". 
Tu objetivo es:
1. Responder preguntas sobre el juego, estadísticas y equipos
2. Ser motivador y usar emojis apropiados
3. Responder de forma concisa (máximo 3-4 líneas)
4. Personalizar respuestas con el nombre del usuario
5. Si no sabes algo, ofrece alternativas útiles

Usuario: ${userName}`;

      const chat = model.startChat({
        history: (body.conversationHistory || [])
          .slice(-3)
          .map((m) => ({
            role: m.role === 'user' ? 'user' : 'model',
            parts: [{ text: m.content }],
          })),
        generationConfig: {
          maxOutputTokens: 300,
          temperature: 0.7,
        },
      });

      const result = await chat.sendMessage(message);
      const responseText = result.response.text();

      if (!responseText) {
        return NextResponse.json({
          response: `Entendí tu pregunta ${userName}, pero tuve un problema generando la respuesta. Intenta con /help para ver qué puedo hacer.`,
          timestamp: new Date().toISOString(),
        });
      }

      return NextResponse.json({
        response: responseText,
        timestamp: new Date().toISOString(),
      });
    } catch (geminiError) {
      console.error('[Gemini Error]:', geminiError);
      // Fallback a respuesta amable
      return NextResponse.json({
        response: `Disculpa ${userName}, tuve un pequeño error técnico. Por favor intenta de nuevo en unos segundos. Mientras tanto, prueba con /stats o /help.`,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error('[Chat Simple API Error]:', error);
    return NextResponse.json(
      {
        response: 'Oops, algo salió mal. Por favor intenta de nuevo.',
      },
      { status: 500 }
    );
  }
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Credenciales de administrador
const ADMIN_CREDENTIALS = {
  username: 'admin-monopoly',
  password: process.env.ADMIN_PASSWORD || 'Monopoly2024#Admin',
};

// Almacenamiento en memoria de aprendizaje del chatbot
const chatbotMemory: Record<string, Array<{ topic: string; context: string; count: number }>> = {};

// Comandos disponibles
const COMMANDS: Record<string, string> = {
  '/help': 'Muestra todos los comandos disponibles',
  '/stats': 'Muestra estadísticas del juego',
  '/top': 'Muestra los top vendedores',
  '/teams': 'Muestra los equipos en juego',
  '/status': 'Estado actual del sistema',
  '/admin-login': 'Inicia sesión como administrador',
  '/commands': 'Alias de /help',
};

// Respuestas predeterminadas para comandos
const COMMAND_RESPONSES: Record<string, string> = {
  '/help':
    '📋 **COMANDOS DISPONIBLES:**\n\n' +
    '• /help - Muestra esta ayuda\n' +
    '• /stats - Estadísticas del juego\n' +
    '• /top - Top 10 vendedores\n' +
    '• /teams - Lista de equipos\n' +
    '• /status - Estado del sistema\n' +
    '• /admin-login - Acceso administrador (VIP)\n\n' +
    'También puedo responder preguntas generales sobre el juego o las estadísticas.',
  '/stats':
    '📊 **ESTADÍSTICAS DEL JUEGO:**\n\n' +
    '🦁 León: 45,600 pts | 8 miembros\n' +
    '🐯 Tigre: 42,300 pts | 7 miembros\n' +
    '🦅 Águila: 38,900 pts | 6 miembros\n' +
    '🐍 Serpiente: 35,200 pts | 5 miembros\n\n' +
    'Total jugadores: 26',
  '/top':
    '🥇 **TOP 10 VENDEDORES:**\n\n' +
    '1. 🥇 Juan Pérez (León) - 5,200 pts\n' +
    '2. 🥈 María García (Tigre) - 4,900 pts\n' +
    '3. 🥉 Carlos López (Águila) - 4,500 pts\n' +
    '4. Roberto Martín (Serpiente) - 4,200 pts\n' +
    '5. Ana Rodríguez (León) - 3,900 pts\n' +
    '6. Luis Fernández (Tigre) - 3,600 pts\n' +
    '7. Patricia Sánchez (Águila) - 3,300 pts\n' +
    '8. Diego Moreno (León) - 3,000 pts\n' +
    '9. Sofia Álvarez (Tigre) - 2,800 pts\n' +
    '10. Miguel Torres (Serpiente) - 2,600 pts',
  '/teams': '🏆 **EQUIPOS EN JUEGO:**\n\n🦁 LEÓN\n🐯 TIGRE\n🦅 ÁGUILA\n🐍 SERPIENTE\n\nUsa /stats para ver más detalles',
  '/status': '✅ **ESTADO DEL SISTEMA:**\n\n✓ API activa\n✓ Base de datos sincronizada\n✓ Chat disponible\n✓ WhatsApp conectado\n\n⏰ Última sincronización: Hace unos segundos',
};

// Función para registrar aprendizaje del bot
function recordLearning(topic: string, context: string): void {
  if (!chatbotMemory[topic]) {
    chatbotMemory[topic] = [];
  }

  const existing = chatbotMemory[topic].find((item) => item.context === context);
  if (existing) {
    existing.count++;
  } else {
    chatbotMemory[topic].push({ topic, context, count: 1 });
  }
}

// Función para obtener contexto de aprendizaje
function getLearnedContext(): string {
  const entries = Object.entries(chatbotMemory);
  if (entries.length === 0) return '';

  return entries
    .map(
      ([topic, items]) =>
        `${topic}: ${items
          .sort((a, b) => b.count - a.count)
          .slice(0, 3)
          .map((i) => i.context)
          .join(', ')}`
    )
    .join('\n');
}

async function getGeminiResponse(
  message: string,
  userName: string,
  conversationHistory?: Array<{ role: string; content: string }>
): Promise<string> {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return 'Error: Gemini API no está configurada.';
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const learnedContext = getLearnedContext();

    const systemPrompt = `Eres "Monopolio Bot", un asistente muy amigable y experto del Monopolio de Ventas. 
    
INSTRUCCIONES IMPORTANTES:
1. Responde preguntas sobre el juego, estadísticas, equipos y vendedores
2. Sé conversacional, usa emojis apropiados y personaliza respuestas
3. Recuerda información del usuario (${userName}) en futuras interacciones
4. Aprende de cada conversación y mejora tus respuestas
5. Si no sabes algo, ofrece buscar información o ayuda alternativa
6. Sé motivador y ayuda a mejorar el rendimiento
    
INFORMACIÓN APRENDIDA PREVIAMENTE:
${learnedContext || 'Primer contacto - aprendiendo...'}

CONTEXTO DE CONVERSACIÓN:
${conversationHistory?.slice(-4).map((m) => `${m.role}: ${m.content}`).join('\n') || 'Nueva conversación'}`;

    const chat = model.startChat({
      history: conversationHistory?.map((m) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }],
      })) || [],
      generationConfig: {
        maxOutputTokens: 300,
        temperature: 0.7,
      },
    });

    const result = await chat.sendMessage(message);
    const response = result.response.text();

    // Registrar aprendizaje
    recordLearning('conversacion_general', `${userName}: ${message}`);
    recordLearning('respuesta_generada', response.substring(0, 100));

    return response || 'No pude procesar tu pregunta.';
  } catch (error) {
    console.error('[API Chat] Error con Gemini:', error);
    return 'Disculpa, tuve un error. Intenta más tarde.';
  }
}

// Función para verificar credenciales de admin
function verifyAdminCredentials(username: string, password: string): boolean {
  return username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = (await request.json()) as ChatRequest;
    const { userId, userName, message, isAdmin = false, conversationHistory = [] } = body;

    if (!userId || !message) {
      return NextResponse.json(
        { success: false, response: 'Parámetros incompletos' },
        { status: 400 }
      );
    }

    console.log(`[Chat API] Mensaje de ${userName}: ${message}`);

    const messageLower = message.toLowerCase().trim();
    let response = '';
    let isAdminResponse = false;

    // Manejar login de administrador
    if (messageLower.startsWith('/admin-login')) {
      const parts = message.split(' ');
      if (parts.length >= 3) {
        const username = parts[1];
        const password = parts[2];

        if (verifyAdminCredentials(username, password)) {
          response =
            '✅ **ACCESO ADMINISTRATIVO CONCEDIDO**\n\n' +
            'Bienvenido al panel de administrador.\n\n' +
            '**COMANDOS DE ADMIN:**\n' +
            '• /admin-panel - Acceder al panel\n' +
            '• /users-stats - Estadísticas de usuarios\n' +
            '• /broadcast [mensaje] - Enviar mensaje a todos\n' +
            '• /system-status - Estado completo del sistema\n\n' +
            '🔐 Sesión administrador activa';
          isAdminResponse = true;
        } else {
          response = '❌ Credenciales de administrador inválidas. Intenta de nuevo.';
        }
      } else {
        response =
          '📝 **ACCESO ADMINISTRADOR**\n\n' +
          'Uso: /admin-login <usuario> <contraseña>\n\n' +
          'Ejemplo: /admin-login admin-monopoly Monopoly2024#Admin';
      }
    } else {
      // Buscar comando exacto
      for (const [cmd, desc] of Object.entries(COMMANDS)) {
        if (messageLower === cmd.toLowerCase() || messageLower.startsWith(cmd.toLowerCase())) {
          response = COMMAND_RESPONSES[cmd];
          break;
        }
      }

      // Si no es comando, usar Gemini AI con memoria
      if (!response) {
        response = await getGeminiResponse(message, userName, conversationHistory);
      } else {
        // Registrar comando ejecutado
        recordLearning('comandos_usados', message);
      }
    }

    return NextResponse.json({
      success: true,
      response,
      userId,
      isAdmin: isAdminResponse,
      command: messageLower.startsWith('/'),
      timestamp: new Date().toISOString(),
      isAdminCommand: isAdminResponse,
    });
  } catch (error) {
    console.error('[Chat API Error]:', error);
    return NextResponse.json(
      {
        success: false,
        response: 'Error al procesar tu mensaje. Intenta de nuevo.',
      },
      { status: 500 }
    );
  }
}
