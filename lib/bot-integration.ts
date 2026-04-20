import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export interface BotMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  source: 'whatsapp' | 'web' | 'api';
}

export interface BotContext {
  userId: string;
  userName: string;
  teamName?: string;
  isAdmin: boolean;
  conversationHistory: BotMessage[];
}

export async function processMessageWithAI(
  message: string,
  context: BotContext
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const systemPrompt = `Eres un asistente de IA para un juego de ventas llamado "Monopolio de Ventas - Edición Montería".
Tu rol es ayudar a los jugadores con:
- Consultas de estadísticas y rankings
- Explicación de reglas
- Información de equipos
- Soporte general del juego

Usuario: ${context.userName}
Equipo: ${context.teamName || 'No especificado'}
Admin: ${context.isAdmin ? 'Sí' : 'No'}

Responde de manera concisa y amigable. Si no conoces algo específico del juego, sugiere contactar con un admin.`;

    const response = await model.generateContent([
      { text: systemPrompt },
      { text: message },
    ]);

    const result = response.response.text();
    return result;
  } catch (error) {
    console.error('[Bot AI Error]:', error);
    return 'Lo siento, hubo un error procesando tu mensaje. Intenta de nuevo.';
  }
}

export async function generateGameStats(gameState: any): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `Basándote en estos datos del juego, genera un resumen ejecutivo en español:
${JSON.stringify(gameState, null, 2)}

Incluye:
1. Estado actual del juego
2. Top 3 equipos
3. Predicción de ganadores
4. Puntos clave de atención`;

    const response = await model.generateContent(prompt);
    return response.response.text();
  } catch (error) {
    console.error('[Bot Stats Generation Error]:', error);
    return 'Error generando estadísticas';
  }
}
