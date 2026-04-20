import { NextRequest, NextResponse } from 'next/server';
import { generateText } from 'ai';
import { google } from '@ai-sdk/google';

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Mensaje inválido' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key no configurada' },
        { status: 500 }
      );
    }

    // Usar el modelo Gemini a través de AI SDK
    const { text } = await generateText({
      model: google('gemini-2.0-flash'),
      system: `Eres un asistente de atención al cliente para Monopolio de Ventas, un juego de gamificación para equipos de ventas. 
      
Tienes acceso a información sobre:
- Estadísticas de jugadores
- Tabla de posiciones de equipos
- Reportes de desempeño
- Reglas del juego
- Motivación y reconocimiento de vendedores

Responde de forma amigable, profesional y concisa. Si el usuario pregunta algo fuera de tu área, sugiere que contacte al administrador.
Siempre menciona datos específicos cuando sea posible.`,
      prompt: message,
      temperature: 0.7,
      maxTokens: 300,
    });

    return NextResponse.json({
      response: text,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[v0] Error en chat:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    return NextResponse.json(
      { error: `Error procesando mensaje: ${errorMessage}` },
      { status: 500 }
    );
  }
}
