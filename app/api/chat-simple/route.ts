import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface ChatRequest {
  userId: string;
  userName: string;
  message: string;
  isAdmin?: boolean;
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Comandos disponibles
const COMMANDS: Record<string, string> = {
  '/help': 'Muestra todos los comandos disponibles',
  '/stats': 'Muestra estadísticas del juego',
  '/top': 'Muestra los top vendedores',
  '/teams': 'Muestra los equipos en juego',
  '/status': 'Estado actual del sistema',
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
    '• /status - Estado del sistema\n\n' +
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

async function getGeminiResponse(message: string): Promise<string> {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return 'Error: Gemini API no está configurada.';
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const systemPrompt = `Eres un asistente amigable para un juego de Monopolio de Ventas. 
    Responde preguntas sobre:
    - Estadísticas del juego
    - Ranking de vendedores
    - Información de equipos
    - Mecánicas del juego
    
    Sé conciso, usa emojis relevantes y sé profesional.`;

    const chat = model.startChat({
      history: [],
      generationConfig: {
        maxOutputTokens: 200,
      },
    });

    const result = await chat.sendMessage(`${systemPrompt}\n\nUsuario pregunta: ${message}`);
    const response = result.response.text();

    return response || 'No pude procesar tu pregunta.';
  } catch (error) {
    console.error('[API Chat] Error con Gemini:', error);
    return 'Disculpa, tuve un error. Intenta más tarde.';
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = (await request.json()) as ChatRequest;
    const { userId, userName, message, isAdmin = false } = body;

    if (!userId || !message) {
      return NextResponse.json(
        { success: false, response: 'Parámetros incompletos' },
        { status: 400 }
      );
    }

    console.log(`[Chat API] Mensaje de ${userName}: ${message}`);

    const messageLower = message.toLowerCase().trim();

    // Buscar comando exacto
    let response = '';

    for (const [cmd, desc] of Object.entries(COMMANDS)) {
      if (messageLower === cmd.toLowerCase() || messageLower.startsWith(cmd.toLowerCase())) {
        response = COMMAND_RESPONSES[cmd];
        break;
      }
    }

    // Si no es comando, usar Gemini AI
    if (!response) {
      response = await getGeminiResponse(message);
    }

    return NextResponse.json({
      success: true,
      response,
      userId,
      command: messageLower.startsWith('/'),
      timestamp: new Date().toISOString(),
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
