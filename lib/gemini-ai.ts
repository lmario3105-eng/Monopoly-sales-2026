import { GoogleGenerativeAI } from '@google/generative-ai';

let genAI: GoogleGenerativeAI | null = null;

function getGenAI() {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('[Gemini] API key no configurada, usando modo simulado');
      return null;
    }
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
}

export async function generateAIResponse(
  userMessage: string,
  userName: string,
  userContext: {
    salesPoints: number;
    zone: string;
    recruits: number;
  },
): Promise<string> {
  try {
    const ai = getGenAI();
    if (!ai) {
      console.log('[Gemini] Modo simulado - generando respuesta local');
      return generateSimulatedResponse(userMessage, userName, userContext);
    }

    const model = ai.getGenerativeModel({ model: 'gemini-pro' });

    const systemPrompt = `Eres un asistente inteligente para "Monopolio de Ventas", un juego de ventas competitivo en WhatsApp.

Usuario: ${userName}
- Puntos de Venta: ${userContext.salesPoints}
- Zona: ${userContext.zone}
- Miembros Reclutados: ${userContext.recruits}

Debes:
1. Ser motivador y energético
2. Usar español colombiano casual
3. Dar respuestas cortas (máximo 3 líneas)
4. Ser útil sobre el juego de ventas
5. Mencionar si es necesario comandos disponibles

Comandos disponibles que puedes mencionar:
- registrar venta <categoria> <puntos>
- mi estado
- tabla de posiciones
- invitar miembros
- ayuda`;

    const response = await model.generateContent(`${systemPrompt}\n\nUsuario dice: "${userMessage}"`);
    const text = response.response.text();
    
    console.log(`[Gemini] Respuesta generada para ${userName}`);
    return text || generateSimulatedResponse(userMessage, userName, userContext);
  } catch (error) {
    console.error('[Gemini Error]:', error);
    console.log('[Gemini] Fallback a respuesta simulada');
    return generateSimulatedResponse(userMessage, userName, userContext);
  }
}

function generateSimulatedResponse(
  message: string,
  userName: string,
  context: { salesPoints: number; zone: string; recruits: number },
): string {
  const text = message.toLowerCase();

  if (text.includes('hola') || text.includes('que') || text.includes('cómo')) {
    const responses = [
      `Hola ${userName}! Estoy aquí para ayudarte con Monopolio de Ventas. Tienes ${context.salesPoints} puntos en la zona ${context.zone}. ¿Qué necesitas?`,
      `Bienvenido ${userName}! 🎮 Vas bien en tu zona. Escribe "ayuda" para ver qué puedes hacer.`,
      `¡Ey ${userName}! Veo que has acumulado ${context.salesPoints} puntos. ¿Listo para vender más?`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  if (text.includes('venta') || text.includes('vender')) {
    return `Para registrar una venta, usa:\nregistrar venta <categoria> <puntos>\n\nCategorías: vape, destilado, ropa, accesorios`;
  }

  if (text.includes('puntos') || text.includes('estado')) {
    return `Tu estado:\n- Puntos: ${context.salesPoints}\n- Zona: ${context.zone}\n- Reclutas: ${context.recruits}\n\nEscribe "tabla de posiciones" para ver el ranking.`;
  }

  if (text.includes('motiv')) {
    const motivations = [
      `${userName}, ¡tú puedes! Cada venta te acerca más a los premios. Sigue adelante! 💪`,
      `Vas a lograrlo ${userName}. Falta poco para ser el líder de tu zona.`,
      `Recuerda ${userName}: cada punto cuenta. ¡Sigue vendiendo!`,
    ];
    return motivations[Math.floor(Math.random() * motivations.length)];
  }

  if (text.includes('ayuda') || text.includes('comando')) {
    return `COMANDOS:\n1️⃣ registrar venta <cat> <pts>\n2️⃣ mi estado\n3️⃣ tabla de posiciones\n4️⃣ invitar miembros`;
  }

  return `Entendí que escribiste: "${message}"\n\nNo estoy seguro de qué pedir. Escribe "ayuda" para ver los comandos disponibles.`;
}
