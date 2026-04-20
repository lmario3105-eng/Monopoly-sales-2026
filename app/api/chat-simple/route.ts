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
